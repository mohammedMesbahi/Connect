import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PasswordValidators } from './password.validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form!: FormGroup;
  loading = false;
  submitted = false;
  selectedFile!: File ;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService
  ) /* private accountService: AccountService,
        private alertService: AlertService */
  {}

  ngOnInit() {
    this.form = this.formBuilder.group(
      {
        name: ['user6', [Validators.required,Validators.minLength(4)]],
        avatar: [null,[Validators.required]],
        email: ['user6@gmail.com', [Validators.required,Validators.email]],
        password: ['1234', [Validators.required, Validators.minLength(4)]],
        confirmedPassword: ['1234', [Validators.required]],
      }
      ,{Validators:[PasswordValidators.passwordsShouldMatch]}
    );

  }

  // convenience getter for easy access to form fields
  get f(): any {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;

    const formData = new FormData();
    formData.append('name', this.form?.get('name')?.value);
    formData.append('email', this.form?.get('email')?.value);
    formData.append('password', this.form?.get('password')?.value);
    formData.append('avatar', this.selectedFile);


    this.authservice.register(formData).subscribe({
      next: (data) => {
        this.router.navigate(['login']);
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
  get password() {
    return this.form?.get('password');
  }
  get confirmedPassword() {
    return this.form?.get('confirmedPassword');
  }
  get name() {
    return this.form?.get('name');
  }
  get lastName() {
    return this.form?.get('lastName');
  }
  get email(){
    return this.form?.get('email');
  }
  onFileSelected(event:any) {
    this.selectedFile = event.target.files[0];
  }
}
