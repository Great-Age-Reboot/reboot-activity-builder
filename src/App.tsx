import './App.css';
import Form, { IChangeEvent, UiSchema } from '@rjsf/core'
import { default as Widgets } from '@rjsf/core/lib/components/widgets';
import { Box, Tab, Tabs, TextField, Button } from '@mui/material'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { MermaidAdapter } from "./Mermaid";

function TabPanel(props: { [x: string]: any; children: any; value: any; index: any; }) {
  const { children, value, index, ...other } = props;
  return (
    <div {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function MarkdownWidget(props: { value: string; onChange: (arg0: string) => void; }) {
  return (
    <MDEditor
      value={props.value}
      onChange={(newValue) => props.onChange(newValue)}
    />
  );
}

const CopyPasteButtons = (props: { [x: string]: any; value: string; onChange: (arg0: string) => void; }) => {
  const { value, onChange, ...other } = props;
  const [status, setStatus] = React.useState('');

  const copyToClipboard = async (data: string) => {
    try {
      await navigator.clipboard.writeText(data);
      setStatus('');
    } catch (err) {
      setStatus('Unable to copy');
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const data = await navigator.clipboard.readText();
      onChange(data);
      setStatus('');
    } catch (err) {
      setStatus('Unable to paste');
    }
  };

  return (
    <div {...other}>
      <Button onClick={() => copyToClipboard(value)}><ContentCopy/></Button>
      <Button onClick={() => pasteFromClipboard()}><ContentPaste/></Button>
      {status}
    </div>
  )
}

function getMarkdownOrTextWidget(props: { registry?: any; schema?: any; value: string; onChange: (arg0: string) => void; }) {
  // For the QuestionStep text, this isn't markdown, but for the other types, it is
  // To find out if we're QuestionStep text, we'll find that entry in the rootSchema and
  // compare our props.schema to see if they're the same object.
  const questionStepType = props.registry.rootSchema["$defs"].Step.oneOf.find((stepType: { title: string; }) => stepType.title === "QuestionStep");
  if (props.schema === questionStepType.properties.text) {
    console.log(Widgets.TextWidget);
    return Widgets.TextWidget(props);
  }
  return MarkdownWidget(props)
}

const schema = require('./schema.json');
//  I haven't debugged this, but the $id property prevents react-jsonschema-form from properly handling the json
delete schema["$id"];

let exampleActivity = {};

const uiSchema: UiSchema = {
  "steps": {
    "ui:placeholder": "Choose one",
    "items": {
      "$type": {
        "ui:readonly": true
      },
      "question": {
        "ui:widget": MarkdownWidget
      },
      "text": {
        "ui:widget": getMarkdownOrTextWidget // this may not be markdown
      },
      "formItems": {
        "items": {
          "text": {
            "ui:widget": MarkdownWidget
          }
        }
      }
    }
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
    "submitText": '',
    "norender": true,
    "props": {}
  }
}

function jsonStringify(obj: { [s: string]: unknown; } ) {
  const optionalObjectProperties = [ "stepNavigationRules", "userInfoRules", "progressRule", "templateVariableRules", "habitBuilderProgressRule" ];
  let objCopy = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!optionalObjectProperties.includes(key) || Object.keys(value).length !== 0) {
      objCopy[key] = value;
    }
  }
  let json = JSON.stringify(objCopy, null, 2)
  return json
}

function App() {
  let exampleJson = jsonStringify(exampleActivity)
  const [tabValue, setTabValue] = React.useState(0);
  const [formData, setFormData] = React.useState({
    obj: exampleActivity, 
    json: exampleJson,
    error: false,
  });
  
  function handleTabChange(event: React.SyntheticEvent, newTabValue: React.SetStateAction<number>) {
    setTabValue(newTabValue);
  }

  function handleFormDataObjChange(event: IChangeEvent<{formData: {}}>) {
    setFormData({
      obj: event.formData,
      json: jsonStringify(event.formData),
      error: false,
    });
  }

  function handleFormDataJsonChange(event: React.ChangeEvent<HTMLInputElement>) {
    handleFormDataJsonChangeValue(event.target.value);
  }

  function handleFormDataJsonChangeValue(newFormDataJson: string) {
    let newFormDataObj: {};
    let error: boolean;
    try {
      newFormDataObj = JSON.parse(newFormDataJson);
      error = false;
    } catch (e) {
      newFormDataObj = formData.obj;
      error = true;
    }
    setFormData({
      obj: newFormDataObj,
      json: newFormDataJson,
      error: error,
    });
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Builder" />
          <Tab label="JSON" />
          <Tab label="Mermaid" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <Form
          schema={schema}
          formData={formData.obj}
          uiSchema={uiSchema}
          onChange={handleFormDataObjChange}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <CopyPasteButtons 
          value={formData.json} 
          onChange={handleFormDataJsonChangeValue}
        />
        <TextField 
          value={formData.json} 
          multiline={true} 
          fullWidth={true}
          onChange={handleFormDataJsonChange}
          helperText={formData.error ? "Invalid JSON" : "JSON"}
          error={formData.error}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <div className="App">
          <MermaidAdapter task={formData.obj} />
        </div>
      </TabPanel>
    </Box>
  );
}

export default App;
