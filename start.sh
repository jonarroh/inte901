#!/bin/bash

# Moverse a la carpeta del entorno virtual de Python
cd ~/Dev/python

# Activar el entorno virtual
source ./venv/bin/activate

# Ejecutar el script de Python
python main.py &

# Moverse a la carpeta del proyecto del cliente
cd ../client

# Ejecutar el servidor de desarrollo de npm
npm run dev &

# Moverse a la carpeta del proyecto del servidor
cd ../Server

# Ejecutar la aplicación .NET
dotnet run &
