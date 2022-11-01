import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/shared/models/product';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  @Input() productId!: number;

  formTitle: string = "Confirmação de remoção de produto";
  product!: Product;

  constructor(private servProducts: ProductsService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.servProducts.getProductById(this.productId).subscribe({
      next: (response) => {
        this.product = response.body!;
      }
    });
  }

  confirmProductRemoval() {
    this.activeModal.close();
  }

  dismissModal() {
    this.activeModal.dismiss();
  }

}
