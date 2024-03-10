const ffmpeg = require('ffmpeg');

function extractAudio(videoPath, outputPath) {
    return new Promise((resolve, reject) => {
        const process = new ffmpeg(videoPath);
        process.then((video) => {
            video.fnExtractSoundToMP3(outputPath, (error, file) => {
                if (error) {
                    console.error('Error extracting audio:', error);
                    reject(error);
                } else {
                    resolve(file);
                }
            });
        }).catch((error) => {
            console.error('Error processing video:', error);
            reject(error);
        });
    });
}

// const videoPath = 'src/video.mp4';
// const outputPath = 'src/audio.mp3';

// extractAudio(videoPath, outputPath);

module.exports = { extractAudio };