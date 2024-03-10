const axios = require('axios');
const fs = require('fs');

async function transcribeAudio(audioFilePath) {
    const audioData = fs.readFileSync(audioFilePath);

    const uploadResponse = await axios.post('https://api.assemblyai.com/v2/upload', audioData, {
        headers: {
            'authorization': 'Bearer e8cd221e04d8499db831725b9c93c1aa'
        }
    });

    const transcriptResponse = await axios.post('https://api.assemblyai.com/v2/transcript', {
        'audio_url': uploadResponse.data.upload_url
    }, {
        headers: {
            'authorization': 'Bearer e8cd221e04d8499db831725b9c93c1aa'
        }
    });

    let transcript;
    do {
        await new Promise(resolve => setTimeout(resolve, 500));
        const statusResponse = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptResponse.data.id}`, {
            headers: {
                'authorization': 'Bearer e8cd221e04d8499db831725b9c93c1aa'
            }
        });
        transcript = statusResponse.data.text;
    } while (!transcript);

    return transcript;
}

// transcribeAudio('src/audio.mp3')
//     .then(transcript => console.log(transcript))
//     .catch(error => console.error(error));

module.exports = { transcribeAudio };