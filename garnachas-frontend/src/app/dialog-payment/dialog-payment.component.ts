import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-payment',
  templateUrl: './dialog-payment.component.html',
  styleUrls: ['./dialog-payment.component.css']
})
export class DialogPaymentComponent {
  constructor(
    private dialogRef: MatDialogRef<DialogPaymentComponent>,
  ) {}

  payWithCash(): void {
    this.dialogRef.close('cash'); // Devuelve 'cash' como resultado
  }

  payWithCard(): void {
    this.dialogRef.close('card'); // Devuelve 'card' como resultado
  }
}