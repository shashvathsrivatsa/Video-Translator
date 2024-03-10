const ffmpeg = require('fluent-ffmpeg');

function overlayAudioOnVideo(videoPath, audioPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .input(audioPath)
            .outputOptions(['-map 0:v', '-map 1:a', '-c:v copy', '-shortest'])
            .save(outputPath)
            .on('end', resolve)
            .on('error', reject);
    });
}

// Usage:
overlayAudioOnVideo('./src/video.mp4', './src/output.mp3', './src/final.mp4')
    .then(() => console.log('Finished processing'))
    .catch((error) => console.error('An error occurred: ' + error.message));