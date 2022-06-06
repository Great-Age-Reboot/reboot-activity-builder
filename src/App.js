import './App.css';
import Form from '@rjsf/material-ui/v5';
import {Box, Tab, Tabs, TextField} from '@mui/material'
import React from 'react';
import MDEditor from '@uiw/react-md-editor';

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

// function getTextWidget(props) {
//   return (
//     <TextField fullWidth={true}
//       value={props.value}
//       required={props.required}
//       onChange={(event) => props.onChange(event.target.value)} />
//   );
// }

const schema = require('./schema.json');

const exampleActivity1 = {
  "identifier":  "b935e466-d71f-11eb-b8bc-0242ac130003",
  "steps": [
    {
      "$type": "InstructionStep",
      "identifier": "obesity_1",
      "title": "Healthy Weight",
      "detailText": "What is Obesity?",
      "text": "**What’s the Difference Between Being Overweight and Obese?** \n\nWorldwide, the rate of child and teenage obesity quadrupled from 1975 to 2016. And in America, adult obesity has gone up just as much in the same time frame. These are staggering numbers! Especially since being overweight or obese can make you vulnerable to a slew of health conditions—like type-2 diabetes and cardiovascualr disease.\n\nThe words “obese” and “overweight” are often used interchangeably, but they aren’t the same. In terms of the Body Max Index (BMI) scale, anyway …. \n\nIn case you skipped gym class the day it was taught, simply put, BMI is the ratio of body weight to height. The higher your BMI, the higher your ratio of body fat. And the higher your ratio of body fat, the more likely you are to develop health issues down the line.\n\nIf you have a BMI of between 18.5 and 24.9, you’re considered to be in the normal range. However, having a BMI of over 25 is considered overweight and a BMI of over 30 is categorized as obese. \n\nDon’t know your BMI number? We’re providing a BMI calculator for you, so you don’t have to do the math. You’re welcome. \n\nIf your results make you nervous, don’t fret yet…. \n\n**The Problems with BMI**\nAs it turns out, BMI isn’t actually all that accurate when it comes to judging overall health. Muscle mass and fat mass have very different effects on the body. However BMI doesn’t differentiate between the two.\n\nSo—as an example—when Arnold Schwarzenegger was at the height of his bodybuilding career, his BMI was 33. According to the BMI scale, he was obese. Same goes for Dwayne “The Rock” Johnson who has a BMI of just over 34. We think it’s safe to say neither of these (extremely muscular!) men are an unhealthy weight, don’t you?   \n\nBMI’s other big flaw is that not all fat is made equal. Case in point, visceral fat and gluteofemoral fat. Visceral fat— belly fat—is much more harmful to have than gluteofemoral fat—buttock and thigh fat (which is beneficial when twerking). \n\nIn other words, it’s possible to have a high BMI without having the kind of fat that’s bad for your health. (More on that soon.)\n\nSo, as you can see, BMI isn’t really the best overall predictor of health. \n\nIt’s good in a pinch—because let’s face it—most of us aren’t professional bodybuilders. However, when it comes to your overall health, your body’s fat distribution is just as important as the numbers you see on the scale. That’s why the waist-to-height ratio is a much better measure of overall health \n\n“What’s the waist-to-height ratio?” We’re so glad you asked. Stay tuned as the answer is coming up after this little quiz. \n\n"
    },
    {
      "$type": "TypeformSurveyStep",
      "identifier": "typeform_bmi_1",
      "formId": "jaaJdLSQ"
    }
  ]
}

const exampleActivity2 = 
{
  "steps": [
    {
      "$type":"QuestionStep",
      "identifier":"bp_monitor_purchase_question_1",
      "title":"Lets Get a BP Monitor",
      "question": "Do You Own a Blood Pressure Monitor?",
      "text": "TextChoice- MultipleChoice",
      "answerFormat":{
        "$type":"TextChoiceAnswerFormat",
        "style": "MultipleChoice",
        "textChoices": [
          {
            "value": 1,
            "text": "Yes, I have one"
          },
          {
            "value": 2,
            "text": "No, but I am going to get one"
          },
          {
            "value": 3,
            "text": "No, and I don't think I need one"
          }
        ]
      }
    },
    {
      "$type": "TypeformSurveyStep",
      "identifier": "typeform_bmi_1",
      "formId": "jaaJdLSQ"
    }
  ],
  "identifier": "b935e466-d71f-11eb-b8bc-0242ac130003"
}

let exampleActivity = exampleActivity1;
if (true) {
  exampleActivity = exampleActivity2;
}

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
          }
        }
      }
    }
  },
  "ui:submitButtonOptions": {
    "norender": true,
  }
}


function App() {
  const [tabValue, setTabValue] = React.useState(0);
  const [formData, setFormData] = React.useState({
    obj: exampleActivity, 
    json: JSON.stringify(exampleActivity, null, 2)
  });
  function handleTabChange(event, newTabValue) {
    setTabValue(newTabValue);
  }
  function handleFormDataObjChange(event, newFormDataObj) {
    const newFormData = {
      obj: newFormDataObj,
      json: JSON.stringify(newFormDataObj, null, 2),
    }
    setFormData(newFormData);
  }
  function handleFormDataJsonChange(event, newFormDataJson) {
    let newFormDataObj;
    try {
      newFormDataObj = JSON.parse(newFormDataJson);
    } catch (e) {
      newFormDataObj = formData.obj;
    }
    const newFormData = {
      obj: newFormDataObj,
      json: newFormDataJson,
    }
    setFormData(newFormData);
  }
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Builder" />
          <Tab label="JSON" />
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
        />
      </TabPanel>
    </Box>
  );
}

export default App;
