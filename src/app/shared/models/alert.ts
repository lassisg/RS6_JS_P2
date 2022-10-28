export interface IAlert {
    type: string;
    title: string;
    message: string;
    dismissible: boolean;
    delay: number;
    dialogClass: string;
    iconClass: string;
}

export class AlertSuccess implements IAlert {
    type: string = 'success';
    title: string = 'Sucesso';
    message: string;
    dismissible: boolean = false;
    dialogClass: string = 'alert-success';
    iconClass: string = 'fa-circle-check';

    delay: number = 3000; constructor(message: string) {
        this.message = message;
    }
}

export class AlertInfo implements IAlert {
    type: string = 'info';
    title: string = 'Informação';
    message: string;
    dismissible: boolean = false;
    delay: number = 3000;
    dialogClass: string = 'alert-info';
    iconClass: string = 'fa-circle-info';

    constructor(message: string) {
        this.message = message;
    }
}

export class AlertWarning implements IAlert {
    type: string = 'warning';
    title: string = 'Atenção';
    message: string;
    dismissible: boolean = true;
    delay: number = 3000;
    dialogClass: string = 'alert-warning';
    iconClass: string = 'fa-circle-exclamation';

    constructor(message: string) {
        this.message = message;
    }
}

export class AlertDanger implements IAlert {
    type: string = 'danger';
    title: string = 'Erro';
    message: string;
    dismissible: boolean = true;
    delay: number = -1;
    dialogClass: string = 'alert-danger';
    iconClass: string = 'fa-triangle-exclamation';

    constructor(message: string) {
        this.message = message;
    }
}