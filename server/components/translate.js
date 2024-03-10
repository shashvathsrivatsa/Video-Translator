async function translate(sourceLanguage='en', targetLanguage='fr', text) {
    const key1 = '4d6ef65f19msh9b74fcc7b3ad345p1f9d78jsn4371557c7a02';
    const key2 = '08399146damsh0fc2d0852a27fdap107db6jsnd8819fea2a96';

    const url = 'https://text-translator2.p.rapidapi.com/translate';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': key2,
            'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
        },
        body: new URLSearchParams({
            source_language: sourceLanguage,
            target_language: targetLanguage,
            text: text
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        const translatedText = data.data.translatedText;
        return translatedText;
    } catch (error) {
        console.error(`Error translating: ${error}`);
    }
}

// translate('en', 'hi', 'Hello').then(console.log);

module.exports = { translate };
