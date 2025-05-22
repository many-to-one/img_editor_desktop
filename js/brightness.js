brightnessSlider = document.getElementById('BrightnessSlider');
brightnessValue = document.getElementById('BrightnessValue');

 brightnessSlider.addEventListener('input', (event) => {
    brightnessValue.innerText = event.currentTarget.value;
        applyAllAdjustments();
});

