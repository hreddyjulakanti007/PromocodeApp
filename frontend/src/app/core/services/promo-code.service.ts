import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PromoCode, PromoCodeFilter } from '../models/promo-code.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromoCodeService {
  private apiUrl = `${environment.apiUrl}/api/promo-codes`;

  constructor(private http: HttpClient) {}

  getAllPromoCodes(): Observable<PromoCode[]> {
    return this.http.get<PromoCode[]>(this.apiUrl);
  }

  getPromoCodeById(id: number): Observable<PromoCode> {
    return this.http.get<PromoCode>(`${this.apiUrl}/${id}`);
  }

  createPromoCode(promoCode: PromoCode): Observable<PromoCode> {
    return this.http.post<PromoCode>(this.apiUrl, promoCode);
  }

  updatePromoCode(id: number, promoCode: PromoCode): Observable<PromoCode> {
    return this.http.put<PromoCode>(`${this.apiUrl}/${id}`, promoCode);
  }

  deletePromoCode(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  filterPromoCodes(filter: PromoCodeFilter): Observable<PromoCode[]> {
    return this.http.post<PromoCode[]>(`${this.apiUrl}/filter`, filter);
  }
}
