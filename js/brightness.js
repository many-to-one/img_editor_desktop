brightnessSlider = document.getElementById('BrightnessSlider');
brightnessValue = document.getElementById('BrightnessValue');

brightnessSlider.addEventListener('input', function (event) {
            
    brightnessValue.innerText = event.currentTarget.value;
            
    // if (!painted) return;
            
    redrawImage();

    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    applyBrightness(
        imageData.data,
        parseInt(brightnessSlider.value, 10)
    );
            
    context.putImageData(imageData, 0, 0);
});


function applyBrightness(data, brightness) {
    for (var i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] + (brightness - 100)));     // Red
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + (brightness - 100))); // Green
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + (brightness - 100))); // Blue
    }
}