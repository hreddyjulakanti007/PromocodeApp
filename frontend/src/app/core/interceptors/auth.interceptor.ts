import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(KeycloakService);
  
  // Skip interceptor for non-API requests
  if (!req.url.includes('/api/')) {
    return next(req);
  }
  
  // Get token synchronously from Keycloak instance
  const keycloakInstance = keycloak.getKeycloakInstance();
  const token = keycloakInstance.token;
  const tokenParsed = keycloakInstance.tokenParsed;
  const tenantId = tokenParsed?.['tenant_id'];
  
  const headers: Record<string, string> = {};
  
  // Add Authorization header with JWT token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Add Tenant ID header
  if (tenantId) {
    headers['X-Tenant-ID'] = tenantId;
  }
  
  const clonedReq = req.clone({ setHeaders: headers });
  return next(clonedReq);
};
