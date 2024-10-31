import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../models/Toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toasts.asObservable();

  show(message: string, type: Toast['type'] = 'info', duration = 5000) {
    const id = Date.now();
    const toast: Toast = { id, message, type };

    this.toasts.next([...this.toasts.value, toast]);

    if (duration > 0) {
      setTimeout(() => this.removeToast(id), duration);
    }

    return id;
  }

  removeToast(id: number) {
    this.toasts.next(this.toasts.value.filter((t) => t.id !== id));
  }
}
