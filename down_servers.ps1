# Obtener y detener el proceso de Flask
$flaskProcess = Get-Process | Where-Object { $_.Path -match "python.exe" -and $_.MainWindowTitle -match "app.py" }
if ($flaskProcess) {
    $flaskProcess | Stop-Process
}

# Obtener y detener el proceso de Angular
$angularProcess = Get-Process | Where-Object { $_.Path -match "node.exe" -and $_.MainWindowTitle -match "ng serve" }
if ($angularProcess) {
    $angularProcess | Stop-Process
}
