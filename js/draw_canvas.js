

// function drawImage(base64Image) {
//     const img = new Image();
//     img.src = base64Image;

//     img.onload = function () {
//         canvas.width = img.width;
//         canvas.height = img.height;
//         context.drawImage(img, 0, 0, canvas.width, canvas.height);
//     };
// }

// function redrawImage() {
//     context.drawImage(image, 0, 0, canvas.width, canvas.height);
// }


function drawImage(base64Image) {
    const img = new Image();
    img.src = base64Image;

    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Store the original image data after drawing
        bufferImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    };
}

function redrawImage() {
    // if (!originalImageData) return; // Ensure we have the original image data

    // Restore previous state before applying further manipulations
    context.putImageData(bufferImageData, 0, 0);
}
