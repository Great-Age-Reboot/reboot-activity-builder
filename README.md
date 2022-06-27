### Missing Functionality
The freeform object types, including jsonlogic fields are not editable 
 - storageRules[i].jsonLogic
 - stepNavigationRules
 - stepNavigationRules[key].resultPredicates[i]
 - userInfoRules
 - progressRule
 - templateVariableRules
 - habitBuilderProgressRule
 
 For the TextChoiceAnswerFormat, the values could be objects, but if so, they are not editable.

### Minor nuisances
 - Many of the objects that would be better represented as compact JSON get expanded/indented

### GitHub Pages
This is deployed on GitHub pages at https://great-age-reboot.github.io/reboot-activity-builder/
To update the build, use the following command on a checked out copy of the repository.
```
npm run deploy
```
