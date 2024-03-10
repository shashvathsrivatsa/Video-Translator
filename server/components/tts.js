const fetch = require('node-fetch');
const fs = require('fs');

// const XIApiKey = "b958212759fbfea43501c7185448297f"
// const XIApiKey = '0361b4de3727b3720f14ae4807177583'
// const XIApiKey = '240d3ab9d8ecfaf6c80ffc43b87d80e6'
const XIApiKey = 'c08589cb9be8b979eea3dd0d363f543c'

async function textToSpeech(text) {
    // const voiceId = "ZSkocXDzF1Z6OF9Gwni8";  // British / French
    // const voiceId2 = "b94Fi4k86pJGcI0c521v";  // English
    // const voiceId3 = "uR8pez6W0pCZESVoONyn";  // Indian
    // const voiceId4 = "JPjKsVPHkJEgN1Fyit0A";  // New API
    // const voiceId5 = 'dY9fWBb7TNkZB7UPeFK1' // API 3
    const voiceId5 = 'dY9fWBb7TNkZB7UPeFK1' // API 4

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId5}`;
    const headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": XIApiKey
    };
    const data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    };

    const response = await fetch(url, { method: 'POST', body: JSON.stringify(data), headers: headers });
    const fileStream = fs.createWriteStream('src/output.mp3');
    response.body.pipe(fileStream);
}

// textToSpeech('Hello! I am a robot. I like bananas. I can read any text you give me. Have a great day!');
// textToSpeech("Hello world! I am a text-to-speech bot! I will read this text and save it to an mp3 file. I am so cool! I like bananas. This is a test. This is only a test. If this were a real emergency, you would be instructed where to go and what to do. Thank you for your cooperation. Goodbye. Now, let's continue. I can read any text you give me. I can read it in different voices, too. I can read it in a British accent, a French accent, or an Indian accent. Isn't that amazing? I think it's pretty cool. I can also read text in different languages. For example, I can read text in English, French, and Hindi. However, please note that the accuracy of the pronunciation might vary depending on the language and the specific words. But don't worry, I'm always learning and improving. I hope you find this feature useful. Have a great day!");
// textToSpeech("Bonjour, je suis un bot de synthèse vocale ! Je vais lire ce texte et le sauvegarder dans un fichier mp3. Je suis trop cool !")
// textToSpeech("Namaste logo! Main ek robot hoon, aur mujhe kele khana pasand hai.")

module.exports = { textToSpeech };
