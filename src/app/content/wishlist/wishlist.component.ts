import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Product } from 'src/app/shared/models/product';
import { ProductsService } from 'src/app/shared/services/products.service';
import { ServWishlistsService } from 'src/app/shared/services/wishlists.service';
import { User } from 'src/app/shared/models/user';
import { Wishlist } from 'src/app/shared/models/wishlist';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  title: string = "Wishlist";
  user!: User | null;
  isAdministrator: boolean = false;
  products: Product[] = [];
  wishlist!: Wishlist;
  erro: string = '';

  constructor(private authService: AuthService, private servProducts: ProductsService, private servWishlist: ServWishlistsService) {
    this.authService.getUser().subscribe(user => {
      this.user = user;
      this.checkAdminRole();
    });
  }

  ngOnInit(): void {
    // this.readProductData();
    this.readWishlistData();
  }

  readWishlistData() {
    this.servWishlist.getWishlistByUserId(this.user!.id)
      .subscribe({
        next: response => {
          this.wishlist = response.body![0];
          this.readProductData();
        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          this.erro = error;
        }
      });
  }

  readProductData() {

    this.servProducts
      .getProducts()
      .subscribe({
        next: response => {
          this.products = response.body!
            .filter(item => {
              return this.wishlist.product_id.includes(item.id);
            });

        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          this.erro = error;
        }
      });

  }

  removeStar(id: number) {
    this.wishlist.product_id = this.wishlist.product_id.filter(productId => productId !== id);

    this.servWishlist.updateWishlist(this.wishlist.id, this.wishlist)
      .subscribe({
        next: resultado => {
          console.log(`Produto editado! Id: ${resultado.id}`);
          this.readProductData();
        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          this.erro = error;
        }
      });
  }

  checkAdminRole() {
    this.authService.isAdmin()!
      .pipe(first()).subscribe(isAdmin => {
        this.isAdministrator = isAdmin;
      });
  }

}
