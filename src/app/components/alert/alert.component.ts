import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertType } from 'src/app/shared/models/alert-type';
import { IAlert, AlertSuccess, AlertInfo, AlertWarning, AlertDanger } from '../../shared/models/alert';


@Component({
  selector: 'app-modal',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() alert!: IAlert;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {

    if (!this.alert.dismissible || this.alert.delay > 0) {
      console.log("not dismissible");
      setTimeout(() => this.close(), this.alert.delay);
    }
  }

  getClassName() {
    return `alert-${this.alert.type}`;
  }

  getFaIconClass() {
    return this.alert.iconClass;
  }

  close() {
    this.activeModal.dismiss();
  }

  setAlertType(alertType: AlertType, message: string) {

    switch (alertType) {
      case AlertType.Success:
        this.alert = new AlertSuccess(message);
        break;

      case AlertType.Info:
        this.alert = new AlertInfo(message);
        break;

      case AlertType.Warning:
        this.alert = new AlertWarning(message);
        break;

      case AlertType.Error:
        this.alert = new AlertDanger(message);
        break;

      default:
        break;
    }
  }

}
// Put this conde on the caller component
// constructor(private modalService: NgbModal)
// showModal(alertMessage: string, alertType: AlertType) {
//   const modalRef = this.modalService.open(AlertComponent);
//   modalRef.componentInstance.setAlertType(alertType, alertMessage);
// }

