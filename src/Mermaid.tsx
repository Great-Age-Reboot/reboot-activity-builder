import React from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
});

function getDestStepName(nodesById: { [x: string]: any; }, stepIdentifier: string) {
  if (stepIdentifier && stepIdentifier in nodesById) {
    return nodesById[stepIdentifier];
  }
  return "E";
}

function getStepProperties(steps: Step[], index: number): [Step | null, string, string] {
  if (index === -1) {
    return [null, "A", "start"];
  }
  let step = steps[index];
  let stepName = `S${index}`;
  let stepIdentifier = "undefined";
  if (step && step.identifier && typeof step.identifier === "string") {
    stepIdentifier = step.identifier;
  }
  return [step, stepName, stepIdentifier];
}

function getLinksForNavRule(navRule: StepNavigationRule, nodesById: {}, stepName: string, predStepName: string) {
  let lines = [];
  lines.push(`${stepName} --> ${predStepName}{?}`);
  for (let j = 0; j < navRule.destinationStepIdentifiers.length; j++) {
    let destStepName = getDestStepName(nodesById, navRule.destinationStepIdentifiers[j]);
    lines.push(`${predStepName} --> ${destStepName}`);
  }
  if (!(navRule.defaultStepIdentifier in navRule.destinationStepIdentifiers)) {
    let destStepName = getDestStepName(nodesById, navRule.defaultStepIdentifier);
    lines.push(`${predStepName} --> ${destStepName}`);
  }
  return lines;
}

export function getMermaidString(obj: NavigableTask) {
  let nodesById: {[s:string]: string} = {};
  if (obj && obj.steps) {
    let lines = ["flowchart LR"];
    lines.push(`A((start))`);
    for (let i = 0; i < obj.steps.length; i++) {
      let [, stepName, stepIdentifier] = getStepProperties(obj.steps, i);
      nodesById[stepIdentifier] = stepName;
      lines.push(`${stepName}[${stepIdentifier}]`);
    }
    lines.push(`E((finish))`);
    nodesById["start"] = "A";
    // Add links between steps
    for (let i = -1; i < obj.steps.length; i++) {
      let [, stepName, stepIdentifier] = getStepProperties(obj.steps, i);
      let navRule: StepNavigationRule;
      let predStepName = i >= 0 ? `P${i}` : "PA";
      if (obj.stepNavigationRules && stepIdentifier in obj.stepNavigationRules) {
        navRule = obj.stepNavigationRules[stepIdentifier];
      } else if (i + 1 < obj.steps.length) {
        let [, , nextStepIdentifier] = getStepProperties(obj.steps, i + 1);
        navRule = {
          resultPredicates: [],
          defaultStepIdentifier: nextStepIdentifier,
        };
      } else {
        navRule = {
          resultPredicates: [],
          defaultStepIdentifier: null,
        };
      }
      if (navRule.destinationStepIdentifiers && navRule.destinationStepIdentifiers.length > 0) {
        lines.push(...getLinksForNavRule(navRule, nodesById, stepName, predStepName));
      } else {
        let destStepName = getDestStepName(nodesById, navRule.defaultStepIdentifier);
        lines.push(`${stepName} --> ${destStepName}`);
      }
    }
    return lines.join("\n");
  }
  return "";
}

interface NavigableTask {
  steps?: Step[];
  stepNavigationRules?: StepNavigationRules;
}

interface StepNavigationRule {
  resultPredicates?: any[];
  destinationStepIdentifiers?: string[];
  defaultStepIdentifier?: string;
}

interface StepNavigationRules {
  [s: string]: StepNavigationRule
}

interface Step {
  identifier: string;
}

export interface MermaidAdapterProps {
  task: NavigableTask;
}

export class MermaidAdapter extends React.Component<MermaidAdapterProps> {
  text: string;

  constructor(props: MermaidAdapterProps) {
    super(props);
    // reducer to convert updated task to text
    this.text = getMermaidString(props.task)
  }

  render() {
    return <Mermaid text={this.text}/>;
  }
}

export interface MermaidProps {
  text: string;
}

export class Mermaid extends React.Component<MermaidProps> {

  componentDidMount() {
    mermaid.contentLoaded();
  }

  render() {
    return <div className="mermaid">{this.props.text}</div>;
  }
}
