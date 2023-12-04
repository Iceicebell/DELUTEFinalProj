import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginform=new FormGroup ({
    email:new FormControl('', [Validators.required, Validators.email]),
    password:new FormControl('', Validators.required)
  });
  constructor(private fb: FormBuilder, private authservice: AuthenticationService, private router:Router){}
  get email(){
    return this.loginform.get('email');
  }
  get password(){
    return this.loginform.get('password');
  }

  submit(){
    if(!this.loginform.valid){
      return;
    }
  
    const emailControl = this.loginform.get('email');
    const passwordControl = this.loginform.get('password');
  
    if (emailControl && passwordControl) {
      const email = emailControl.value;
      const password = passwordControl.value;
  
      if (email && password) {
        this.authservice.login(email, password).subscribe(() => {
          this.router.navigate(['post-list']);
          window.alert('Login successful!');
        },
        (error) => {
          window.alert('Login failed: ' + error.message);
        }
        );
      }
    }
  }
}
