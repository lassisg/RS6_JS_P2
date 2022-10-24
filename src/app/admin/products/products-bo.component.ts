import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/product';
import { ServProductsService } from 'src/app/shared/serv-products.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServProductTypesService } from 'src/app/shared/serv-product-types.service';
import { ProductType } from 'src/app/shared/productType';

@Component({
  selector: 'app-products-bo',
  templateUrl: './products-bo.component.html',
  styleUrls: ['./products-bo.component.css']
})
export class ProductsBoComponent implements OnInit {

  title: string = "Gestão de produtos";
  products: Product[] = [];
  productTypes: ProductType[] = [];
  formProducts!: FormGroup;
  erro: string = '';
  isNew: boolean = true;
  productId: number = 0;
  searchTerm: string = '';

  constructor(private servProducts: ServProductsService, private servProductTypes: ServProductTypesService) { }

  ngOnInit(): void {
    this.readProductTypeData();
    this.readData();
    this.bindForm();
  }

  // TODO: Review validation
  bindForm() {
    this.formProducts = new FormGroup({
      name: new FormControl('', {
        // updateOn:'submit',
        initialValueIsDefault: true,
        validators: [
          Validators.required,
          Validators.pattern('[a-zA-Z ]{3,20}')]
      }),
      brand: new FormControl('', {
        // updateOn:'submit',
        initialValueIsDefault: true,
        validators: [
          Validators.required,
          Validators.pattern('[a-zA-Z ]{3,20}')]
      }),
      product_type: new FormControl('', Validators.required),
      color: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      featured: new FormControl(false)
    });
  }

  readProductTypeData() {
    this.servProductTypes.getProductTypes()
      .subscribe({
        next: response => {
          this.productTypes = response;
        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          this.erro = error;
        }
      });
  }

  readData() {

    this.servProducts
      .getProducts()
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

  searchProduct(searchTerm: string) {
    console.log(searchTerm);
  }

  addOrUpdateProduct() {
    if (this.formProducts.valid) {

      if (this.isNew) {
        this.addProduct(this.formProducts.value);
      } else {
        this.updateProduct(this.formProducts.value);
      }
      this.formProducts.reset();

    } else {
      alert("Formulário inválido!");
    }
  }

  addProduct(product: Product) {
    this.servProducts.addProduct(product)
      .subscribe({
        next: resultado => {
          console.log(`'${resultado.name}' adicionado!`);
          this.readData();
        }
      });
  }

  updateProduct(product: Product) {
    this.servProducts.updateProduct(this.productId, product)
      .subscribe({
        next: resultado => {
          console.log(`'${resultado.name}' editado!`);
          this.isNew = true;
          this.readData();
        }
      });
  }

  removeProduct(id: number) {
    let productName = this.products.find(p => p.id === id)?.name;
    this.servProducts.deleteProduct(id).subscribe({
      next: () => {
        console.log(`'${productName}' eliminado`);
        this.readData();
      }
    });
  }

  fillForm(product: Product) {

    this.formProducts.setValue({
      name: product.name,
      brand: product.brand,
      product_type: product.product_type,
      color: product.color,
      price: product.price,
      description: product.description,
      featured: product.featured
    });

    this.isNew = false;
    this.productId = product.id;

  }

}
