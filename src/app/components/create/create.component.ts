import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnDestroy{
  form: FormGroup;
  selectedFile: File | undefined = undefined;
  loading!: boolean;
  submitted!: boolean;
  success!: boolean;
  arrayOfSubscriptions: Subscription[] = []
  constructor(private fb: FormBuilder, private postService: PostService, private dialogRef: MatDialogRef<CreateComponent>) {
    this.form = this.fb.group({
      caption: [''],
      media: [undefined]
    }, { validator: this.requiredInputValidator });
  }

  ngOnDestroy(): void {
    this.arrayOfSubscriptions.forEach(s => s.unsubscribe())
  }

  onImageSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    this.submitted = true;
    this.loading = true;

    const formData = new FormData();
    formData.append('caption', this.form.get('caption')?.value);
    if (this.selectedFile) {
      formData.append('media', this.selectedFile);
    }


    // Do something after the post has been created
    this.arrayOfSubscriptions.push(
      this.postService.addPost(formData).subscribe({
        next: (data) => {
          console.log(data);

          this.loading = false;
          // this.success=true;
          this.form.get('caption')?.reset()
          this.form.get('media')?.reset()
          this.selectedFile = undefined
        },
        error: (err) => {
          this.loading = false;
          console.log(err.error);
          this.form?.setErrors({
            invalidInputs: { message: err.error },
          });
        },
      })
    )

  }
  requiredInputValidator(form: FormGroup) {
    const caption = form.get('caption')?.value;
    const media = form.get('media')?.value;
    // this.selectedFile = null;

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

  getFile(event: any) {
    console.log(event.target);
    ;
  }

  sub(event: any) {
    var file = event.target.files[0];
    var fileName = file.split("\\");
    console.log(fileName);
    // document.getElementById("yourBtn").innerHTML = fileName[fileName.length - 1];
    // document.myForm.submit();
    // event.preventDefault();
  }
}
