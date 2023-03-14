import { AbstractControl, ValidationErrors } from "@angular/forms";

export class PasswordValidators {
    static doesMatchOldPassword(contorl: AbstractControl): Promise<ValidationErrors | null> {
        return new Promise((resolve, reject) => {
            setInterval(() => {
                if (contorl.value == "1234")
                    resolve(null)
                else {
                    resolve({ invalidOldPassword: true })
                }
            }, 2000)
        })
    }
    static passwordsShouldMatch(contorl: AbstractControl): ValidationErrors | null {
        let newPassword = contorl.get("password");
        let confirmedPassword = contorl.get('confirmedPassword');
        if (newPassword?.value == confirmedPassword?.value)
            return null;
        return { passwordsShouldMatch: true }
    }
}
