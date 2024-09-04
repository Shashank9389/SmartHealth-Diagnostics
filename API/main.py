from flask import Flask, request, jsonify
from keras.models import load_model
import tensorflow as tf
from flask_cors import CORS
import numpy as np
import imageio.v2 as imageio

app = Flask(__name__)
CORS(app)

MODEL = load_model("../models/1")
CLASS_NAMES = ["NORMAL", "PNEUMONIA"]


def read_file_as_image(data):
    image = imageio.imread(data)
    # Ensure the image has three channels (RGB)
    if image.ndim == 2:  # grayscale to RGB
        image = np.stack((image,) * 3, axis=-1)
    elif image.shape[2] == 1:  # single channel to RGB
        image = np.concatenate((image, image, image), axis=-1)
    return image


@app.route('/')
def hello():
    return 'Hello, World!'


@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['image']
        image = read_file_as_image(file.read())

        # Resize image to match model input size (256x256)
        target_size = (256, 256)
        if image.shape[:2] != target_size:
            image = tf.image.resize(image, target_size).numpy()

        img_batch = np.expand_dims(image, 0)  # Add batch dimension

        predictions = MODEL.predict(img_batch)
        predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
        confidence = np.max(predictions[0])
        confidence = float(confidence)

        return jsonify({'class': predicted_class, 'confidence': confidence})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'An error occurred during prediction'}), 500


if __name__ == '__main__':
    app.run(debug=True)
