from flask import Flask, jsonify, request, send_file
from PIL import Image
import os
import rembg
from io import BytesIO

app = Flask(__name__)

STATIC_FOLDER = 'static'

@app.route('/')
def index():
    return jsonify({'message': 'Welcome to the Image Converter API. Use /convert to convert images to .webp format.'})

@app.route('/convert', methods=['POST', 'GET'])
def convert_images():
    converted_images = []
    for filename in os.listdir(STATIC_FOLDER):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            filepath = os.path.join(STATIC_FOLDER, filename)
            img = Image.open(filepath).convert('RGB')
            webp_filename = os.path.splitext(filename)[0] + '.webp'
            webp_filepath = os.path.join(STATIC_FOLDER, webp_filename)
            img.save(webp_filepath, 'webp')
            converted_images.append(webp_filename)
            # Remove the original image
            os.remove(filepath)
    return jsonify({'message': 'Images have been converted to .webp format.', 'converted_images': converted_images})


@app.route('/remove-bg', methods=['GET'])
def remove_bg():
    filename = request.args.get('filename')
    if not filename:
        return jsonify({'error': 'Filename query parameter is required.'}), 400

    filepath = os.path.join(STATIC_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found.'}), 404

    try:
        input_image = Image.open(filepath)
        output_image = rembg.remove(input_image)

        output_buffer = BytesIO()
        output_image.save(output_buffer, format='PNG')
        output_buffer.seek(0)

        return send_file(output_buffer, mimetype='image/png', as_attachment=True, download_name=f"no_bg_{filename}")

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
