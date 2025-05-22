// let base64Image = '';
// let _image = document.getElementById('original')
// let res = document.getElementById('res')
// let load = document.getElementById('load')
// const previewCanvas       = document.getElementById("previewCanvas");
// const previewCtx          = previewCanvas.getContext("2d");
// const fullCanvas       = document.getElementById("fullCanvas");
// const fullCtx          = fullCanvas.getContext("2d");
// // const gammaCont = document.getElementById("gammaCont");

// const dialogWindow = document.getElementById('dialogWindow');
// let originalImage = null; //new Image();
// let previewImage = null;

// var brightnessSlider;
// var contrastSlider;
// var brightnessValue;
// var contrastValue;
// var paintButton;
// // var image;
// var canvas;
// var context;
// var painted;
// canvas = document.getElementById('Canvas');

// image = document.getElementById('original');


window.addEventListener('pywebviewready', () => {
      // const _image = document.getElementById('original');
      const fileInput = document.getElementById('fileInput');
      // drawCurve()

      fileInput.addEventListener('change', async () => {
        dialogWindow.style.display = 'block';
        const file = fileInput.files[0];
        console.log('---------Filename----------', file.name);
        if (!file) return;

        const arrayBuffer = await file.arrayBuffer();
        const base64 = await arrayBufferToBase64(arrayBuffer);
        try {
          dialogWindow.innerText = `${file.name} is loading...`;
          const previewDataUrl = await window.pywebview.api.load_image_from_base64(base64, file.name);
          image.src = previewDataUrl;
          base64Image = previewDataUrl;
          dialogWindow.style.display = 'none';

        } catch (err) {
          dialogWindow.innerText = `Error ${err}`;
        }
      });

      function arrayBufferToBase64(buffer) {
        return new Promise((resolve, reject) => {
          const blob = new Blob([buffer], { type: 'application/octet-stream' });
          const reader = new FileReader();

          reader.onloadend = () => {
            const base64 = reader.result.split(',')[1]; // remove `data:...;base64,`
            resolve(base64);
          };

          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

  });




function init() {
  brightnessSlider = document.getElementById('BrightnessSlider');
  brightnessValue = document.getElementById('BrightnessValue');
  contrastSlider = document.getElementById('ContrastSlider');
  contrastValue = document.getElementById('ContrastValue');
  paintButton = document.getElementById('PaintButton');

  canvas = document.getElementById('Canvas');
  context = canvas.getContext('2d');
  
  // Set the canvas the same width and height of the image
  canvas.width = image.width;
  canvas.height = image.height;
  
  paintButton.addEventListener('click', function () {
    drawImage(image);
  });
  
  brightnessSlider.addEventListener('change', function (event) {
    var imageData;
    
    brightnessValue.innerText = event.currentTarget.value;
    
    if (!painted) return;
    
    redrawImage();

    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    applyBrightness(
      imageData.data,
      parseInt(brightnessSlider.value, 10)
    );
    
    context.putImageData(imageData, 0, 0);
  });
  
  contrastSlider.addEventListener('change', function (event) {
    var imageData;
    
    contrastValue.innerText = event.currentTarget.value;
    
    if (!painted) return;
    
    redrawImage();
    
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    applyContrast(
      imageData.data,
      parseInt(contrastSlider.value, 10)
    );
    
    context.putImageData(imageData, 0, 0);
  });
  
  paintButton.addEventListener('click', onPaint);
}

function drawImage(image) {
  context.drawImage(image, 0, 0);
}

function redrawImage() {
  drawImage(image);
}

function onPaint(event) {
  painted = true;
  // resetImage();

  var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  var brightness = parseInt(brightnessSlider.value, 10);
  var contrast = parseInt(contrastSlider.value, 10);

  applyBrightness(imageData.data, brightness);
  applyContrast(imageData.data, contrast);
  context.putImageData(imageData, 0, 0);
}

function applyBrightness(data, brightness) {
  for (var i = 0; i < data.length; i+= 4) {
    data[i] += 255 * (brightness / 100);
    data[i+1] += 255 * (brightness / 100);
    data[i+2] += 255 * (brightness / 100);
  }
}

function truncateColor(value) {
  if (value < 0) {
    value = 0;
  } else if (value > 255) {
    value = 255;
  }

  return value;
}

function applyContrast(data, contrast) {
  var factor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));

  for (var i = 0; i < data.length; i+= 4) {
    data[i] = truncateColor(factor * (data[i] - 128.0) + 128.0);
    data[i+1] = truncateColor(factor * (data[i+1] - 128.0) + 128.0);
    data[i+2] = truncateColor(factor * (data[i+2] - 128.0) + 128.0);
  }
}

window.addEventListener('load', init);
