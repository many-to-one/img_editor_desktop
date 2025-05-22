let scale = 0.1;

function applyZoomCSS() {
    document.getElementById('canvas').style.transform = `scale(${scale})`;
}

document.getElementById('zoomIn').addEventListener('click', () => {
    scale = Math.min(scale + 0.1, 1.0);
    applyZoomCSS();
});

document.getElementById('zoomOut').addEventListener('click', () => {
    scale = Math.max(scale - 0.1, 0.1);
    applyZoomCSS();
});

// canvasWrapper.addEventListener('wheel', (e) => {
document.getElementById('canvas').addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
        scale = Math.min(scale + 0.1, 1.0);
    } else {
        scale = Math.max(scale - 0.1, 0.1);
    }
    applyZoomCSS();
});
