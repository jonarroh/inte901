# Etapa 1: Construir la aplicación
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copia los archivos de proyecto y restaura las dependencias
COPY Server/Server.csproj ./Server/
RUN dotnet restore ./Server/Server.csproj

# Copia todo el código fuente y construye el proyecto
COPY . ./
RUN dotnet build ./Server/Server.csproj -c Release -o /app/build

# Etapa 2: Publicar la aplicación
FROM build AS publish
RUN dotnet publish ./Server/Server.csproj -c Release -o /app/publish

# Etapa 3: Crear la imagen final
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish ./

# Expone el puerto 5000
EXPOSE 7268

# Comando para ejecutar la aplicación
ENTRYPOINT ["dotnet", "Server.dll"]
