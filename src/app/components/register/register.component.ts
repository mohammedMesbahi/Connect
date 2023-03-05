import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    form!: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authservice:AuthService
        /* private accountService: AccountService,
        private alertService: AlertService */
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f(): any { return this.form.controls; }

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
                    invalidInputs: { message: err.error }
                })
            }
        })
    }
}
