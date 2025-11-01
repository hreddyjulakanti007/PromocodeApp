#!/bin/bash

echo "🚀 Starting Promo Code Management System..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

echo ""
echo "🏗️  Building and starting services..."
echo "This may take a few minutes on first run..."
echo ""

# Start services
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
echo ""

# Wait for PostgreSQL
echo "Waiting for PostgreSQL..."
until docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
    printf "."
    sleep 2
done
echo " ✅ PostgreSQL is ready"

# Wait for Keycloak
echo "Waiting for Keycloak (this may take 60-90 seconds)..."
until curl -sf http://localhost:8080/health/ready > /dev/null 2>&1; do
    printf "."
    sleep 5
done
echo " ✅ Keycloak is ready"

# Wait for Backend
echo "Waiting for Backend..."
until curl -sf http://localhost:8081/actuator/health > /dev/null 2>&1; do
    printf "."
    sleep 3
done
echo " ✅ Backend is ready"

# Wait for Frontend
echo "Waiting for Frontend..."
until curl -sf http://localhost:4200 > /dev/null 2>&1; do
    printf "."
    sleep 2
done
echo " ✅ Frontend is ready"

echo ""
echo "🎉 All services are up and running!"
echo ""
echo "📍 Access URLs:"
echo "   Frontend:        http://localhost:4200"
echo "   Backend API:     http://localhost:8081"
echo "   Swagger UI:      http://localhost:8081/swagger-ui.html"
echo "   Keycloak Admin:  http://localhost:8080 (admin/admin)"
echo ""
echo "👤 Test Users:"
echo "   Admin (Tenant 1):    admin / admin123"
echo "   Business (Tenant 1): business / business123"
echo "   Admin (Tenant 2):    admin2 / admin123"
echo ""
echo "📋 To view logs: docker-compose logs -f"
echo "🛑 To stop:      docker-compose down"
echo ""
