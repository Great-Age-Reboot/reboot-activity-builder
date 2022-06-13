Missing Functionality
The freeform object types, including jsonlogic fields are not editable 
 - storageRules[i].jsonLogic
 - stepNavigationRules
 - stepNavigationRules[key].resultPredicates[i]
 - userInfoRules
 - progressRule
 - templateVariableRules
 - habitBuilderProgressRule
When a new step is added, the selection defaults to InstructionStep, but you need to select something else to get the state set up (so for a QuestionStep, just change it to QuestionStep, but for an InstructionStep, change it to something else, then change it back)

Minor nuisances
Some fields that are not markdown still use the markdown widget, because the field with the same name is markdown in a different object type.
Many of the objects that would be better represented as compact JSON get expanded/indented
For the objects in the textChoices array, the values could technically be general objects, but I've had to force them to be numbers