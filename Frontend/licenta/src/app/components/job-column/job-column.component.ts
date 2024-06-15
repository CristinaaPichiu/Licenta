// job-column.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-job-column',
  templateUrl: './job-column.component.html',
  styleUrls: ['./job-column.component.scss']
})
export class JobColumnComponent {
  @Input() title: string = '';
  @Input() jobs: any[] = [];  
  @Input() message: string = '';  
  @Input() showMessage: boolean = false;  
  @Input() connectedDropLists!: string[]; // IDs of all drop lists to connect this list with

  @Output() addClicked = new EventEmitter<void>();  
  @Output() jobDropped = new EventEmitter<CdkDragDrop<any[]>>();

  onAddClick(): void {
    this.addClicked.emit();
  }

  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      // Rearanjează în aceeași listă
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Transferă între liste diferite
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.jobDropped.emit(event); // Anunță componenta părinte despre transfer
    }
  }
  
  
}
