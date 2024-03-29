import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductType } from '../models/product-type';

@Injectable({
  providedIn: 'root'
})
export class ProductTypesService {

  private urlAPI = "http://localhost:3000/product_types";

  constructor(private http: HttpClient) { }

  getProductTypes() {
    return this.http.get<ProductType[]>(`${this.urlAPI}?_sort=name`);
  }

}
