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
    private todoItemService: TodoitemService, 
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
      jobId: this.data.jobId,  
      id: this.data.activity ? this.data.activity.id : null  
    };

    console.log("OBIECTTTT");
    console.log(activityData);

    const token = localStorage.getItem('auth_token');  
    if (token) {
      this.todoItemService.saveOrUpdateTodoItem(token, activityData).subscribe({
        next: (response) => {
          console.log('Activity saved or updated successfully', response);
          this.dialogRef.close(response); 
        },
        error: (error) => {
          console.error('Error saving or updating activity', error);
          this.dialogRef.close();  
        }
      });
    } else {
      console.error('Authentication token not found. Please log in.');
      this.dialogRef.close();  
    }
  }
}


  onCancel(): void {
    this.dialogRef.close();
  }
}
