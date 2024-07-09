from flask import Flask, Blueprint, request, Response
import pandas as pd
import joblib
import holidays
import json
import os
import math as Math
rid = Blueprint('rege', __name__)

models_path = os.path.join(os.getcwd(), 'models')

# Cargar el modelo, la fecha mínima y las columnas de X
with open(f"{models_path}/best_ridge_model.pkl", 'rb') as model_file:
    best_ridge_model = joblib.load(model_file)

with open(f"{models_path}/date_min.pkl", 'rb') as date_min_file:
    date_min = joblib.load(date_min_file)

with open(f"{models_path}/X_columns.pkl", 'rb') as x_columns_file:
    X_columns = joblib.load(x_columns_file)

@rid.route('/predictRege', methods=['POST'])
def predict():
    data = request.get_json()

    def generate_predictions(data):
        df = pd.DataFrame(data)

        # Asegurarse de que la columna 'date' esté en formato datetime
        df['date'] = pd.to_datetime(df['date'], errors='coerce')

        # Extraer características de tiempo adicionales
        df['dayofweek'] = df['date'].dt.dayofweek
        df['month'] = df['date'].dt.month
        df['year'] = df['date'].dt.year
        df['dayofyear'] = df['date'].dt.dayofyear
        df['is_weekend'] = df['date'].dt.dayofweek >= 5

        # Agregar información sobre días festivos
        us_holidays = holidays.MEX(years=[2018, 2019, 2020, 2021, 2022, 2023, 2024])
        df['is_holiday'] = df['date'].isin(us_holidays)

        # Convertir booleanos a enteros
        df['is_weekend'] = df['is_weekend'].astype(int)
        df['is_holiday'] = df['is_holiday'].astype(int)

        # Crear variables dummy para la característica 'item'
        df = pd.get_dummies(df, columns=['item'], drop_first=True)

        # Codificar la característica de fecha como días desde una fecha de referencia
        df['date'] = (df['date'] - date_min).dt.days

        # Crear interacciones entre características
        for col in df.columns:
            if col.startswith('item_'):
                df[f'date_{col}'] = df['date'] * df[col]

        # Asegurarse de que las columnas del DataFrame coinciden con las del entrenamiento
        missing_cols = set(X_columns) - set(df.columns)
        for col in missing_cols:
            df[col] = 0
        df = df[X_columns]

        # Realizar la predicción
        predictions = best_ridge_model.predict(df)
        
        # Crear una respuesta con las predicciones
        results = [{'date': data[i]['date'], 'item': data[i]['item'], 'prediction': Math.trunc(predictions[i])}
                   for i in range(len(predictions))]

        yield json.dumps(results) + '\n'

    # Generar respuestas incrementales
    return Response(generate_predictions(data), content_type='application/json; charset=utf-8')


