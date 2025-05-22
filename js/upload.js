// let base64Image = '';
// let image = document.getElementById('original');
// const fileInput = document.getElementById('fileInput');
// const dialogWindow = document.getElementById('dialogWindow');


window.addEventListener('pywebviewready', () => {

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
                    drawImage(base64Image);
                    // onPaint(base64Image);
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