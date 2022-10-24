import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/product';
import { ServProductsService } from 'src/app/shared/serv-products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  productCount: number = 0;
  productTypes = new Set();
  productColors = new Set();
  filterColorQuery: string[] = [];
  filterTypeQuery: string[] = [];
  activeFilter: boolean = false;
  erro: string = '';
  productOnLoad: number = 6;
  productStep: number = 3;

  constructor(private servProducts: ServProductsService) { }

  ngOnInit(): void {
    this.readProductTypeData();
    this.readProductColorData()
    this.readData(0, this.productOnLoad);
  }

  readProductTypeData() {
    this.servProducts.getProductTypesInUse()
      .subscribe({
        next: response => {
          this.productTypes = new Set(response.sort());
        }
      });
  }

  readProductColorData() {
    this.servProducts.getProductColorsInUse()
      .subscribe({
        next: response => {
          this.productColors = new Set(response.sort());
        }
      });
  }

  readData(start: number, end: number) {

    this.servProducts
      .getNextProducts(start, end)
      .subscribe({
        next: response => {
          this.products.push(...response.body!);

          if (this.productCount === 0) {
            this.productCount = Number(response.headers.get('x-total-count'));
          }

          // Makes sure the filter works after button click
          this.updateSearchArrays();
        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          this.erro = error;
        }
      });

  }

  getNext() {

    if (this.products.length < this.productCount) {
      this.readData(this.products.length, this.products.length + this.productStep);
    }

  }

  // FIXME: Add to wishlist, not to featured
  // TODO: If user logged, add to user's whishlist
  // Otherwise, save to LocalStorage for late sync (when logged)
  toggleStar(id: number, featured: boolean) {
    let productToUpdate = this.products.find(product => product.id === id);
    productToUpdate!.featured = !featured;

    this.servProducts.updateProduct(productToUpdate!.id, productToUpdate!).subscribe({
      next: resultado => {
        console.log(`Produto editado! Id: ${resultado.id}`);
      },
      error: error => {
        console.log("Ocorreu um erro!" + error);
        this.erro = error;
      }
    });
  }

  // TODO: Improve method
  filterProducts(event: any) {

    let currentCheckboxStatus = event.target.checked;
    let currentCheckboxGroup = event.target.attributes['data-type'].value;
    let currentCheckboxValue = event.target.attributes['value'].value;

    if (currentCheckboxStatus) {
      this.activeFilter = !this.activeFilter;

      switch (currentCheckboxGroup) {
        case 'cor':
          this.filterColorQuery.push(currentCheckboxValue);
          break;

        case 'tipo_de_produto':
          this.filterTypeQuery.push(currentCheckboxValue);
          break;
      }

    } else {
      this.activeFilter = !this.activeFilter;
      let position: number = -1;

      switch (currentCheckboxGroup) {
        case 'cor':
          position = this.filterColorQuery.indexOf(currentCheckboxValue);
          this.filterColorQuery.splice(position, 1);
          break;

        case 'tipo_de_produto':
          position = this.filterTypeQuery.indexOf(currentCheckboxValue);
          this.filterTypeQuery.splice(position, 1);
          break;
      }

    }

    this.updateSearchArrays();

  }

  updateSearchArrays() {
    this.filteredProducts = this.products;

    if (this.filterTypeQuery.length > 0) {
      this.activeFilter = true;
      this.filteredProducts = this.products.filter(p => this.filterTypeQuery.includes(p.product_type));
    }
    if (this.filterColorQuery.length > 0) {
      this.activeFilter = true;
      this.filteredProducts = this.filteredProducts.filter(p => this.filterColorQuery.includes(p.color));
    }

  }

}
