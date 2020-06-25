import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface HelpDialogData {
    message: string;
}

@Component({
    selector: 'dialog-help',
    templateUrl: './dialog-help.html',
})
export class helpDialog {
    constructor(
        public dialogRef: MatDialogRef<helpDialog>,
        @Inject(MAT_DIALOG_DATA) public data: HelpDialogData) {}

        close(): void {
            this.dialogRef.close();
        }        
}
  