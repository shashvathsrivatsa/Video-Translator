document.getElementById('upload-btn').addEventListener('click', function () {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('input', function (event) {
    document.getElementById('upload-btn').innerHTML = 'Converting...';
    const file = event.target.files[0];
    const language = document.getElementById('language-select').value;
    let formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    fetch('http://localhost:3000/takeVideo', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('finished');
        document.getElementById('video-player').src = 'src/final.mp4';
        document.getElementById('video-player').style.display = 'block';
        document.querySelector('.container').style.display = 'none';
    })
    .catch(error => {
        console.log('Error: ', error);
    });
});