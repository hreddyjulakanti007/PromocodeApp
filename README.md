# Promo Code Management System

A production-ready multi-tenant promo code management system with complete data isolation, role-based access control, and OAuth2 authentication.

## Architecture

### Technology Stack

**Backend**
- Java 21 with Spring Boot 3.5+
- PostgreSQL 16 (schema-per-tenant multi-tenancy)
- Spring Security with OAuth2/JWT
- Spring Data JPA with Hibernate
- Maven 3.9+

**Frontend**
- Angular 18 (standalone components)
- Angular Material UI
- Keycloak Angular integration
- RxJS for reactive programming
- TypeScript

**Infrastructure**
- Docker & Docker Compose
- Keycloak 23.0.0 (standalone)
- Nginx (production-ready)

### Multi-Tenancy Architecture

**Schema-per-tenant approach:**
- Each tenant has an isolated PostgreSQL schema
- Tenant context extracted from JWT token (`tenant_id` claim)
- Automatic schema switching via `TenantFilter`
- Complete data isolation between tenants

### Security Architecture

- OAuth2/OIDC authentication via Keycloak
- JWT bearer tokens for API authentication
- Role-based access control (RBAC):
  - **ADMIN**: Full CRUD operations
  - **BUSINESS**: Read-only access
- Tenant isolation enforced at database schema level

## Features

### Promo Code Management
- Create, read, update, delete promo codes
- Fields: code, amount, discount type (percentage/fixed), expiry date, usage limits
- Automatic usage tracking
- Status management (Active/Expired/Disabled)

### Filtering & Reporting
- Filter by code, status, and date range
- Real-time usage statistics
- Tenant-specific views

### Multi-Tenancy
- Complete data isolation per tenant
- Tenant-aware API endpoints
- Automatic tenant resolution from JWT

## Quick Start

### Prerequisites

```bash
# Required
- Docker Desktop (latest)
- Git

# Optional (for local development)
- Java 21 JDK
- Node.js 20+
- Maven 3.9+
```

### Installation

**1. Clone the repository**
```bash
git clone <repository-url>
cd promocodeprojecthanimi
```

**2. Start PostgreSQL**
```bash
docker run -d --name promocode-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=promocode_db \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:16-alpine

# Initialize database schemas
docker exec -i promocode-postgres psql -U postgres -d promocode_db < init-db.sql
```

**3. Start Keycloak**

```powershell
# Windows PowerShell
cd keycloak-23.0.0\bin
$env:KEYCLOAK_ADMIN="admin"
$env:KEYCLOAK_ADMIN_PASSWORD="admin"
.\kc.bat start-dev --http-port=8090
```

```bash
# Linux/Mac
cd keycloak-23.0.0/bin
export KEYCLOAK_ADMIN=admin
export KEYCLOAK_ADMIN_PASSWORD=admin
./kc.sh start-dev --http-port=8090
```

**4. Import Keycloak Realm**

- Access Keycloak admin console: http://localhost:8090
- Login with `admin` / `admin`
- Click "Create Realm" → "Browse" → Select `keycloak/realm-export.json`
- Click "Create"

**5. Build and Start Backend**

```bash
# Build backend Docker image
docker build -t promocodeprojecthanimi-backend -f backend/Dockerfile backend/

# Run backend container
docker run -d --name promocode-backend \
  --network host \
  -p 8081:8081 \
  -e SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/promocode_db" \
  -e SPRING_DATASOURCE_USERNAME="postgres" \
  -e SPRING_DATASOURCE_PASSWORD="postgres" \
  -e KEYCLOAK_AUTH_SERVER_URL="http://localhost:8090" \
  -e KEYCLOAK_ISSUER_URI="http://localhost:8090/realms/promocode" \
  -e KEYCLOAK_JWK_SET_URI="http://localhost:8090/realms/promocode/protocol/openid-connect/certs" \
  promocodeprojecthanimi-backend
```

**6. Build and Start Frontend**

```bash
# Build frontend Docker image
docker build -t promocodeprojecthanimi-frontend -f frontend/Dockerfile frontend/

# Run frontend container
docker run -d --name promocode-frontend \
  -p 4200:80 \
  promocodeprojecthanimi-frontend
```

### Access the Application

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:4200 | See test users below |
| **Backend API** | http://localhost:8081/api | JWT required |
| **Swagger UI** | http://localhost:8081/swagger-ui.html | JWT required |
| **Keycloak Admin** | http://localhost:8090 | admin / admin |

