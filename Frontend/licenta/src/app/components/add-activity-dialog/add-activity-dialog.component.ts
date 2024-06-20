// src/app/add-activity-dialog/add-activity-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TodoitemService } from 'src/app/services/todoitem.service';

@Component({
  selector: 'app-add-activity-dialog',
  templateUrl: './add-activity-dialog.component.html',
  styleUrls: ['./add-activity-dialog.component.scss']
})
export class AddActivityDialogComponent {
  public activityForm: FormGroup;

  constructor(
    private todoItemService: TodoitemService, // Injectează serviciul aici
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { activity: any; jobId: number }
  ) {
    this.activityForm = this.fb.group({
      name: ['', Validators.required],
      location: [''],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      description: ['', Validators.required],
    });
    if (this.data.activity) {
      this.activityForm.patchValue({
        name: this.data.activity.name,
        location: this.data.activity.location,
        startDate: this.data.activity.startDate,
        startTime: this.data.activity.startTime,
        description: this.data.activity.description
      });
    }
  }

  onSave(): void {
  if (this.activityForm.valid) {
    const activityData = {
      ...this.activityForm.value,
      jobId: this.data.jobId,  // Include ID-ul jobului din datele injectate
      id: this.data.activity ? this.data.activity.id : null  // Include ID-ul activității dacă este o actualizare
    };

    console.log("OBIECTTTT");
    console.log(activityData);

    const token = localStorage.getItem('auth_token');  // Presupunem că tokenul este stocat în localStorage
    if (token) {
      this.todoItemService.saveOrUpdateTodoItem(token, activityData).subscribe({
        next: (response) => {
          console.log('Activity saved or updated successfully', response);
          this.dialogRef.close(response);  // Închide dialogul cu răspunsul dacă este necesar
        },
        error: (error) => {
          console.error('Error saving or updating activity', error);
          this.dialogRef.close();  // Închide dialogul fără date în caz de eroare
        }
      });
    } else {
      console.error('Authentication token not found. Please log in.');
      this.dialogRef.close();  // Închide dialogul dacă nu există token
    }
  }
}


  onCancel(): void {
    this.dialogRef.close();
  }
}
