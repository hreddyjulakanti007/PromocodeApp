import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { KeycloakService } from 'keycloak-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Promo Code Management</span>
      <span class="spacer"></span>
      <span *ngIf="username">{{ username }}</span>
      <button mat-icon-button (click)="logout()">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class AppComponent {
  username: string = '';

  constructor(private keycloak: KeycloakService) {
    this.loadUsername();
  }

  loadUsername() {
    try {
      // Get username directly from the token instead of making an API call
      const tokenParsed = this.keycloak.getKeycloakInstance().tokenParsed;
      this.username = tokenParsed?.['preferred_username'] || tokenParsed?.['name'] || '';
    } catch (error) {
      console.error('Failed to load username', error);
    }
  }

  logout() {
    this.keycloak.logout();
  }
}