### Test Users

| Username | Password | Role | Tenant | Access |
|----------|----------|------|--------|--------|
| admin | admin123 | ADMIN | tenant1 | Full CRUD |
| business | business123 | BUSINESS | tenant1 | Read-only |
| admin2 | admin123 | ADMIN | tenant2 | Full CRUD (separate data) |

## Development Setup

### Backend Development

```bash
cd backend

# Build
mvn clean install

# Run locally
mvn spring-boot:run

# Run tests
mvn test

# Package
mvn clean package -DskipTests
```

**Local Configuration** (`application.yml`):
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/promocode_db
    username: postgres
    password: postgres
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8090/realms/promocode
          jwk-set-uri: http://localhost:8090/realms/promocode/protocol/openid-connect/certs
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm start
# Navigate to http://localhost:4200

# Build for production
npm run build

# Run tests
npm test
```

**Environment Configuration** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api',
  keycloak: {
    url: 'http://localhost:8090',
    realm: 'promocode',
    clientId: 'promocode-frontend'
  }
};
```

## API Documentation

### Authentication

All API endpoints require a valid JWT token in the Authorization header:

```bash
Authorization: Bearer <jwt-token>
X-Tenant-ID: <tenant-id>
```

### Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| POST | `/api/promo-codes` | Create promo code | ADMIN |
| GET | `/api/promo-codes` | Get all promo codes | ADMIN, BUSINESS |
| GET | `/api/promo-codes/{id}` | Get promo code by ID | ADMIN, BUSINESS |
| PUT | `/api/promo-codes/{id}` | Update promo code | ADMIN |
| DELETE | `/api/promo-codes/{id}` | Delete promo code | ADMIN |
| POST | `/api/promo-codes/filter` | Filter promo codes | ADMIN, BUSINESS |

### Examples

**Create Promo Code**
```bash
curl -X POST http://localhost:8081/api/promo-codes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Tenant-ID: tenant1" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SUMMER2024",
    "amount": 20.00,
    "discountType": "PERCENTAGE",
    "expiryDate": "2024-12-31T23:59:59",
    "usageLimit": 100,
    "status": "ACTIVE"
  }'
```

**Get All Promo Codes**
```bash
curl -X GET http://localhost:8081/api/promo-codes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Tenant-ID: tenant1"
```

**Filter Promo Codes**
```bash
curl -X POST http://localhost:8081/api/promo-codes/filter \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "X-Tenant-ID: tenant1" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SUMMER",
    "status": "ACTIVE"
  }'
```

### Swagger UI

Interactive API documentation is available at:
- http://localhost:8081/swagger-ui.html

## Database Schema

### Multi-Tenant Setup

The database uses schema-per-tenant architecture:
- `public` - Default schema
- `tenant1` - First tenant's schema
- `tenant2` - Second tenant's schema

Each tenant schema contains the same table structure but isolated data.

### Promo Codes Table

```sql
CREATE TABLE promo_codes (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL UNIQUE,
    amount DECIMAL(19,2) NOT NULL,
    discount_type VARCHAR(50) NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    usage_limit INTEGER,
    usage_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    tenant_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

## Security Configuration

### JWT Token Structure

```json
{
  "exp": 1699999999,
  "iat": 1699999999,
  "sub": "user-id",
  "preferred_username": "admin",
  "email": "admin@example.com",
  "tenant_id": "tenant1",
  "realm_access": {
    "roles": ["ADMIN"]
  }
}
```

### CORS Configuration

Backend CORS is configured to allow requests from:
- `http://localhost:4200` (Angular frontend)

To add more origins, update `SecurityConfig.java`:
```java
configuration.setAllowedOrigins(List.of(
    "http://localhost:4200",
    "https://your-production-domain.com"
));
```

## Project Structure

