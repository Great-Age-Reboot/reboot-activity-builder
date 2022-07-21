import { Box } from "@mui/material";
import React from "react";

export class TabPanel extends React.Component<{ children: React.ReactNode; value: number; index: number }> {
  render() {
    return <div>{this.props.value === this.props.index && <Box p={3}>{this.props.children}</Box>}</div>;
  }
}
