# Use the .NET 9 SDK image for building the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["pickerapi.csproj", "."]
RUN dotnet restore "./pickerapi.csproj"

# Copy the remaining source code
COPY . .
WORKDIR "/src/."

# Build the application in Release configuration
RUN dotnet build "./pickerapi.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "./pickerapi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use the .NET 9 ASP.NET runtime image for the final application
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Copy the published application from the publish stage
COPY --from=publish /app/publish .

# Expose the port the application runs on
EXPOSE 5230

# Set the entry point to run the application
ENTRYPOINT ["dotnet", "pickerapi.dll"]
