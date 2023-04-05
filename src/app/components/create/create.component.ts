import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PostService } from 'src/app/services/post.service';
@Component({
  selector: 'app-create',
  templateUrl:'./create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  form: FormGroup;
  selectedFile!: File;
  loading!:boolean;
  submitted!:boolean;
  success!:boolean;

  constructor(private fb: FormBuilder, private postService: PostService, private dialogRef: MatDialogRef<CreateComponent>) {
    this.form = this.fb.group({
      caption: [''],
      media: [null]
    }, { validator: this.requiredInputValidator });
  }

  onImageSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    this.submitted = true;
    this.loading = true;

    const formData = new FormData();
    formData.append('caption', this.form.get('caption')?.value);
    formData.append('media', this.selectedFile);


    // Do something after the post has been created
    this.postService.addPost(formData).subscribe({
      next: (data) => {
        this.loading = false;
        // this.success=true;
        this.form.get('caption')?.reset()
        this.form.get('media')?.reset()
      },
      error: (err) => {
        this.loading = false;
        console.log(err.error);
        this.form?.setErrors({
          invalidInputs: { message: err.error },
        });
      },
    });
  }
  requiredInputValidator(form: FormGroup) {
    const caption = form.get('caption')?.value;
    const media = form.get('media')?.value;

    if (!caption && !media) {
      return { requiredInput: true };
    }

    return null;
  }

  /* submitPost() {
    // implement the logic to submit the post to the server
    // ...
    // close the dialog when the post is successfully submitted
    this.dialogRef.close();
  } */
}
