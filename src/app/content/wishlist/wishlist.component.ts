import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/product';
import { ProductsService } from 'src/app/shared/products.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  title: string = "Wishlist";
  products: Product[] = [];
  erro: string = '';

  constructor(private servProducts: ProductsService) { }

  ngOnInit(): void {
    this.readData();
  }

  readData() {
    this.servProducts.getWishlistedProducts()
      .subscribe({
        next: response => {
          this.products = response.body!;
        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          this.erro = error;
        }
      });
  }

  // FIXME: Add to wishlist, not to featured
  removeStar(id: number) {
    let productToUpdate = this.products.find(product => product.id === id);
    productToUpdate!.featured = false;

    this.servProducts.updateProduct(productToUpdate!.id, productToUpdate!).subscribe({
      next: resultado => {
        console.log(`Produto editado! Id: ${resultado.id}`);
        this.products = this.products.filter(product => product.id !== resultado.id);
      },
      error: error => {
        console.log("Ocorreu um erro!" + error);
        this.erro = error;
      }
    });
  }

}
