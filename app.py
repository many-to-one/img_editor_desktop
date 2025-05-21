import cv2
import image_dehazer
import numpy as np
import webview
import base64
import rawpy
import imageio
from PIL import Image, ImageOps
from io import BytesIO
import os
from rembg import remove

class Api:

    def load_image_from_base64(self, base64_data, filename):
        print('load_image_from_base64********************', filename)
        ext = os.path.splitext(filename)[1].lower()
        binary_data = base64.b64decode(base64_data)

        if ext in ['.cr2', '.nef', '.arw', '.dng', '.rw2']:
            with open("temp.raw", "wb") as f:
                f.write(binary_data)
            with rawpy.imread("temp.raw") as raw:
                rgb = raw.postprocess()
                img = Image.fromarray(rgb)
        else:
            img = Image.open(BytesIO(binary_data)).convert("RGB")

        output = BytesIO()
        img.save(output, format="PNG")
        return f"data:image/png;base64,{base64.b64encode(output.getvalue()).decode()}"

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
        

    def remove_haze(self, img_data_url):
        try:
            # Decode base64 image from data URL
            header, encoded = img_data_url.split(',', 1)
            img_bytes = base64.b64decode(encoded)
            img_array = np.frombuffer(img_bytes, dtype=np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

            # Dehaze
            result_img, haze_map = image_dehazer.remove_haze(img)

            # Convert images to base64
            def img_to_data_url(img):
                _, buffer = cv2.imencode('.jpg', img)
                return 'data:image/jpeg;base64,' + base64.b64encode(buffer).decode('utf-8')

            return {
                # 'original': img_to_data_url(img),
                "status": "success",
                'dehazed': img_to_data_url(result_img),
                # 'hazemap': img_to_data_url(haze_map)
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}

    # def adjust_shadows_(self, image_data, strength):

    #     try:
    #         print("adjust_shadows_***********************", strength)
    #         # Decode base64 image
    #         header, base64_data = image_data.split(',')
    #         img_bytes = BytesIO(base64.b64decode(base64_data))
    #         img = Image.open(img_bytes).convert("RGB")

    #         strength = float(strength)
    #         pixels = img.load()
    #         width, height = img.size

    #         for y in range(height):
    #             for x in range(width):
    #                 r, g, b = pixels[x, y]

    #                 # Luma (brightness) approximation
    #                 brightness = 0.299 * r + 0.587 * g + 0.114 * b

    #                 if brightness < 100:
    #                     factor = 1 + strength * (1 - brightness / 100)
    #                     r = min(255, int(r * factor))
    #                     g = min(255, int(g * factor))
    #                     b = min(255, int(b * factor))

    #                 pixels[x, y] = (r, g, b)
            
    #         output_buffer = BytesIO()
    #         result = img.save(pixels, format="PNG")

    #         # Save result to static/removed.png
    #         output_path = os.path.join("static", "shadows.png")
    #         with open(output_path, "wb") as f:
    #             f.write(result)

    #         return {"status": "success", "output_path": output_path}
    #     except Exception as e:
    #         return {"status": "error", "message": str(e)}


    # def adjust_shadows(self, image_data, strength):
    #     try:
    #         print("adjust_shadows_***********************", strength)
    #         # Parse base64 input (strip data header)
    #         header, base64_data = image_data.split(',')
    #         img_bytes = BytesIO(base64.b64decode(base64_data))
    #         img = Image.open(img_bytes).convert("RGB")

    #         strength = float(strength)
    #         pixels = img.load()
    #         width, height = img.size

    #         for y in range(height):
    #             for x in range(width):
    #                 r, g, b = pixels[x, y]
    #                 brightness = 0.299 * r + 0.587 * g + 0.114 * b

    #                 if brightness < 100:
    #                     factor = 1 + strength * (1 - brightness / 100)
    #                     r = min(255, int(r * factor))
    #                     g = min(255, int(g * factor))
    #                     b = min(255, int(b * factor))

    #                 pixels[x, y] = (r, g, b)

    #         # Save to buffer
    #         output_buffer = BytesIO()
    #         img.save(output_buffer, format="PNG")
    #         output_buffer.seek(0)

    #         encoded_img = base64.b64encode(output_buffer.getvalue()).decode("utf-8")

    #         # return f"data:image/png;base64,{encoded_img}"
    #         return {
    #             "status": "success",
    #             "image": f"data:image/png;base64,{encoded_img}"
    #         }

    #     except Exception as e:
    #         print("Error adjusting shadows:", e)
    #         return {"error": str(e)}



if __name__ == '__main__':
    api = Api()
    window = webview.create_window('Image Processor', 'gui.html', js_api=api, width=800, height=600)
    # webview.windows[0].load_url("gui.html")
    webview.start(debug=True,)
