const fs = require('fs');

fetch('https://text-translator2.p.rapidapi.com/getLanguages?', {
    headers: {
        "X-RapidAPI-Key": "4d6ef65f19msh9b74fcc7b3ad345p1f9d78jsn4371557c7a02",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com"
    }
})
    .then(response => response.json())
    .then(data => {
        const languages = data.data.languages;
        console.log(languages);

        fs.writeFile('languages.json', JSON.stringify(languages), (err) => {
            if (err) throw err;
            console.log('Languages data saved to file.');
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });