from flask import Flask, jsonify, request, send_file
from PIL import Image
import os
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
            img = Image.open(filepath)
            
            # If image has an alpha channel, ensure it's preserved
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                img = img.convert('RGBA')
            else:
                img = img.convert('RGB')
            
            webp_filename = os.path.splitext(filename)[0] + '.webp'
            webp_filepath = os.path.join(STATIC_FOLDER, webp_filename)
            img.save(webp_filepath, 'webp')
            converted_images.append(webp_filename)
            # Remove the original image
            os.remove(filepath)
            


    return jsonify({'message': 'Images have been converted to .webp format.', 'converted_images': converted_images})


@app.route('/clipProduct', methods=['POST', 'GET'])
def clipProduct():
    convert_images = []
    to_width = 200
    to_height = 200

    for filename in os.listdir(os.path.join(STATIC_FOLDER, 'productos')):
        print(filename)
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            filepath = os.path.join(STATIC_FOLDER, 'productos', filename)
            img = Image.open(filepath)
            # Obtener las dimensiones de la imagen
            width, height = img.size
            # Redimensionar la imagen
            img = img.resize((to_width, to_height))
            # Guardar la imagen
            img.save(filepath)
            convert_images.append(filename)

    return jsonify({'message': 'Images have been clipped.', 'clipped_images': convert_images})



if __name__ == '__main__':
    app.run(debug=True)
