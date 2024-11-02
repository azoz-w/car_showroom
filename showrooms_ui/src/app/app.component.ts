import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'showrooms_ui';
  isLoggedIn: boolean = false;
  constructor(private router: Router, private authSerivce: AuthService) {
    this.authSerivce.isAuthenticated().subscribe({
      next: (val) => {
        this.isLoggedIn = val;
      },
    });
  }
  logout() {
    this.authSerivce.logout();
    this.router.navigate(['/login']);
  }
}
