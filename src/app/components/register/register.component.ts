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
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required,Validators.email],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmedPassword: ['', Validators.required],
      },
      { validator: PasswordValidators.passwordsShouldMatch }
    );
    console.log(this.form);

  }

  // convenience getter for easy access to form fields
  get f(): any {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.authservice.register(this.form.value).subscribe({
      next: (data) => {
        this.router.navigate(['login']);
      },
      error: (err) => {
        this.loading = false;
        console.log(err.error);
        this.form.setErrors({
          invalidInputs: { message: err.error },
        });
      },
    });
  }
  get password() {
    return this.form.get('password');
  }
  get confirmedPassword() {
    return this.form.get('confirmedPassword');
  }
  get firstName() {
    return this.form.get('firstName');
  }
  get lastName() {
    return this.form.get('lastName');
  }
  get email(){
    return this.form.get('email');
  }
}
