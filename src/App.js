import './App.css';
import Form from '@rjsf/core'
import { default as Widgets } from '@rjsf/core/lib/components/widgets';
import {Box, Tab, Tabs, TextField, Button} from '@mui/material'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { default as Mermaid, getMermaidString } from "./Mermaid";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function MarkdownWidget(props) {
  return (
    <MDEditor
      value={props.value}
      onChange={(newValue) => props.onChange(newValue)}
    />
  );
}

const CopyPasteButtons = (props) => {
  const { value, onChange, ...other } = props;
  const [status, setStatus] = React.useState('');

  const copyToClipboard = async data => {
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
      onChange({"target": {"value": data}});
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

function getMarkdownOrTextWidget(props) {
  // For the QuestionStep text, this isn't markdown, but for the other types, it is
  // To find out if we're QuestionStep text, we'll find that entry in the rootSchema and
  // compare our props.schema to see if they're the same object.
  const questionStepType = props.registry.rootSchema["$defs"].Step.oneOf.find((stepType) => stepType.title === "QuestionStep");
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

const uiSchema = {
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
    "norender": true,
  }
}

function jsonStringify(obj) {
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
  let mermaidString = getMermaidString(exampleActivity)
  const [tabValue, setTabValue] = React.useState(0);
  const [formData, setFormData] = React.useState({
    obj: exampleActivity, 
    json: exampleJson,
    error: false,
    mermaid: mermaidString
  });
  function handleTabChange(event, newTabValue) {
    setTabValue(newTabValue);
  }
  function handleFormDataObjChange(event, newFormDataObj) {
    const newFormData = {
      obj: newFormDataObj,
      json: jsonStringify(newFormDataObj),
      error: false,
      mermaid: getMermaidString(newFormDataObj)
    }
    setFormData(newFormData);
  }
  function handleFormDataJsonChange(event, newFormDataJson) {
    let newFormDataObj;
    let error;
    try {
      newFormDataObj = JSON.parse(newFormDataJson);
      error = false;
    } catch (e) {
      newFormDataObj = formData.obj;
      error = true;
    }
    const newFormData = {
      obj: newFormDataObj,
      json: newFormDataJson,
      error: error,
      mermaid: getMermaidString(newFormDataObj)
    }
    setFormData(newFormData);
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
          onChange={e => handleFormDataObjChange(e, e.formData)}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <CopyPasteButtons 
          value={formData.json} 
          onChange={e => handleFormDataJsonChange(e, e.target.value)}
        />
        <TextField 
          value={formData.json} 
          multiline={true} 
          fullWidth={true}
          onChange={e => handleFormDataJsonChange(e, e.target.value)}
          helperText={formData.error ? "Invalid JSON" : "JSON"}
          error={formData.error}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <div className="App">
          <Mermaid chart={formData.mermaid} />
        </div>
      </TabPanel>
    </Box>
  );
}

export default App;