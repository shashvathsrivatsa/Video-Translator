let mediaRecorder;
let recordedChunks = [];

let recordingSide = {
    left: false,
    right: false
};

let leftRecordingInterval, rightRecordingInterval;

function record(button, side) {
    recordingSide[side] = !recordingSide[side];
    if (recordingSide[side] && !recordingSide[side == 'left' ? 'right' : 'left']) {
        button.innerHTML = '<i class="fa-solid fa-stop"></i>';
        document.getElementById(side + '-info-text').innerHTML = 'Starting...';
        startRecording(side);
    } else if (!recordingSide[side == 'left' ? 'right' : 'left']) {
        button.innerHTML = '';
        stopRecording(side);
    }
}

function startRecording(side) {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = handleDataAvailable;
            mediaRecorder.start();

            document.getElementById(side + '-info-text').innerHTML = '00:00.00';
            if (side == 'left') {
                leftRecordingInterval = setInterval(() => {
                    updateRecordingTime(side);
                }, 10);
            } else {
                rightRecordingInterval = setInterval(() => {
                    updateRecordingTime(side);
                }, 10);
            }
        });
}

function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
}

function updateRecordingTime(side) {
    let cur = parseInt(document.getElementById(side + '-info-text').dataset.time || '0');
    cur += 10;
    let minutes = Math.floor(cur / 60000);
    let seconds = Math.floor((cur / 1000) % 60);
    let centiseconds = Math.floor((cur / 10) % 100);
    document.getElementById(side + '-info-text').innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    document.getElementById(side + '-info-text').dataset.time = cur.toString();
}

async function stopRecording(side) {
    mediaRecorder.stop();
    const stopPromise = new Promise(resolve => {
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, {
                type: 'audio/mp3'
            });
            const file = new File([blob], `${side}_recording.mp3`, { type: 'audio/mp3' });
            const formData = new FormData();
            formData.append('file', file);
            fetch('http://localhost:3000/upload', { method: 'POST', body: formData })
                .then(() => resolve());
        };
    });

    if (side == 'left') {
        clearInterval(leftRecordingInterval);
    } else {
        clearInterval(rightRecordingInterval);
    }

    await stopPromise;

    const eventSource = new EventSource('http://localhost:3000/process');

    eventSource.onmessage = function(event) {
        document.getElementById(side + '-info-text').innerHTML = event.data;
        if (event.data === 'Audio processing complete') {
            eventSource.close();
            document.getElementById(side + '-info-text').innerHTML = '';
            playAudio();
        }
    };

    // eventSource.onerror = function(error) {
    //     console.error('EventSource failed:', error);
    // };
}

function playAudio() {
    const audio = new Audio('src/output.mp3');
    audio.oncanplaythrough = function() {
        audio.play();
    }
    audio.onerror = function() {
        console.log('Error occurred while loading audio file');
    }
}