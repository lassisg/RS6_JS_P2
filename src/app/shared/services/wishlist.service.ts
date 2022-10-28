import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Wishlist } from '../models/wishlist';

@Injectable({
  providedIn: 'root'
})
export class ServWishlistService {

  private urlAPI = `${environment.apiUrl}/wishlist`;

  constructor(private http: HttpClient) { }

  getAllWishlists() {
    return this.http.get<Wishlist[]>(this.urlAPI, { observe: 'response' });
  }

  getWishlistByUserId(id: number) {
    return this.http.get<Wishlist[]>(
      `${this.urlAPI}?user_id_like=${id}`,
      { observe: 'response' });
  }

  updateWishlist(id: number, wishlist: Wishlist) {
    return this.http.put<Wishlist>(`${this.urlAPI}/${id}`, wishlist);
  }

  deleteWishlistMissingProduct(productId: number) {
    this.getAllWishlists().subscribe({
      next: response => {
        console.log(response);
      }
    });
  }

}
