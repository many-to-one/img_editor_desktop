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


    def adjust_shadows(self, image_data, strength):

        try:
            # Decode base64 image
            header, base64_data = image_data.split(',')
            img_bytes = BytesIO(base64.b64decode(base64_data))
            img = Image.open(img_bytes).convert("RGB")

            strength = float(strength)
            pixels = img.load()
            width, height = img.size

            for y in range(height):
                for x in range(width):
                    r, g, b = pixels[x, y]

                    # Luma (brightness) approximation
                    brightness = 0.299 * r + 0.587 * g + 0.114 * b

                    if brightness < 100:
                        factor = 1 + strength * (1 - brightness / 100)
                        r = min(255, int(r * factor))
                        g = min(255, int(g * factor))
                        b = min(255, int(b * factor))

                    pixels[x, y] = (r, g, b)
            
            output_buffer = BytesIO()
            result = img.save(output_buffer, format="PNG")

            # Save result to static/removed.png
            output_path = os.path.join("static", "shadows.png")
            with open(output_path, "wb") as f:
                f.write(result)

            return {"status": "success", "output_path": output_path}
        except Exception as e:
            return {"status": "error", "message": str(e)}


    def adjust_shadows_(self, image_data, strength):
    try:
        # Parse base64 input (strip data header)
        header, base64_data = image_data.split(',')
        img_bytes = BytesIO(base64.b64decode(base64_data))
        img = Image.open(img_bytes).convert("RGB")

        strength = float(strength)
        pixels = img.load()
        width, height = img.size

        for y in range(height):
            for x in range(width):
                r, g, b = pixels[x, y]

                # Luma (brightness) approximation
                brightness = 0.299 * r + 0.587 * g + 0.114 * b

                if brightness < 100:
                    factor = 1 + strength * (1 - brightness / 100)
                    r = min(255, int(r * factor))
                    g = min(255, int(g * factor))
                    b = min(255, int(b * factor))

                pixels[x, y] = (r, g, b)

        # Convert back to base64
        output_buffer = BytesIO()
        img.save(output_buffer, format="PNG")
        encoded_img = base64.b64encode(output_buffer.getvalue()).decode("utf-8")

        return f"data:image/png;base64,{encoded_img}"

    except Exception as e:
        print("Error adjusting shadows:", e)
        return {"error": str(e)}


if __name__ == '__main__':
    api = Api()
    window = webview.create_window('Image Processor', 'gui.html', js_api=api, width=800, height=600)
    # webview.windows[0].load_url("gui.html")
    webview.start(debug=True)
