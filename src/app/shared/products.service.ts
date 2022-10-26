import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Product } from './product'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private urlAPI = "http://localhost:3000/products";

  constructor(private http: HttpClient) { }


  addProduct(product: Product) {
    return this.http.post<Product>(this.urlAPI, product);
  }

  getProducts() {
    return this.http.get<Product[]>(this.urlAPI, { observe: 'response' });
  }

  getProductById(id: number) {
    return this.http.get<Product>(
      `${this.urlAPI}/${id}`,
      { observe: 'response' });
  }

  updateProduct(productId: number, product: Product) {
    return this.http.put<Product>(`${this.urlAPI}/${productId}`, product);
  }

  // TODO: Propagate delete, removing from wishlists
  deleteProduct(id: number) {
    return this.http.delete<Product>(`${this.urlAPI}/${id}`);
  }

  getProductTypesInUse() {
    let products = this.http.get<Product[]>(this.urlAPI);
    return products.pipe(
      map(items => items.map(item => item.product_type)));
  }

  getProductColorsInUse() {
    let products = this.http.get<Product[]>(this.urlAPI);
    let productColors = products.pipe(
      map(items => items.map(item => item.color)))

    return productColors;
  }

  getNextProducts(start: number, end: number) {
    return this.http.get<Product[]>(
      `${this.urlAPI}?_start=${start}&_end=${end}`,
      { observe: 'response' });
  }

  getFeaturedProducts() {
    return this.http.get<Product[]>(
      `${this.urlAPI}?featured_like=${true}&_sort=name`,
      { observe: 'response' });
  }

  // FIXME: Add to wishlist, not to featured
  getWishlistedProducts() {
    return this.http.get<Product[]>(
      `${this.urlAPI}?featured_like=true`,
      { observe: 'response' });
  }

}
