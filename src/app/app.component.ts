import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { User } from './shared/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'RS6_JS_P2';
  user!: User;

  constructor(
    private router: Router,
    private authService: AuthService) {

    router.events.subscribe((event: Event) => {

      if (event instanceof NavigationStart) {
        console.log("Navigation started...");
      }
      if (event instanceof NavigationEnd) {
        console.log("Navigation ended...");
      }
      if (event instanceof NavigationError) {
        console.log("Navigation error: ", event.error);
      }
    });

  }

}