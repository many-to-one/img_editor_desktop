/* global GPU */  // Optional: helps VS Code not show warning

const gpu = new GPU();

function imageDataTo2DArray(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const array2D = [];

    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            row.push([
                data[i] / 255,
                data[i + 1] / 255,
                data[i + 2] / 255,
                data[i + 3] / 255,
            ]);
        }
        array2D.push(row);
    }

    return array2D;
}



function array2DToImageData(array2D, width, height) {
    const imageData = new ImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const pixel = array2D[y][x];
            data[i]     = Math.min(255, pixel[0] * 255);
            data[i + 1] = Math.min(255, pixel[1] * 255);
            data[i + 2] = Math.min(255, pixel[2] * 255);
            data[i + 3] = Math.min(255, pixel[3] * 255);
        }
    }

    return imageData;
}


// const brightnessKernel = gpu.createKernel(function(image, brightness) {
//     const pixel = image[this.thread.y][this.thread.x];

//     return [
//         Math.min(1, pixel[0] + brightness),
//         Math.min(1, pixel[1] + brightness),
//         Math.min(1, pixel[2] + brightness),
//         pixel[3] // alpha stays unchanged
//     ];
// })
// .setOutput([canvas.width, canvas.height])
// .setGraphical(false); // returns array, not texture







function applyAllAdjustments() {
    if (!originalImageData) return;

    // Create a fresh copy of the original image
    let imageData = new ImageData(
        new Uint8ClampedArray(originalImageData.data),
        originalImageData.width,
        originalImageData.height
    );

    const brightness = parseInt(brightnessSlider.value, 10);
    const contrast = parseInt(contrastSlider.value, 10);
    // Add more sliders here if needed

    imageData = applyBrightness(imageData, brightness);
    imageData = applyContrast(imageData, contrast);
    // imageData = applySaturation(imageData, ...);
    // imageData = applyDehaze(imageData, ...);

    context.putImageData(imageData, 0, 0);
    currentImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    }

// function applyBrightness(imageData, brightness) {

//     for (let i = 0; i < buffer.length; i += 4) {
//         imageData.data[i]     = Math.min(255, imageData.data[i] + brightness);     // R
//         imageData.data[i + 1] = Math.min(255, imageData.data[i + 1] + brightness); // G
//         imageData.data[i + 2] = Math.min(255, imageData.data[i + 2] + brightness); // B
//     }
//     return imageData;
// }



const brightnessKernel = gpu.createKernel(function(image, brightness) {
    const pixel = image[this.thread.y][this.thread.x];
    return [
        pixel[0] + brightness,
        pixel[1] + brightness,
        pixel[2] + brightness,
        pixel[3]
    ];
})
.setOutput([canvas.width, canvas.height])
.setGraphical(true);



function normalizeImageData(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const result = [];

    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            row.push([
                data[index] / 255,     // R
                data[index + 1] / 255, // G
                data[index + 2] / 255, // B
                data[index + 3] / 255  // A
            ]);
        }
        result.push(row);
    }

    return result;
}

function denormalizeImageData(result, width, height) {
    const imageData = new ImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const pixel = result[y][x];

            data[index]     = Math.floor(pixel[0] * 255);
            data[index + 1] = Math.floor(pixel[1] * 255);
            data[index + 2] = Math.floor(pixel[2] * 255);
            data[index + 3] = Math.floor(pixel[3] * 255);
        }
    }

    return imageData;
}


function applyBrightness(brightness) {
  if (!originalImageData) return;

  const normalized = normalizeImageData(originalImageData);
  const result = brightnessKernel(normalized, brightness);
  const output = denormalizeImageData(result);

  ctx.putImageData(output, 0, 0);
}


function applyContrast(imageData, contrast) {
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i]     = Math.min(255, Math.max(0, factor * (imageData.data[i] - 128) + 128));
        imageData.data[i + 1] = Math.min(255, Math.max(0, factor * (imageData.data[i + 1] - 128) + 128));
        imageData.data[i + 2] = Math.min(255, Math.max(0, factor * (imageData.data[i + 2] - 128) + 128));
    }
    return imageData;
}