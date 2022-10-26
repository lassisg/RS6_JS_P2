import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/product';
import { ProductsService } from 'src/app/shared/products.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  id!: number;
  product!: Product;
  erro: string = '';

  constructor(private activeRoute: ActivatedRoute, private servProducts: ProductsService) { }

  ngOnInit(): void {
    this.id = Number(this.activeRoute.snapshot.paramMap.get("id"));
    this.readData();
  }

  readData() {
    this.servProducts.getProductById(this.id).subscribe({
      next: response => {
        this.product = response.body!;
      },
      error: error => {
        console.log("Ocorreu um erro!" + error);
        this.erro = error;
      }
    });
  }
}