```
promocodeprojecthanimi/
├── backend/
│   ├── src/main/java/com/promocode/management/
│   │   ├── config/
│   │   │   ├── SecurityConfig.java        # OAuth2 & CORS configuration
│   │   │   ├── TenantContext.java         # ThreadLocal tenant storage
│   │   │   └── TenantFilter.java          # Tenant resolution filter
│   │   ├── controller/
│   │   │   └── PromoCodeController.java   # REST endpoints
│   │   ├── dto/
│   │   │   ├── PromoCodeDTO.java          # Data transfer objects
│   │   │   └── PromoCodeFilterDTO.java
│   │   ├── exception/
│   │   │   └── GlobalExceptionHandler.java # Centralized error handling
│   │   ├── model/
│   │   │   └── PromoCode.java             # JPA entity
│   │   ├── repository/
│   │   │   └── PromoCodeRepository.java   # Data access layer
│   │   └── service/
│   │       ├── PromoCodeService.java      # Business logic interface
│   │       └── PromoCodeServiceImpl.java  # Implementation
│   ├── src/main/resources/
│   │   └── application.yml                # Spring configuration
│   ├── Dockerfile                         # Multi-stage Docker build
│   └── pom.xml                            # Maven dependencies
├── frontend/
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts          # Route protection
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts    # JWT & tenant headers
│   │   │   ├── models/
│   │   │   │   └── promo-code.model.ts    # TypeScript interfaces
│   │   │   └── services/
│   │   │       └── promo-code.service.ts  # API client
│   │   ├── features/promo-codes/
│   │   │   ├── promo-code-list/           # List component
│   │   │   └── promo-code-form/           # Create/Edit form
│   │   ├── app.component.ts               # Root component
│   │   ├── app.config.ts                  # Keycloak config
│   │   └── app.routes.ts                  # Routing config
│   ├── Dockerfile                         # Multi-stage build
│   ├── nginx.conf                         # Production server config
│   ├── package.json                       # NPM dependencies
│   └── angular.json                       # Angular CLI config
├── keycloak/
│   └── realm-export.json                  # Keycloak realm configuration
├── keycloak-23.0.0/                       # Keycloak standalone server
├── docker-compose.yml                     # Docker orchestration
├── init-db.sql                            # Database initialization
└── README.md                              # This file
```

## Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Windows
netstat -ano | findstr :8090
netstat -ano | findstr :8081
netstat -ano | findstr :4200
netstat -ano | findstr :5432

# Linux/Mac
lsof -i :8090
lsof -i :8081
lsof -i :4200
lsof -i :5432

# Kill process or change ports in configuration
```

**2. Keycloak Not Starting**
```bash
# Check Java is installed
java -version

# If JAVA_HOME warning appears, set it (optional)
export JAVA_HOME=/path/to/java21

# Check Keycloak logs
# Look for "Keycloak started" message
```

**3. Backend Returns 401 Unauthorized**
```bash
# Check if issuer URI matches JWT token issuer
# Backend expects: http://localhost:8090/realms/promocode
# JWT must have: "iss": "http://localhost:8090/realms/promocode"

# Restart backend with correct env vars
docker logs promocode-backend
```

**4. Backend Returns 403 Forbidden**
```bash
# User doesn't have required role
# Check JWT token contains realm_access.roles
# ADMIN role required for create/update/delete
# BUSINESS role only has read access
```

**5. CORS Errors in Browser**
```bash
# Clear browser cache
# Try incognito/private window
# Verify CORS origins in SecurityConfig.java
```

**6. Frontend Can't Connect to Backend**
```bash
# Check all services are running
docker ps

# Verify environment URLs match
# Frontend: http://localhost:8090 (Keycloak)
# Frontend: http://localhost:8081/api (Backend)
```

### Reset Database

```bash
# Connect to PostgreSQL
docker exec -it promocode-postgres psql -U postgres -d promocode_db

# Drop and recreate schemas
DROP SCHEMA IF EXISTS tenant1 CASCADE;
DROP SCHEMA IF EXISTS tenant2 CASCADE;

# Re-run initialization
\i /docker-entrypoint-initdb.d/init-db.sql
```

### View Logs

```bash
# Backend logs
docker logs -f promocode-backend

# Frontend logs
docker logs -f promocode-frontend

# PostgreSQL logs
docker logs -f promocode-postgres

# All logs
docker logs -f promocode-backend &
docker logs -f promocode-frontend &
docker logs -f promocode-postgres
```

### Complete Reset

```bash
# Stop and remove all containers
docker stop promocode-backend promocode-frontend promocode-postgres
docker rm promocode-backend promocode-frontend promocode-postgres

# Remove volume (WARNING: deletes all data)
docker volume rm postgres_data

# Restart from step 2 in Quick Start
```

## Testing the Application

### 1. Test Multi-Tenancy

```bash
# Login as admin (tenant1)
# Create promo code "TENANT1-PROMO"

# Logout and login as admin2 (tenant2)
# Create promo code "TENANT2-PROMO"

