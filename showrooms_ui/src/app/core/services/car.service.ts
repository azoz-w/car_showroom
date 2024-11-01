import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarSearchCriteria } from '../models/car.criteria.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private readonly API_URL = `${environment.apiUrl}/car`;

  constructor(private http: HttpClient) {}

  getShowroomCars(
    commercialRegistrationNumber: string,
    page: number,
    size: number,
    sort: string,
    direction: string,
    criteria?: CarSearchCriteria
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort)
      .set('direction', direction);

    // Add search criteria to params
    if (criteria) {
      Object.entries(criteria).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get(`${this.API_URL}/${commercialRegistrationNumber}`, { params });
  }
  createCar(
    commercialRegistrationNumber: string,
    carData: any
  ): Observable<any> {
    return this.http.post(
      `${this.API_URL}/${commercialRegistrationNumber}`,
      carData
    );
  }
}
