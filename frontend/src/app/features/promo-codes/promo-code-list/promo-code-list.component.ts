import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { PromoCodeService } from '../../../core/services/promo-code.service';
import { PromoCode, PromoCodeFilter } from '../../../core/models/promo-code.model';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-promo-code-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
  ],
  templateUrl: './promo-code-list.component.html',
  styleUrls: ['./promo-code-list.component.scss']
})
export class PromoCodeListComponent implements OnInit {
  displayedColumns: string[] = ['code', 'amount', 'discountType', 'expiryDate', 'usageCount', 'usageLimit', 'status', 'actions'];
  promoCodes: PromoCode[] = [];
  isAdmin = false;
  
  filter: PromoCodeFilter = {};

  constructor(
    private promoCodeService: PromoCodeService,
    private router: Router,
    private keycloak: KeycloakService
  ) {}

  ngOnInit() {
    this.isAdmin = this.keycloak.isUserInRole('ADMIN');
    this.loadPromoCodes();
  }

  loadPromoCodes() {
    this.promoCodeService.getAllPromoCodes().subscribe({
      next: (data) => this.promoCodes = data,
      error: (error) => console.error('Error loading promo codes', error)
    });
  }

  applyFilter() {
    this.promoCodeService.filterPromoCodes(this.filter).subscribe({
      next: (data) => this.promoCodes = data,
      error: (error) => console.error('Error filtering promo codes', error)
    });
  }

  clearFilter() {
    this.filter = {};
    this.loadPromoCodes();
  }

  editPromoCode(id: number) {
    this.router.navigate(['/promo-codes/edit', id]);
  }

  deletePromoCode(id: number) {
    if (confirm('Are you sure you want to delete this promo code?')) {
      this.promoCodeService.deletePromoCode(id).subscribe({
        next: () => this.loadPromoCodes(),
        error: (error) => console.error('Error deleting promo code', error)
      });
    }
  }

  createPromoCode() {
    this.router.navigate(['/promo-codes/create']);
  }
}
