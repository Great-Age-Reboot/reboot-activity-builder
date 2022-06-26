import './App.css';
import Form from '@rjsf/material-ui/v5';
import {Box, Tab, Tabs, TextField} from '@mui/material'
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

function getMarkdownWidget(props) {
  return (
    <MDEditor
      value={props.value}
      onChange={(newValue) => props.onChange(newValue)}
    />
  );
}

const schema = require('./schema.json');

let exampleActivity = {};

const uiSchema = {
  "steps": {
    "ui:placeholder": "Choose one",
    "items": {
      "$type": {
        "ui:readonly": true
      },
      "question": {
        "ui:widget": getMarkdownWidget
      },
      "text": {
        "ui:widget": getMarkdownWidget // this may not be markdown
      },
      "formItems": {
        "items": {
          "text": {
            "ui:widget": getMarkdownWidget
          },
          "answerFormat": {
            "textChoices": {
              "value": {
                "ui:field": "NumberField",
                "ui:widget": "TextWidget"
              }
            }
          }
        }
      }
    }
  },
  // "stepNavigationRules": {
  //   "ui:widget": "hidden"
  // },
  // "userInfoRules": {
  //   "ui:widget": "hidden"
  // },
  // "progressRule": {
  //   "ui:widget": "hidden"
  // },
  // "templateVariableRules": {
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
