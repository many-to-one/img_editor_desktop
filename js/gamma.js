// const gammaCont = document.getElementById('gammaCont');
//     const gammaSlider = document.getElementById("gammaSlider");
//     const image   = document.getElementById('original');
//     const canvas       = document.getElementById("imageCanvas");
//     const ctx          = canvas.getContext("2d");

//     function gammaF() {     
//       if (gammaCont.style.display === 'none') {
//         gammaCont.style.display = 'block';
//       } else {
//         gammaCont.style.display = 'none';
//       }
//     }

//     gammaSlider.addEventListener("input", () => {
//       applyGammaCorrection(parseFloat(gammaSlider.value));
//     });

//     function applyGammaCorrection(gamma) {
//       if (!image.src) return;
      
//       // Draw original into canvas at its natural size
//       const w = image.naturalWidth;
//       const h = image.naturalHeight;
//       canvas.width  = w;
//       canvas.height = h;
//       ctx.drawImage(image, 0, 0, w, h);

//       // Now grab the pixel data
//       const imageData = ctx.getImageData(0, 0, w, h);
//       const data      = imageData.data;
      
//       // Build LUT
//       const invGamma = 1 / gamma;
//       const LUT = new Uint8ClampedArray(256);
//       for (let i = 0; i < 256; i++) {
//         LUT[i] = Math.min(255, Math.pow(i / 255, invGamma) * 255);
//       }
      
//       // Apply to each pixel
//       for (let i = 0; i < data.length; i += 4) {
//         data[i]     = LUT[data[i]];     // R
//         data[i + 1] = LUT[data[i + 1]]; // G
//         data[i + 2] = LUT[data[i + 2]]; // B
//         // alpha unchanged
//       }
      
//       // Put back and update img
//       ctx.putImageData(imageData, 0, 0);
//       image.src = canvas.toDataURL();
//     }