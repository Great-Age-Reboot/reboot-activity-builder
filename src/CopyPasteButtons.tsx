import { Button } from "@mui/material";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import React from "react";

export class CopyPasteButtons extends React.Component<{ value: string; onChange: (arg0: string) => void }, { status: string }> {
  constructor(props: { [x: string]: any; value: string; onChange: (arg0: string) => void }) {
    super(props);
    this.state = {
      status: "",
    };
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.pasteFromClipboard = this.pasteFromClipboard.bind(this);
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.props.value);
      this.setState({ status: "" });
    } catch (err) {
      this.setState({ status: "Unable to copy" });
    }
  }

  async pasteFromClipboard() {
    try {
      const data = await navigator.clipboard.readText();
      this.props.onChange(data);
      this.setState({ status: "" });
    } catch (err) {
      this.setState({ status: "Unable to paste" });
    }
  }

  render() {
    return (
      <div>
        <Button onClick={this.copyToClipboard}>
          <ContentCopy />
        </Button>
        <Button onClick={this.pasteFromClipboard}>
          <ContentPaste />
        </Button>
        {this.state.status}
      </div>
    );
  }
}
