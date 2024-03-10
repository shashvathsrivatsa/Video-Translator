// https://github.com/extensionsapp/translatte/tree/master

const translatte = require('translatte');

translatte('आप इस ठीक सुबह कैसे हैं?', {to: 'en'}).then(res => {
    console.log(res.text);
}).catch(err => {
    console.error(err);
});
