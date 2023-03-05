import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form!: FormGroup;
  loading = false;
  submitted = false;
  wrongCredintials:boolean = false
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authservice:AuthService,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['mesbahi@gmail.com', Validators.required],
      password: ['1234', Validators.required]
    });
    
  }
  
  // convenience getter for easy access to form fields
  get f():any { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.authservice.login(this.f.email.value,this.f.password.value).subscribe({
      next:() => {
        this.router.navigate(['feed']);
      },
      error:(err) => {
        this.loading = false;
        console.log(err.error);
        this.form.setErrors({
          invalidLoign:{message:err.error}
        })
      }
    })
  } 
}
