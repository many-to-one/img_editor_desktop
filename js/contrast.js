contrastSlider = document.getElementById('ContrastSlider');
contrastValue = document.getElementById('ContrastValue');
contrastSlider.addEventListener('input', (event) => {
    contrastValue.innerText = event.currentTarget.value;
    applyAllAdjustments();
});