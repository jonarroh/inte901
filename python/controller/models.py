from flask import Flask, Blueprint, request, Response
import pandas as pd
import joblib
import datetime
import holidays
import json
import os

models = Blueprint('models', __name__)

models_path = os.path.join(os.getcwd(), 'models')

# Cargar el modelo y el escalador
with open(f"{models_path}/best_clf.pkl", 'rb') as model_file:
    best_clf = joblib.load(model_file)

with open(f"{models_path}/scaler.pkl", 'rb') as scaler_file:
    scaler = joblib.load(scaler_file)

# Cargar el DataFrame de entrenamiento original para definir 'X'
data_path = os.path.join(os.getcwd())
train = pd.read_csv(os.path.join(data_path, 'models', 'data', 'train.csv'))

# Asegurarse de que la columna 'date' esté en formato datetime
train['date'] = pd.to_datetime(train['date'], errors='coerce')

# Asegurarse de que solo hay un registro por fecha y artículo
train = train.groupby(['date', 'item'], as_index=False)['sales'].sum()

# Eliminar filas con fechas inválidas
train = train.dropna(subset=['date'])

# Definir las categorías de ventas
bins = [0, 50, 100, float('inf')]
labels = ['bajo', 'medio', 'alto']
train['sales_category'] = pd.cut(train['sales'], bins=bins, labels=labels)

# Extraer características de tiempo adicionales
train['dayofweek'] = train['date'].dt.dayofweek
train['month'] = train['date'].dt.month
train['year'] = train['date'].dt.year
train['dayofyear'] = train['date'].dt.dayofyear
train['is_weekend'] = train['date'].dt.dayofweek >= 5

# Agregar información sobre días festivos
us_holidays = holidays.MEX(years=[2013, 2014, 2015, 2016, 2017])
train['is_holiday'] = train['date'].isin(us_holidays)

# Convertir booleanos a enteros
train['is_weekend'] = train['is_weekend'].astype(int)
train['is_holiday'] = train['is_holiday'].astype(int)

# Crear variables dummy para la característica 'item'
train = pd.get_dummies(train, columns=['item'], drop_first=True)

# Codificar la característica de fecha como días desde una fecha de referencia
date_min = train['date'].min()
train['date'] = (train['date'] - date_min).dt.days

# Crear interacciones entre características
for col in train.columns:
    if col.startswith('item_'):
        train[f'date_{col}'] = train['date'] * train[col]

# Definir X
X = train.drop(columns=['sales', 'sales_category'])

# Ruta para predecir
@models.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    def generate_predictions(data):
        df = pd.DataFrame(data)
        print(df)

        # Asegurarse de que la columna 'date' esté en formato datetime
        df['date'] = pd.to_datetime(df['date'], errors='coerce')

        # Extraer características de tiempo adicionales
        df['dayofweek'] = df['date'].dt.dayofweek
        df['month'] = df['date'].dt.month
        df['year'] = df['date'].dt.year
        df['dayofyear'] = df['date'].dt.dayofyear
        df['is_weekend'] = df['date'].dt.dayofweek >= 5

        # Agregar información sobre días festivos
        us_holidays = holidays.MEX(years=[2013, 2014, 2015, 2016, 2017])
        df['is_holiday'] = df['date'].isin(us_holidays)

        # Convertir booleanos a enteros
        df['is_weekend'] = df['is_weekend'].astype(int)
        df['is_holiday'] = df['is_holiday'].astype(int)

        # Crear variables dummy para la característica 'item'
        df = pd.get_dummies(df, columns=['item'], drop_first=True)

        # Codificar la característica de fecha como días desde una fecha de referencia
        date_min = datetime.datetime(2018, 1, 1)  # Cambia esta fecha si es necesario
        df['date'] = (df['date'] - date_min).dt.days

        # Crear interacciones entre características
        for col in df.columns:
            if col.startswith('item_'):
                df[f'date_{col}'] = df['date'] * df[col]

        # Asegurarse de que las columnas del DataFrame coinciden con las del entrenamiento
        missing_cols = set(X.columns) - set(df.columns)
        for col in missing_cols:
            df[col] = 0
        df = df[X.columns]

        # Escalar los datos
        df_scaled = scaler.transform(df)

        # Realizar la predicción
        predictions = best_clf.predict(df_scaled)
        
        # Crear una respuesta con las predicciones
        results = [{'date': data[i]['date'], 'item': data[i]['item'], 'prediction': prediction} 
                   for i, prediction in enumerate(predictions)]
        
        print(results)

        yield json.dumps(results) + '\n'

    # Generar respuestas incrementales
    return Response(generate_predictions(data), content_type='application/json; charset=utf-8')

