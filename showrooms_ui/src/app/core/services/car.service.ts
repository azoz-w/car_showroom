import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarSearchCriteria } from '../models/car.criteria.model';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private apiUrl = 'http://localhost:8080/api/car';

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

    return this.http.get(`${this.apiUrl}/${commercialRegistrationNumber}`, { params });
  }
  createCar(
    commercialRegistrationNumber: string,
    carData: any
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${commercialRegistrationNumber}`,
      carData
    );
  }
}
