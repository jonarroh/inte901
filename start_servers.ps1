# Moverse a la carpeta del entorno virtual de Python
Set-Location -Path C:\Dev\python

# Activar el entorno virtual
.\venv\Scripts\Activate

Start-Process powershell -ArgumentList "python main.py" -NoNewWindow -PassThru

# Moverse a la carpeta del proyecto
Set-Location -Path ..\client

Start-Process powershell -ArgumentList "bunx ng serve" -NoNewWindow -PassThru



