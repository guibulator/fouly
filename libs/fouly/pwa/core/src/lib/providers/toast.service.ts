import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { from } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toastController: ToastController) {}

  show(message: string) {
    from(
      this.toastController.create({
        message: message,
        duration: 3000,
        color: 'tertiary',
        position: 'middle'
      })
    ).subscribe((toast) => toast.present());
  }
}
