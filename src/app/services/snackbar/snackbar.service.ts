import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(public snackBar: MatSnackBar) { }

  openSnackBar(data) {
    if (!data.horizon) {
      data.horizon = this.horizontalPosition;
    }
    if (!data.vertical) {
      data.vertical = this.verticalPosition;
    }
    if (!data.txt) {
      data.txt = 'Close';
    }
    if (!data.duration) {
      data.duration = 3000;
    }
    this.snackBar.open(data.message, data.txt, {
      duration: data.duration,
      horizontalPosition: data.horizon,
      verticalPosition: data.vertical,
    });
  }

}
