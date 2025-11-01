-- Create schemas for multi-tenancy
CREATE SCHEMA IF NOT EXISTS public;
CREATE SCHEMA IF NOT EXISTS tenant1;
CREATE SCHEMA IF NOT EXISTS tenant2;

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA tenant1 TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA tenant2 TO postgres;

-- Create Keycloak database
CREATE DATABASE keycloak;

COMMENT ON SCHEMA tenant1 IS 'Tenant 1 schema for multi-tenancy';
COMMENT ON SCHEMA tenant2 IS 'Tenant 2 schema for multi-tenancy';
