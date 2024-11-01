import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Showroom } from '../models/showroom.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ShowroomService {
  private readonly API_URL = `${environment.apiUrl}/showroom`;

  constructor(private http: HttpClient) {}

  getShowrooms(
    page: number,
    size: number,
    sort: string,
    direction: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort)
      .set('direction', direction);

    return this.http.get<any>(this.API_URL, { params });
  }

  createShowroom(showroom: Showroom): Observable<Showroom> {
    return this.http.post<Showroom>(this.API_URL, showroom);
  }

  getShowroom(commercialRegistrationNumber: string): Observable<Showroom> {
    return this.http.get<Showroom>(
      `${this.API_URL}/${commercialRegistrationNumber}`
    );
  }

  updateShowroom(
    commercialRegistrationNumber: string,
    showroom: Partial<Showroom>
  ): Observable<Showroom> {
    return this.http.patch<Showroom>(
      `${this.API_URL}/${commercialRegistrationNumber}`,
      showroom
    );
  }

  deleteShowroom(commercialRegistrationNumber: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/${commercialRegistrationNumber}`
    );
  }
}
