const video: HTMLVideoElement = document.querySelector('.player'),
    canvas: HTMLCanvasElement = document.querySelector('.photo'),
    ctx = canvas.getContext('2d'),
    strip: HTMLVideoElement = document.querySelector('.strip'),
    snap: HTMLVideoElement = document.querySelector('.snap'),
    btn: HTMLVideoElement = document.querySelector('.btn');

(function () {
    // getting video input
    navigator.mediaDevices
        .getUserMedia({
            video: true,
            audio: false,
        })
        .then((localMediaStream) => {
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch((err) => console.error(err));
})();

function paintToCanvas() {
    const { videoWidth: width, videoHeight: height } = video;

    canvas.width = width;
    canvas.height = height;
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);

        // take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);

        // mess with them
        pixels = rgbSplit(pixels);
        ctx.globalAlpha = 0.1;

        // put them back
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();
    const data = canvas.toDataURL('image/jpeg'),
        link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'yourImage');
    link.innerHTML = `<img src=${data} alt="yourImage"/>`;
    strip.insertBefore(link, strip.firstChild);
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0]; // RED
        pixels.data[i + 100] = pixels.data[i + 1]; // GREEN
        pixels.data[i - 150] = pixels.data[i + 2]; // Blue
    }
    return pixels;
}

video.addEventListener('canplay', paintToCanvas);
btn.addEventListener('click', takePhoto);
