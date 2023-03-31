import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  constructor(private dialogRef: MatDialogRef<CreateComponent>) {}
  submitPost() {
    // implement the logic to submit the post to the server
    // ...
    // close the dialog when the post is successfully submitted
    this.dialogRef.close();
  }
}
