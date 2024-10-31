import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ShowroomService } from '../../services/showroom.service';
import { ModalComponent } from '../modal/modal.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-create-showroom',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './create-showroom.component.html',
  styleUrl: './create-showroom.component.css',
})
export class CreateShowroomComponent {
  form: FormGroup;
  isModalOpen = false;
  isSubmitting = false;
  @Output() created = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private showroomService: ShowroomService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      commercialRegistrationNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      contactNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{1,15}$')],
      ],
      managerName: ['', [Validators.maxLength(100)]],
      address: ['', [Validators.maxLength(255)]],
    });
  }

  openModal() {
    this.form.reset();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.form.valid) {
      this.isSubmitting = true;
      this.showroomService.createShowroom(this.form.value).subscribe({
        next: () => {
          this.closeModal();
          this.toastService.show('Showroom created successfully', 'success');
          this.created.emit();
        },
        error: () => {
          this.isSubmitting = false;
          // Error will be handled by interceptor
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      this.markFormGroupTouched(this.form);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
