import webview
import base64
from PIL import Image, ImageOps
from io import BytesIO
import os
from rembg import remove

class Api:

    def process_image(self, image_data):
        try:
            # Decode base64 to bytes
            header, base64_data = image_data.split(',')
            img_bytes = BytesIO(base64.b64decode(base64_data))
            img = Image.open(img_bytes)

            # Convert to grayscale
            gray_img = ImageOps.grayscale(img)

            # Save to static/output.png
            output_path = os.path.join("static", "output.png")
            gray_img.save(output_path)

            return {"status": "success", "output_path": output_path}
        except Exception as e:
            return {"status": "error", "message": str(e)}


    def remove_bg(self, image_data):

        try:
            # Decode base64 image
            header, base64_data = image_data.split(',')
            img_bytes = BytesIO(base64.b64decode(base64_data))

            # Remove background
            result = remove(img_bytes.getvalue())

            # Save result to static/removed.png
            output_path = os.path.join("static", "removed.png")
            with open(output_path, "wb") as f:
                f.write(result)

            return {"status": "success", "output_path": output_path}
        except Exception as e:
            return {"status": "error", "message": str(e)}

if __name__ == '__main__':
    api = Api()
    window = webview.create_window('Image Processor', 'gui.html', js_api=api, width=800, height=600)
    # webview.windows[0].load_url("gui.html")
    webview.start(debug=True)
