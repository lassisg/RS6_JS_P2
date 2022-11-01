import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { ProductsService } from 'src/app/shared/services/products.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductTypesService } from 'src/app/shared/services/product-types.service';
import { ProductType } from 'src/app/shared/models/product-type';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertType } from 'src/app/shared/models/alert-type';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { ServWishlistsService } from 'src/app/shared/services/wishlists.service';

@Component({
  selector: 'app-products-bo',
  templateUrl: './products-bo.component.html',
  styleUrls: ['./products-bo.component.css']
})
export class ProductsBoComponent implements OnInit {

  title: string = "Gestão de produtos";
  products: Product[] = [];
  productTypes: ProductType[] = [];
  erro: string = '';

  isNew: boolean = true;
  productId: number = 0;
  formProducts!: FormGroup;
  maxAllowedFeaturedProducts: number = 8;

  searchResult: Product[] = [];
  searchParam: string = 'name';
  searchTerm: string = '';

  page: number = 1;
  pageSize: number = 10;
  pageProducts: Product[] = [];

  constructor(private servProducts: ProductsService, private servProductTypes: ProductTypesService, private servWishlists: ServWishlistsService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.readProductTypeData();
    this.readProductData();
    this.bindForm();
  }

  refreshProducts() {
    this.pageProducts = this.searchResult
      .slice(
        (this.page - 1) * this.pageSize,
        (this.page - 1) * this.pageSize + this.pageSize);
  }

  bindForm() {
    this.formProducts = new FormGroup({
      name: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern('[-.\'\\w\u00C0-\u00FF ]{3,50}')]
      }),
      brand: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern('[-.\'\\w\u00C0-\u00FF ]{3,50}')]
      }),
      product_type: new FormControl('', Validators.required),
      color: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern('[\\w\u00C0-\u00FF ]{3,20}')]
      }),
      price: new FormControl('', {
        validators: [
          Validators.required,
          Validators.min(1)]
      }),
      description: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern('[-.,\:\;\'\\w\u00C0-\u00FF ]{3,250}')]
      }),
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

  readProductData() {

    this.servProducts
      .getProducts()
      .subscribe({
        next: response => {
          this.products = response.body!;
          this.pageProducts = [...this.products.slice(0, this.pageSize)];
          this.searchProduct('');
        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          this.erro = error;
        }
      });
  }

  searchProduct(searchTerm: string) {

    this.servProducts.searchProducts(this.searchParam, searchTerm)
      .subscribe({
        next: response => {
          this.searchResult = response.body!;
          this.refreshProducts();
        },
        error: error => {
          console.log("Ocorreu um erro!" + error);
          this.erro = error;
        }
      });

  }

  addOrUpdateProduct() {
    if (this.formProducts.valid) {

      if (this.exceedsAllowedFeaturedProducts()) {
        this.showModal("Excede produtos em destaque (máximo 8)", AlertType.Warning);
        return;
      }

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

  exceedsAllowedFeaturedProducts() {
    let featuredProductsCount: number = this.products
      .filter(product => product.featured).length;
    featuredProductsCount += (this.formProducts.value.featured ? 1 : 0);

    return featuredProductsCount > this.maxAllowedFeaturedProducts;
  }

  addProduct(product: Product) {
    this.servProducts.addProduct(product)
      .subscribe({
        next: resultado => {
          console.log(`'${resultado.name}' adicionado!`);
          this.readProductData();
        }
      });
  }

  updateProduct(product: Product) {
    this.servProducts.updateProduct(this.productId, product)
      .subscribe({
        next: resultado => {
          console.log(`'${resultado.name}' editado!`);
          this.isNew = true;
          this.readProductData();
        }
      });
  }

  // TODO: 3. Show modal before execution
  confirmRemoval(id: number) {
    let productName = this.products.find(p => p.id === id)?.name;
    // If confirm, remove
    // Else, return
  }

  removeProduct(id: number) {
    let productName = this.products.find(p => p.id === id)?.name;
    this.servProducts.deleteProduct(id).subscribe({
      next: () => {
        console.log(`'${productName}' eliminado`);
        this.servWishlists.updateWishlistAfterProductRemoval(id);
        this.readProductData();
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

  showModal(alertMessage: string, alertType: AlertType) {
    const modalRef = this.modalService.open(AlertComponent);
    modalRef.componentInstance.setAlertType(alertType, alertMessage);
  }

}
