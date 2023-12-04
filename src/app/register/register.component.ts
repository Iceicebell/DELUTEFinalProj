import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { passwordMatchValidator } from '../shared/password-match.directive';
import { UserService } from '../services/user.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm= new FormGroup({
    username:new FormControl('', Validators.required),
    email:new FormControl('',[Validators.required, Validators.email]),
    password:new FormControl('', Validators.required),
    confirmpassword:new FormControl('', Validators.required)
  },
  {
    validators:passwordMatchValidator
  })
  constructor(private fb:FormBuilder, private authservice:AuthenticationService, private router:Router, private userService:UserService){}

  get username(){
    return this.registerForm.get('username');
  }
  get email(){
    return this.registerForm.get('email');
  }
  get password(){
    return this.registerForm.get('password');
  }
  get confirmpassword(){
    return this.registerForm.get('confirmpassword');
  }

submit() {
  const { username, email, password } = this.registerForm.value;

  if (!this.registerForm.valid || !username || !password || !email) {
    return;
  }

  this.authservice
    .signUp(email, password)
    .pipe(
      switchMap(({ user: { uid } }) =>
        this.userService.addUser({ uid, email, username })
      )
    )
    .subscribe(() => {
      this.router.navigate(['/login']);
      alert('Congrats! You are all signed up');
    }, error => {
      alert(error.message);
    });
}
}
