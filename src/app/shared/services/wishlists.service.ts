import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Wishlist } from '../models/wishlist';

@Injectable({
  providedIn: 'root'
})
export class ServWishlistsService {

  private urlAPI = `${environment.apiUrl}/wishlists`;

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

  updateWishlistAfterProductRemoval(productId: number) {
    this.getAllWishlists().subscribe({
      next: (response) => {
        let wishlists = response.body;

        wishlists?.forEach(wishlist => {
          wishlist.product_id = wishlist.product_id.filter(id => id !== productId);
          console.log(wishlist);
          this.updateWishlist(wishlist.id, wishlist).subscribe();
        });
      }
    });
  }

}
