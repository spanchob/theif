import Choice from "./choice";
import _ from "lodash";
import Photopara from "./photopara";

function Ending(props: {
	title: string;
	traits: any;
	description: string;
	data: any;
	stateTraits: any;
	gameState: any;
	setState: any;
}) {
	function conditionParser(condition?: {
		conditional: string;
		a: string;
		b: any;
	}) {
		if (condition) {
			var aArray = condition.a.split(".");
			var a: any;
			if (props.gameState[aArray[0]] && aArray[1]) {
				a = [];
				props.gameState[aArray[0]].forEach((celeb: any) => {
					a.push(celeb[aArray[1]]);
				});
			} else if (props.gameState[aArray[0]]) {
				a = props.gameState[aArray[0]];
			} else {
				a = "";
			}
			return {
				conditional: condition.conditional,
				a: a,
				b: condition.b,
			};
		} else return null;
	}

	function conditionalChecker() {
		var checked = 0;
		var result = false;
		_.forIn(props.traits, (trait: any, key: string) => {
			if (trait.maximum) {
				result =
					_.max(Object.values(props.stateTraits)) ===
					props.stateTraits[key];
			}
			if (
				props.stateTraits[key] <= trait.upper &&
				props.stateTraits[key] >= trait.lower
			) {
				checked++;
			}
		});
		if (checked === Object.values(props.stateTraits).length) {
			return true;
		} else {
			return (
				result && checked === Object.values(props.stateTraits).length
			);
		}
	}

	if (conditionalChecker()) {
		return (
			<div className="choice">
				<div className="title">{props.title}</div>
				<div className="paragraph choices-description">
					{props.description}
				</div>

				{props.data.map((component: any) => {
					if (component.type === "choice" && component.choices) {
						return (
							<Choice
								title={component.title}
								choices={component.choices}
								description={component.description}
								maxChoice={component.pick}
								condition={conditionParser(component.condition)}
								state={{}}
								setState={() => {}}
							></Choice>
						);
					} else if (
						component.type === "photopara" &&
						typeof component.description !== "string"
					) {
						return (
							<Photopara
								title={component.title}
								condition={conditionParser(component.condition)}
								celeb={component.celeb}
								description={component.description}
							></Photopara>
						);
					} else return <></>;
				})}
			</div>
		);
	} else {
		return <></>;
	}
}

export default Ending;
