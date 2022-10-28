import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  title: string = '';
  buttonTitle = "OK";
  type: string = "error";

  protected modalRef!: NgbModalRef;

  constructor(protected alertService: NgbModal) { }

  public show(title: string, message: string) {
    this.title = title;
    this.modalRef = this.alertService.open(
      message
    );
  }

  hide() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}