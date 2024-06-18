import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {

  constructor(
    public dialogRef: MatDialogRef<ColorPickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.selectedColor) {
      this.selectedColor = data.selectedColor;
    }
  }
  selectedColor: string = '#FFFFFF';  // Initializează cu o culoare implicită
  colors: string[] = [
    '#7cdfc3', '#59c5ab', '#4caa94', '#70caeb', '#2cacd5', '#4b95b9', '#214da2',
    '#e37c79', '#a84c49', '#f9d788', '#ecbd5f', '#d8a048', '#d6bcfa', '#696cbe', '#383771'
  ];


  selectColor(color: string): void {
    this.dialogRef.close(color);
  }


}
