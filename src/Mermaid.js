import React from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
});


function getDestStepName(nodesById, stepIdentifier) {
    if (stepIdentifier && stepIdentifier in nodesById) {
      return nodesById[stepIdentifier];
    }
    return "E";
}

function getStepProperties(steps, index) {
    let step = steps[index];
    let stepName = `S${index}`;
    let stepIdentifier = "undefined";
    if (step && step.identifier && typeof step.identifier === "string") {
        stepIdentifier = step.identifier;
    }
    return [step, stepName, stepIdentifier];
}

export function getMermaidString(obj) {
    let nodesById = {};
    if (obj && obj.steps) {
        let lines = ["flowchart LR"];
        lines.push(`A((start))`);
        for (let i = 0; i < obj.steps.length; i++) {
            let [, stepName, stepIdentifier] = getStepProperties(obj.steps, i);
            nodesById[stepIdentifier] = stepName;
            lines.push(`${stepName}[${stepIdentifier}]`);
        }
        lines.push(`E((finish))`);
        if (obj.steps.length === 0) {
            lines.push(`A --> E`)
        } else {
            let [, stepName, stepIdentifier] = getStepProperties(obj.steps, 0);
            lines.push(`A --> ${stepName}[${stepIdentifier}]`)
        }
        nodesById["start"] = "A";
        for (let i = 0; i < obj.steps.length; i++) {
            let [, stepName, stepIdentifier] = getStepProperties(obj.steps, i);
            let navRule;
            if (obj.stepNavigationRules && stepIdentifier in obj.stepNavigationRules) {
                navRule = obj.stepNavigationRules[stepIdentifier];
            } else if (i + 1 < obj.steps.length) {
                let [, , nextStepIdentifier] = getStepProperties(obj.steps, i + 1);
                navRule = {
                    "resultPredicates": [],
                    "defaultStepIdentifier": nextStepIdentifier
                }
            } else {
                navRule = {
                    "resultPredicates": [],
                    "defaultStepIdentifier": null
                }
            }
            if (navRule.destinationStepIdentifiers && navRule.destinationStepIdentifiers.length > 0) {
                let predStepName = `P${i}`;
                lines.push(`${stepName} --> ${predStepName}{?}`);
                for (let j = 0; j < navRule.destinationStepIdentifiers.length; j++) {
                    let destStepName = getDestStepName(nodesById, navRule.destinationStepIdentifiers[j])
                    lines.push(`${predStepName} --> ${destStepName}`);
                }
                if (!(navRule.defaultStepIdentifier in navRule.destinationStepIdentifiers)) {
                    let destStepName = getDestStepName(nodesById, navRule.defaultStepIdentifier);
                    lines.push(`${predStepName} --> ${destStepName}`);
                }
            } else {
                let destStepName = getDestStepName(nodesById, navRule.defaultStepIdentifier);
                lines.push(`${stepName} --> ${destStepName}`);
            }
        }
        return lines.join("\n");
    }
    return "";
}

export default class Mermaid extends React.Component {
  componentDidMount() {
    mermaid.contentLoaded();
  }
  render() {
    return <div className="mermaid">{this.props.chart}</div>;
  }
}
