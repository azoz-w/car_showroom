import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Showroom } from '../models/showroom.model';

@Injectable({ providedIn: 'root' })
export class ShowroomService {
  private apiUrl = 'http://localhost:8080/api/showroom';

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

    return this.http.get<any>(this.apiUrl, { params });
  }

  createShowroom(showroom: Showroom): Observable<Showroom> {
    return this.http.post<Showroom>(this.apiUrl, showroom);
  }

  getShowroom(commercialRegistrationNumber: string): Observable<Showroom> {
    return this.http.get<Showroom>(
      `${this.apiUrl}/${commercialRegistrationNumber}`
    );
  }

  updateShowroom(
    commercialRegistrationNumber: string,
    showroom: Partial<Showroom>
  ): Observable<Showroom> {
    return this.http.patch<Showroom>(
      `${this.apiUrl}/${commercialRegistrationNumber}`,
      showroom
    );
  }

  deleteShowroom(commercialRegistrationNumber: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${commercialRegistrationNumber}`
    );
  }
}
