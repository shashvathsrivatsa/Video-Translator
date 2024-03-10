const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const { extractAudio } = require('./components/extract-audio');
const { transcribeAudio } = require('./components/stt');
const { translate } = require('./components/translate');
const { textToSpeech } = require('./components/tts');

const app = express();
// const upload = multer({ dest: 'src/' });
const upload = multer({ storage: multer.memoryStorage() });

const cors = require('cors');
app.use(cors());

app.post('/upload', upload.single('file'), (req, res) => {
    console.log('Received file:', req.file.originalname);
    fs.rename(req.file.path, path.join(req.file.destination, 'input.mp3'), err => {
        if (err) return res.sendStatus(500);
        res.sendStatus(200);
    });
});

app.get('/process', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write('data: Processing audio...\n\n');
    const transcription = await transcribeAudio('src/input.mp3');

    res.write('data: Translating processed text...\n\n');
    const translation = await translate('en', 'fr', transcription);

    res.write('data: Converting translated text to speech...\n\n');
    textToSpeech(translation);
    
    res.write('data: Audio processing complete\n\n');
    res.end();
});

app.post('/takeVideo', upload.single('file'), async (req, res) => {
    try {
        console.log('Received file:', req.file.originalname);
        const langCode = getLanguageCode(req.body.language);

        console.log('Writing to video.mp4...');
        await fs.promises.writeFile('./src/video.mp4', req.file.buffer);

        console.log('Extracting audio from video...');
        await extractAudio('./src/video.mp4', './src/audio.mp3');

        console.log('Getting text from audio...');
        const transcription = await transcribeAudio('./src/audio.mp3');

        console.log('Translating text...');
        const translation = await translate('en', langCode, transcription);

        console.log('Converting translated text to speech...');
        await textToSpeech(translation);

        console.log('Replacing audio in video...');
        await replaceAudio('./src/video.mp4', './src/output.mp3', './src/final.mp4');

        console.log('Audio processing complete');

        res.sendStatus(200);

    } catch (err) {
        console.log('Error:', err);
        res.sendStatus(500);
    }
});

function replaceAudio(videoPath, audioPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .input(audioPath)
            .outputOptions(['-map 0:v', '-map 1:a', '-c:v copy', '-shortest'])
            .save(outputPath)
            .on('end', resolve)
            .on('error', reject);
    });
}

function getLanguageCode(name) {
    const language = languages.find(lang => lang.name.toLowerCase() === name.toLowerCase());
    return language ? language.code : null;
}

