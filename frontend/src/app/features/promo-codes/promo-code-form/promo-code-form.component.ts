import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PromoCodeService } from '../../../core/services/promo-code.service';
import { PromoCode } from '../../../core/models/promo-code.model';

@Component({
  selector: 'app-promo-code-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './promo-code-form.component.html',
  styleUrls: ['./promo-code-form.component.scss']
})
export class PromoCodeFormComponent implements OnInit {
  promoCodeForm: FormGroup;
  isEditMode = false;
  promoCodeId?: number;

  constructor(
    private fb: FormBuilder,
    private promoCodeService: PromoCodeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.promoCodeForm = this.fb.group({
      code: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      discountType: ['PERCENTAGE', Validators.required],
      expiryDate: ['', Validators.required],
      usageLimit: [null],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.promoCodeId = +id;
      this.loadPromoCode(this.promoCodeId);
    }
  }

  loadPromoCode(id: number) {
    this.promoCodeService.getPromoCodeById(id).subscribe({
      next: (data) => {
        this.promoCodeForm.patchValue({
          code: data.code,
          amount: data.amount,
          discountType: data.discountType,
          expiryDate: new Date(data.expiryDate),
          usageLimit: data.usageLimit,
          status: data.status
        });
      },
      error: (error) => console.error('Error loading promo code', error)
    });
  }

  onSubmit() {
    if (this.promoCodeForm.valid) {
      const promoCode: PromoCode = this.promoCodeForm.value;
      
      if (this.isEditMode && this.promoCodeId) {
        this.promoCodeService.updatePromoCode(this.promoCodeId, promoCode).subscribe({
          next: () => this.router.navigate(['/promo-codes']),
          error: (error) => console.error('Error updating promo code', error)
        });
      } else {
        this.promoCodeService.createPromoCode(promoCode).subscribe({
          next: () => this.router.navigate(['/promo-codes']),
          error: (error) => console.error('Error creating promo code', error)
        });
      }
    }
  }

  cancel() {
    this.router.navigate(['/promo-codes']);
  }
}
