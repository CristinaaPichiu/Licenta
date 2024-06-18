// job-column.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-job-column',
  templateUrl: './job-column.component.html',
  styleUrls: ['./job-column.component.scss']
})
export class JobColumnComponent {
  colors: string[] = ['#FF5733', '#33FF57', '#3357FF', '#FFFF33', '#FF33FF', '#33FFFF']; // Adaugă mai multe culori după preferințe

  @Output() colorSelected = new EventEmitter<string>();

  selectColor(color: string) {
    this.colorSelected.emit(color);
  }

}
