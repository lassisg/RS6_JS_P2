import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Product } from 'src/app/shared/models/product';
import { ProductsService } from 'src/app/shared/services/products.service';
import { ServWishlistsService } from 'src/app/shared/services/wishlists.service';
import { User } from 'src/app/shared/models/user';
import { Wishlist } from 'src/app/shared/models/wishlist';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { AlertType } from 'src/app/shared/models/alert-type';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  title: string = "Homem";

  user!: User | null;
  isAdministrator: boolean = false;
  products: Product[] = [];
  productCount: number = 0;
  productTypes = new Set();
  productColors = new Set();
  wishlist!: Wishlist;
  filteredProducts: Product[] = [];
  filterColorQuery: string[] = [];
  filterTypeQuery: string[] = [];
  activeFilter: boolean = false;
  erro: string = '';
  productOnLoad: number = 6;
  productStep: number = 3;

  constructor(private modalService: NgbModal, private servProducts: ProductsService, private authService: AuthService, private servWishlist: ServWishlistsService) {
    this.authService.getUser().subscribe(user => {
      this.user = user;
      this.checkAdminRole();
    });
  }

  ngOnInit(): void {
    this.readProductTypeData();
    this.readProductColorData()
    this.readProductData(0, this.productOnLoad);
    this.readWishlistData();
  }

  readWishlistData() {
    this.servWishlist.getWishlistByUserId(this.user!.id)
      .subscribe({
        next: response => {
          this.wishlist = response.body![0];
        }
      });
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

  readProductData(start: number, end: number) {

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
      this.readProductData(this.products.length, this.products.length + this.productStep);
    }

  }

  addStar(id: number) {

    if (this.isAdministrator) {
      this.showModal("Administradores não possuem wishlist.", AlertType.Info);
      return;
    }

    if (!this.user) {
      this.showModal("É preciso estar autenticado para usar a wishlist.", AlertType.Info);
      return;
    }

    if (this.wishlist.product_id.includes(id)) {
      this.showModal("Produto já está na wishlist.", AlertType.Warning);
      return;
    }

    this.wishlist.product_id.push(id);

    this.servWishlist.updateWishlist(this.wishlist.id, this.wishlist).subscribe({
      next: resultado => {
        console.log(`Produto editado! Id: ${resultado.id}`);
      },
      error: error => {
        console.log("Ocorreu um erro!" + error);
        this.erro = error;
      }
    });
  }

  // TODO: 3. Improve method
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

  checkAdminRole() {
    this.authService.isAdmin()!
      .pipe(first()).subscribe(isAdmin => {
        this.isAdministrator = isAdmin;
      });
  }

  showModal(alertMessage: string, alertType: AlertType) {
    const modalRef = this.modalService.open(AlertComponent);
    modalRef.componentInstance.setAlertType(alertType, alertMessage);
  }

}
