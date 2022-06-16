Missing Functionality
The freeform object types, including jsonlogic fields are not editable 
 - storageRules[i].jsonLogic
 - stepNavigationRules
 - stepNavigationRules[key].resultPredicates[i]
 - userInfoRules
 - progressRule
 - templateVariableRules
 - habitBuilderProgressRule

Minor nuisances
Some fields that are not markdown still use the markdown widget, because the field with the same name is markdown in a different object type.
Many of the objects that would be better represented as compact JSON get expanded/indented
For the objects in the textChoices array, the values could technically be general objects, but I've restricted them to either numbers or strings (input is converted to number when possible)