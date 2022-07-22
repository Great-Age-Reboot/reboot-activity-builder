import "./App.css";
import Form, { ErrorSchema, IChangeEvent, UiSchema } from "@rjsf/core";
import { default as Widgets } from "@rjsf/core/lib/components/widgets";
import { Box, Tab, Tabs, TextField } from "@mui/material";
import React from "react";
import { MermaidAdapter } from "./Mermaid";
import { TabPanel } from "./TabPanel";
import { MarkdownWidget } from "./MarkdownWidget";
import { CopyPasteButtons } from "./CopyPasteButtons";

interface StringFieldProps {
  registry: {
    rootSchema: any
  };
  schema: object;
  value: string;
  onChange: (arg0: string) => void  
}

function getMarkdownOrTextWidget(props: StringFieldProps) {
  // For the QuestionStep text, this isn't markdown, but for the other types, it is
  // To find out if we're QuestionStep text, we'll find that entry in the rootSchema and
  // compare our props.schema to see if they're the same object.
  const questionStepTextSchema= props.registry.rootSchema["$defs"].Step.oneOf.find(
    (stepType: { title: string }) => stepType.title === "QuestionStep"
  ).properties["text"];
  if (props.schema === questionStepTextSchema) {
    return Widgets.TextWidget(props);
  }
  return <MarkdownWidget {...props} />;
}

const schema = require("./schema.json");
//  I haven't debugged this, but the $id property prevents react-jsonschema-form from properly handling the json
delete schema["$id"];

const uiSchema: UiSchema = {
  steps: {
    "ui:placeholder": "Choose one",
    items: {
      $type: {
        "ui:readonly": true,
      },
      question: {
        "ui:widget": MarkdownWidget,
      },
      text: {
        "ui:widget": getMarkdownOrTextWidget, // this may not be markdown
      },
      formItems: {
        items: {
          text: {
            "ui:widget": MarkdownWidget,
          },
        },
      },
    },
  },
  // "stepNavigationRules": {
  //   "ui:description": "disabled",
  //   "ui:widget": "hidden"
  // },
  // "userInfoRules": {
  //   "ui:description": "disabled",
  //   "ui:widget": "hidden"
  // },
  // "progressRule": {
  //   "ui:widget": "hidden"
  // },
  // "templateVariableRules": {
  //   "ui:description": "disabled",
  //   "ui:widget": "hidden"
  // },
  // "habitBuilderProgressRule": {
  //   "ui:widget": "hidden"
  // },
  "ui:submitButtonOptions": {
    submitText: "",
    norender: true,
    props: {},
  },
};

function jsonStringify(obj: { [s: string]: any }) {
  const optionalObjectProperties = [
    "stepNavigationRules",
    "userInfoRules",
    "progressRule",
    "templateVariableRules",
    "habitBuilderProgressRule",
  ];
  let objCopy: {[s: string]: any } = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!optionalObjectProperties.includes(key) || Object.keys(value).length !== 0) {
      objCopy[key] = value;
    }
  }
  let json = JSON.stringify(objCopy, null, 2);
  return json;
}

class App extends React.Component<{}, { tabValue: number; obj: {}; json: string; error: boolean }> {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleFormDataObjChange = this.handleFormDataObjChange.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handlePasteStateChange = this.handlePasteStateChange.bind(this);

    this.state = {
      tabValue: 0,
      obj: {},
      json: jsonStringify({}),
      error: false,
    };
  }

  handleTabChange(event: React.SyntheticEvent, value: number) {
    this.setState({ tabValue: value });
  }

  handleFormDataObjChange(event: IChangeEvent<{ formData: {} }>, es: ErrorSchema) {
    this.setState({
      obj: event.formData,
      json: jsonStringify(event.formData),
      error: false,
    });
  }

  handleTextFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.updateStateFromJSON(event.target.value);
  }

  handlePasteStateChange(newText: string) {
    this.updateStateFromJSON(newText);
  }

  updateStateFromJSON(newFormDataJson: string) {
    let newFormDataObj: {};
    let error: boolean;
    try {
      newFormDataObj = JSON.parse(newFormDataJson);
      error = false;
    } catch (e) {
      console.log("error: ", e);
      newFormDataObj = this.state.obj;
      error = true;
    }
    this.setState({
      obj: newFormDataObj,
      json: newFormDataJson,
      error: error,
    });
  }

  render() {
    return (
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={this.state.tabValue} onChange={this.handleTabChange}>
            <Tab label="Builder" />
            <Tab label="JSON" />
            <Tab label="Mermaid" />
          </Tabs>
        </Box>
        <TabPanel value={this.state.tabValue} index={0}>
          <Form schema={schema} formData={this.state.obj} uiSchema={uiSchema} onChange={this.handleFormDataObjChange} />
        </TabPanel>
        <TabPanel value={this.state.tabValue} index={1}>
          <CopyPasteButtons value={this.state.json} onChange={this.handlePasteStateChange} />
          <TextField
            value={this.state.json}
            multiline={true}
            fullWidth={true}
            onChange={this.handleTextFieldChange}
            helperText={this.state.error ? "Invalid JSON" : "JSON"}
            error={this.state.error}
          />
        </TabPanel>
        <TabPanel value={this.state.tabValue} index={2}>
          <div className="App">
            <MermaidAdapter task={this.state.obj} />
          </div>
        </TabPanel>
      </Box>
    );
  }
}

export default App;
