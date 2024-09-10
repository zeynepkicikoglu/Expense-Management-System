// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { SignInService } from './sign-in.service';

// @Component({
//   selector: 'app-sign-in',
//   templateUrl: './sign-in.component.html',
//   styleUrls: ['./sign-in.component.css'],
// })
// export class SignInComponent {
//   personId: string = '';
//   password: string = '';
//   loginResult: any;
//   isLoading: boolean = false;
//   isUserInvalid: boolean = false;

//   constructor(private router: Router, private signService: SignInService) {}

//   onSubmit() {
//     this.isLoading = true;
//     this.signService.getToken().subscribe(() => {
//       this.signService.login(this.personId, this.password).subscribe(
//         (result) => {
//           this.isLoading = false;
//           this.loginResult = result;
//           if (this.loginResult.Success) {
//             this.isUserInvalid = false;
//             this.router.navigate(['/expense-list']);
//           } else {
//             this.isUserInvalid = true;
//           }
//         },
//         (error) => {
//           this.isLoading = false;
//           console.error('Login error', error);
//           alert('Bir hata oluştu, lütfen tekrar deneyin.');
//         }
//       );
//     });
//   }
// }
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignInService } from './sign-in.service';
import { AuthService } from '../auth/auth.service';
import { Person } from '../auth/auth.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  personId: string = '';
  password: string = '';
  loginResult: any;
  isLoading: boolean = false;
  isUserInvalid: boolean = false;

  constructor(
    private router: Router,
    private signService: SignInService,
    private cookieManager: AuthService
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.signService.getToken().subscribe(
      () => {
        this.signService.login(this.personId, this.password).subscribe(
          (result) => {
            this.isLoading = false;
            this.loginResult = result;
            if (this.loginResult.success) {
              this.isUserInvalid = false;

              const person: Person = {
                Id: this.loginResult.userId,
                Name: this.loginResult.personName,
              };
              this.cookieManager.setPerson(person);

              this.router.navigate(['/expense-list']);
            } else {
              this.isUserInvalid = true;
              this.cookieManager.removeTokenFromCookie();
            }
          },
          (error) => {
            this.isLoading = false;
            console.error('Login error', error);
            alert('Bir hata oluştu, lütfen tekrar deneyin.');
          }
        );
      },
      (error) => {
        this.isLoading = false;
        console.error('Token fetch error', error);
        alert('Token alınırken bir hata oluştu.');
      }
    );
  }
}
