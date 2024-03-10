const transliteration = require('transliteration');

function transliterateToLatin(text) {
    return transliteration.transliterate(text);
}

console.log(transliterateToLatin("आप इस ठीक सुबह कैसे हैं?")); // Outputs: "aap is theek subah kaise hain?"