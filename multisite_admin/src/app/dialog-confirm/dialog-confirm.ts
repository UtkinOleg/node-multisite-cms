import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogData {
    message: string;
}

@Component({
    selector: 'dialog-confirm',
    templateUrl: './dialog-confirm.html',
})
export class confirmDialog {
    constructor(
        public dialogRef: MatDialogRef<confirmDialog>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {}

        Yes(): void {
            this.dialogRef.close(true)
        } 

        No(): void {
            this.dialogRef.close(false)
        }        
}
  