from flask import Flask, jsonify, request, send_file, url_for
from PIL import Image
import os
from io import BytesIO
from controller.models import models
from controller.ridge import rid
from controller.reportes import reportes
import qrcode



app = Flask(__name__)
app.register_blueprint(models)
app.register_blueprint(rid)
app.register_blueprint(reportes)

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
            # Guardar la imagen, si no esta en formato webp, convertirla
            if not filename.lower().endswith('.webp'):
                webp_filename = os.path.splitext(filename)[0] + '.webp'
                webp_filepath = os.path.join(STATIC_FOLDER, 'productos', webp_filename)
                img.save(webp_filepath, 'webp')
                os.remove(filepath)
                convert_images.append(webp_filename)
            else:
                convert_images.append(filename)

    return jsonify({'message': 'Images have been clipped.', 'clipped_images': convert_images})

@app.route('/clipProduct2', methods=['POST', 'GET'])
def clipProduct2():
    convert_images = []
    to_width = 400
    to_height = 400

    for filename in os.listdir(os.path.join(STATIC_FOLDER, 'productos', 'grande')):
        print(filename)
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            filepath = os.path.join(STATIC_FOLDER, 'productos', 'grande', filename)
            img = Image.open(filepath)
            # Redimensionar la imagen a 400x400
            img = img.resize((to_width, to_height), Image.LANCZOS)
            # Guardar la imagen, si no está en formato webp, convertirla
            if not filename.lower().endswith('.webp'):
                webp_filename = os.path.splitext(filename)[0] + '.webp'
                webp_filepath = os.path.join(STATIC_FOLDER, 'productos', 'grande', webp_filename)
                img.save(webp_filepath, 'webp', quality=90)  # Ajusta la calidad según sea necesario
                os.remove(filepath)
                convert_images.append(webp_filename)
            else:
                img.save(filepath, quality=90)  # Guardar la imagen con alta calidad
                convert_images.append(filename)

    return jsonify({'message': 'Images have been clipped.', 'clipped_images': convert_images})



@app.route('/user/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'})
    
    if 'id' not in request.form:
        return jsonify({'message': 'No id part'})
    
    id = request.form['id']
    #hacer la optimizacion de la imagen a webp y guardarla en la carpeta static/users

    if file:
        img = Image.open(file)
        # Guardar la imagen en formato webp
        webp_filename = id + '.webp'
        webp_filepath = os.path.join(STATIC_FOLDER, 'users', webp_filename)

        img.save(webp_filepath, 'webp', quality=90)
        return jsonify({'message': 'Image has been uploaded and optimized.'})
    else:
        return jsonify({'message': 'Error uploading image'})
    


@app.route('/generate_qr_order', methods=['POST'])
def generate_qr():
    # Obtener el string del request
    data = request.json.get('data')
    id = request.json.get('id')
    qr_orders_folder = os.path.join(STATIC_FOLDER, 'qr-orders')
    
    if not data:
        return {"error": "No data provided"}, 400

    # Crear un código QR
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill='black', back_color='white')

    # Generar un nombre de archivo único para evitar colisiones
    
    filename = f"{id}.png"
    filepath = os.path.join(qr_orders_folder, filename)

    # Guardar la imagen en el directorio 'static/qr-orders'
    img.save(filepath)

    # Devolver la URL del archivo guardado
    file_url = url_for('static', filename=f'qr-orders/{filename}', _external=True)
    return jsonify({"file_url": file_url})



if __name__ == '__main__':
    app.run(debug=True)
    