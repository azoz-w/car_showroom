import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private apiUrl = 'http://localhost:8080/api/car';

  constructor(private http: HttpClient) {}

  getShowroomCars(
    // showroomId: string,
    page: number,
    size: number,
    sort: string,
    direction: string
    // search?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort)
      .set('direction', direction);

    // if (search) {
    //   params = params.set('search', search);
    // }

    return this.http.get(`${this.apiUrl}`, { params });
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