# Verify: admin can't see TENANT2-PROMO
# Verify: admin2 can't see TENANT1-PROMO
```

### 2. Test Role-Based Access

```bash
# Login as business (BUSINESS role, tenant1)
# Try to create a promo code
# Expected: Should see an error (403 Forbidden)

# Try to view promo codes
# Expected: Should work (read-only access)

# Login as admin (ADMIN role, tenant1)
# Try to create a promo code
# Expected: Should work (full access)
```

### 3. Test CRUD Operations

```bash
# Create promo code
POST /api/promo-codes
{
  "code": "TEST2024",
  "amount": 15.00,
  "discountType": "PERCENTAGE",
  "expiryDate": "2024-12-31T23:59:59",
  "usageLimit": 50,
  "status": "ACTIVE"
}

# Update promo code
PUT /api/promo-codes/1
{
  "amount": 25.00
}

# Filter promo codes
POST /api/promo-codes/filter
{
  "code": "TEST",
  "status": "ACTIVE"
}

# Delete promo code
DELETE /api/promo-codes/1
```

### 4. Backend Unit Tests

```bash
cd backend
mvn test

# Run specific test
mvn test -Dtest=PromoCodeServiceTest

# Generate coverage report
mvn test jacoco:report
```

### 5. Frontend Unit Tests

```bash
cd frontend
npm test

# Run specific test
npm test -- --include='**/promo-code.service.spec.ts'

# Generate coverage report
npm test -- --code-coverage
```

## Deployment

### Production Checklist

- [ ] Change default admin password in Keycloak
- [ ] Use managed PostgreSQL service (AWS RDS, Azure Database, etc.)
- [ ] Enable SSL/TLS for all services
- [ ] Configure proper CORS origins (remove localhost)
- [ ] Set up environment variables for secrets
- [ ] Enable logging and monitoring
- [ ] Configure backup strategy for PostgreSQL
- [ ] Set up CI/CD pipeline
- [ ] Use production Keycloak database (not H2)
- [ ] Configure rate limiting
- [ ] Set up health checks and readiness probes

### Environment Variables for Production

```bash
# Backend
SPRING_DATASOURCE_URL=jdbc:postgresql://prod-db-host:5432/promocode_db
SPRING_DATASOURCE_USERNAME=${DB_USERNAME}
SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}
KEYCLOAK_AUTH_SERVER_URL=https://keycloak.yourdomain.com
KEYCLOAK_ISSUER_URI=https://keycloak.yourdomain.com/realms/promocode
KEYCLOAK_JWK_SET_URI=https://keycloak.yourdomain.com/realms/promocode/protocol/openid-connect/certs

# Frontend (environment.prod.ts)
apiUrl: 'https://api.yourdomain.com/api'
keycloak.url: 'https://keycloak.yourdomain.com'
```

### Docker Production Build

```bash
# Build production images
docker build -t promocode-backend:1.0.0 -f backend/Dockerfile backend/
docker build -t promocode-frontend:1.0.0 -f frontend/Dockerfile frontend/

# Tag for registry
docker tag promocode-backend:1.0.0 youracr.azurecr.io/promocode-backend:1.0.0
docker tag promocode-frontend:1.0.0 youracr.azurecr.io/promocode-frontend:1.0.0

# Push to registry
docker push youracr.azurecr.io/promocode-backend:1.0.0
docker push youracr.azurecr.io/promocode-frontend:1.0.0
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is developed as part of a technical assessment.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Keycloak logs and backend logs
3. Ensure all environment variables are set correctly
4. Verify Keycloak realm is properly imported

## Features Implemented

- Multi-tenant architecture with schema-per-tenant
- Keycloak OAuth2/OIDC authentication
- Role-based access control (ADMIN, BUSINESS)
- Complete CRUD operations for promo codes
- Filtering and search functionality
- Tenant isolation at database level
- JWT token validation with role extraction
- Angular Material UI with responsive design
- Docker containerization
- Swagger/OpenAPI documentation
- Centralized exception handling
- API-level validation
- Production-ready configuration

## Technical Highlights

- **Spring Security**: Custom JWT converter for Keycloak's nested role structure
- **Multi-Tenancy**: ThreadLocal-based tenant context with automatic schema switching
- **Angular**: Standalone components with Keycloak integration
- **Docker**: Multi-stage builds for optimized image sizes
- **PostgreSQL**: Schema-per-tenant with proper isolation
- **Keycloak**: Custom protocol mapper for tenant_id claim

---

Built with Java 21, Spring Boot 3.5+, Angular 18, PostgreSQL 16, and Keycloak 23