app.post('/replaceAudio', async (req, res) => {
    try {
        console.log('Received file:', req.file.originalname);
        console.log('Writing to audio.mp3...');
        await fs.promises.writeFile('./src/audio.mp3', req.file.buffer);
        await replaceAudio();
    } catch (err) {
        console.log('Error:', err);
        res.sendStatus(500);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

const languages = [
    {
        "code": "af",
        "name": "Afrikaans"
    },
    {
        "code": "sq",
        "name": "Albanian"
    },
    {
        "code": "am",
        "name": "Amharic"
    },
    {
        "code": "ar",
        "name": "Arabic"
    },
    {
        "code": "hy",
        "name": "Armenian"
    },
    {
        "code": "az",
        "name": "Azerbaijani"
    },
    {
        "code": "eu",
        "name": "Basque"
    },
    {
        "code": "be",
        "name": "Belarusian"
    },
    {
        "code": "bn",
        "name": "Bengali"
    },
    {
        "code": "bs",
        "name": "Bosnian"
    },
    {
        "code": "bg",
        "name": "Bulgarian"
    },
    {
        "code": "ca",
        "name": "Catalan"
    },
    {
        "code": "ceb",
        "name": "Cebuano"
    },
    {
        "code": "ny",
        "name": "Chichewa"
    },
    {
        "code": "zh-CN",
        "name": "Chinese (Simplified)"
    },
    {
        "code": "zh-TW",
        "name": "Chinese (Traditional)"
    },
    {
        "code": "co",
        "name": "Corsican"
    },
    {
        "code": "hr",
        "name": "Croatian"
    },
    {
        "code": "cs",
        "name": "Czech"
    },
    {
        "code": "da",
        "name": "Danish"
    },
    {
        "code": "nl",
        "name": "Dutch"
    },
    {
        "code": "en",
        "name": "English"
    },
    {
        "code": "eo",
        "name": "Esperanto"
    },
    {
        "code": "et",
        "name": "Estonian"
    },
    {
        "code": "tl",
        "name": "Filipino"
    },
    {
        "code": "fi",
        "name": "Finnish"
    },
    {
        "code": "fr",
        "name": "French"
    },
    {
        "code": "fy",
        "name": "Frisian"
    },
    {
        "code": "gl",
        "name": "Galician"
    },
    {
        "code": "ka",
        "name": "Georgian"
    },
    {
        "code": "de",
        "name": "German"
    },
    {
        "code": "el",
        "name": "Greek"
    },
    {
        "code": "gu",
        "name": "Gujarati"
    },
    {
        "code": "ht",
        "name": "Haitian Creole"
    },
    {
        "code": "ha",
        "name": "Hausa"
    },
    {
        "code": "haw",
        "name": "Hawaiian"
    },
    {
        "code": "iw",
        "name": "Hebrew"
    },
    {
        "code": "hi",
        "name": "Hindi"
    },
    {
        "code": "hmn",
        "name": "Hmong"
    },
    {
        "code": "hu",
        "name": "Hungarian"
    },
    {
        "code": "is",
        "name": "Icelandic"
    },
    {
        "code": "ig",
        "name": "Igbo"
    },
    {
        "code": "id",
        "name": "Indonesian"
    },
    {
        "code": "ga",
        "name": "Irish"
    },
    {
        "code": "it",
        "name": "Italian"
    },
    {
        "code": "ja",
        "name": "Japanese"
    },
    {
        "code": "jw",
        "name": "Javanese"
    },
    {
        "code": "kn",
        "name": "Kannada"
    },
    {
        "code": "kk",
        "name": "Kazakh"
    },
    {
        "code": "km",
        "name": "Khmer"
    },
    {
        "code": "rw",
        "name": "Kinyarwanda"
    },
    {
        "code": "ko",
        "name": "Korean"
    },
    {
        "code": "ku",
        "name": "Kurdish (Kurmanji)"
    },
    {
        "code": "ky",
        "name": "Kyrgyz"
    },
    {
        "code": "lo",
        "name": "Lao"
    },
    {
        "code": "la",
        "name": "Latin"
    },
    {
        "code": "lv",
        "name": "Latvian"
    },
    {
        "code": "lt",
        "name": "Lithuanian"
    },
    {
        "code": "lb",
        "name": "Luxembourgish"
    },
    {
        "code": "mk",
        "name": "Macedonian"
    },
    {
        "code": "mg",
        "name": "Malagasy"
    },
    {
        "code": "ms",
        "name": "Malay"
    },
    {
        "code": "ml",
        "name": "Malayalam"
    },
    {
        "code": "mt",
        "name": "Maltese"
    },
    {
        "code": "mi",
        "name": "Maori"
    },
    {
        "code": "mr",
        "name": "Marathi"
    },
    {
        "code": "mn",
        "name": "Mongolian"
    },
    {
        "code": "my",
        "name": "Myanmar (Burmese)"
    },
    {
        "code": "ne",
        "name": "Nepali"
    },
    {
        "code": "no",
        "name": "Norwegian"
    },
    {
        "code": "or",
        "name": "Odia (Oriya)"
    },
    {
        "code": "ps",
        "name": "Pashto"
    },
    {
        "code": "fa",
        "name": "Persian"
    },
    {
        "code": "pl",
        "name": "Polish"
    },
    {
        "code": "pt",
        "name": "Portuguese"
    },
    {
        "code": "pa",
        "name": "Punjabi"
    },
    {
        "code": "ro",
        "name": "Romanian"
    },
    {
        "code": "ru",
        "name": "Russian"
    },
    {
        "code": "sm",
        "name": "Samoan"
    },
    {
        "code": "gd",
        "name": "Scots Gaelic"
    },
    {
        "code": "sr",
        "name": "Serbian"
    },
    {
        "code": "st",
        "name": "Sesotho"
    },
    {
        "code": "sn",
        "name": "Shona"
    },
    {
        "code": "sd",
        "name": "Sindhi"
    },
    {
        "code": "si",
        "name": "Sinhala"
    },
    {
        "code": "sk",
        "name": "Slovak"
    },
    {
        "code": "sl",
        "name": "Slovenian"
    },
    {
        "code": "so",
        "name": "Somali"
    },
    {
        "code": "es",
        "name": "Spanish"
    },
    {
        "code": "su",
        "name": "Sundanese"
    },
    {
        "code": "sw",
        "name": "Swahili"
    },
    {
        "code": "sv",
        "name": "Swedish"
    },
    {
        "code": "tg",
        "name": "Tajik"
    },
    {
        "code": "ta",
        "name": "Tamil"
    },
    {
        "code": "tt",
        "name": "Tatar"
    },
    {
        "code": "te",
        "name": "Telugu"
    },
    {
        "code": "th",
        "name": "Thai"
    },
    {
        "code": "tr",
        "name": "Turkish"
    },
    {
        "code": "tk",
        "name": "Turkmen"
    },
    {
        "code": "uk",
        "name": "Ukrainian"
    },
    {
        "code": "ur",
        "name": "Urdu"
    },
    {
        "code": "ug",
        "name": "Uyghur"
    },
    {
        "code": "uz",
        "name": "Uzbek"
    },
    {
        "code": "vi",
        "name": "Vietnamese"
    },
    {
        "code": "cy",
        "name": "Welsh"
    },
    {
        "code": "xh",
        "name": "Xhosa"
    },
    {
        "code": "yi",
        "name": "Yiddish"
    },
    {
        "code": "yo",
        "name": "Yoruba"
    },
    {
        "code": "zu",
        "name": "Zulu"
    },
    {
        "code": "he",
        "name": "Hebrew"
    },
    {
        "code": "zh",
        "name": "Chinese (Simplified)"
    }
];