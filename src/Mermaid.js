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
  
export function getMermaidString(obj) {
    let nodesById = {};
    if (obj && obj.steps) {
        let lines = ["flowchart LR"];
        lines.push(`A((start))`);
        for (let i = 0; i < obj.steps.length; i++) {
            let step = obj.steps[i];
            let stepName = `S${i}`;
            nodesById[step.identifier] = stepName;
            lines.push(`${stepName}[${step.identifier}]`);
        }
        lines.push(`E((finish))`);
        if (obj.steps.length === 0) {
            lines.push(`A --> E`)
        } else {
            let step = obj.steps[0]
            lines.push(`A --> S0[${step.identifier}]`)
        }
        nodesById["start"] = "A";
        for (let i = 0; i < obj.steps.length; i++) {
            let step = obj.steps[i];
            let stepName = `S${i}`;
            let navRule;
            if (obj.stepNavigationRules && step.identifier in obj.stepNavigationRules) {
                navRule = obj.stepNavigationRules[step.identifier];
            } else if (i + 1 < obj.steps.length) {
                navRule = {
                    "resultPredicates": [],
                    "defaultStepIdentifier": obj.steps[i + 1].identifier
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
