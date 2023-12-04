import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { ProfileUser } from '../models/user.profile';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  user$: Observable<ProfileUser | null>;
  constructor(private authservice:AuthenticationService, private router:Router, public userService:UserService) { 
    this.user$ = this.userService.currentUserProfile$;
  }
  
  logout(){
    if (window.confirm('Are you sure you want to logout?')) {
      this.authservice.logout().subscribe(()=>{
        this.router.navigate(['login']);
      });
    }
}}
