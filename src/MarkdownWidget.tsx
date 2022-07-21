import React from "react";
import MDEditor, { ContextStore } from "@uiw/react-md-editor";

export class MarkdownWidget extends React.Component<{ value: string, onChange: (arg0: string) => void }, { markdown: string }> {
  constructor(props: { value: string, onChange: (arg0: string) => void }) {
    super(props);
    this.state = { markdown: props.value };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>, state?: ContextStore) {
    this.setState({ markdown: value });
    this.props.onChange(value);
  }

  render() {
    return <MDEditor value={this.state.markdown} onChange={this.handleChange} />;
  }
}
