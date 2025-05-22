contrastSlider = document.getElementById('ContrastSlider');
        contrastValue = document.getElementById('ContrastValue');
        contrastSlider.addEventListener('input', function (event) {
            
            contrastValue.innerText = event.currentTarget.value;

            // if (!painted) return;
            
            redrawImage();
            
            imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            applyContrast(
                imageData.data,
                parseInt(contrastSlider.value, 10)
            );
            
            context.putImageData(imageData, 0, 0);
        });

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

            // for (var i = 0; i < data.length; i+= 4) {
            //     data[i] = truncateColor(factor * (data[i] - 128.0) + 128.0);
            //     data[i+1] = truncateColor(factor * (data[i+1] - 128.0) + 128.0);
            //     data[i+2] = truncateColor(factor * (data[i+2] - 128.0) + 128.0);
            // }
            for (var i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));     // Red
                data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128)); // Green
                data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128)); // Blue
            }
        }

