import { Component, OnInit } from '@angular/core';
import { Showroom } from '../../core/models/showroom.model';
import { ShowroomService } from '../../core/services/showroom.service';
import { ModalComponent } from '../../core/components/modal/modal.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateShowroomComponent } from '../../core/components/create-showroom-component/create-showroom.component';
import { ToastService } from '../../core/services/toast.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-showroom-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
    CreateShowroomComponent,
    RouterModule,
  ],
  templateUrl: './showroom-management.component.html',
  styleUrl: './showroom-management.component.css',
})
export class ShowroomManagementComponent implements OnInit {
  showrooms: Showroom[] = [];
  isModalOpen: boolean = false;
  selectedShowroom: Showroom | null = null;
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  sortField = 'name';
  sortDirection = 'asc';
  editForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    readonly showroomService: ShowroomService,
    private toastService: ToastService
  ) {
    this.editForm = this.fb.group({
      contactNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{1,15}$')],
      ],
      managerName: ['', [Validators.maxLength(100)]],
      address: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
    console.log('showrooms loaded');

    this.loadShowrooms();
  }

  loadShowrooms() {
    this.showroomService
      .getShowrooms(
        this.currentPage,
        this.pageSize,
        this.sortField,
        this.sortDirection
      )
      .subscribe((response) => {
        this.showrooms = response.content;
        this.totalPages = response.totalPages;
      });
  }
  resetForm() {
    if (this.selectedShowroom) {
      this.editForm.patchValue({
        contactNumber: this.selectedShowroom.contactNumber,
        managerName: this.selectedShowroom.managerName || '',
        address: this.selectedShowroom.address || '',
      });
    }
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadShowrooms();
  }
  changeSize(newSize: string | number | any) {
    console.log(newSize);

    this.pageSize = newSize;
    this.currentPage = 0; // Reset to first page when changing size
    this.loadShowrooms();
  }
  sort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.loadShowrooms();
  }
  deleteShowroom(showroom: Showroom) {
    this.showroomService
      .deleteShowroom(showroom.commercialRegistrationNumber)
      .subscribe({
        next: () => {
          // this.closeModal();
          this.toastService.show('Showroom created successfully', 'success');
          // this.created.emit();
        },
        error: () => {
          // this.isSubmitting = false;
          // Error will be handled by interceptor
        },
        complete: () => {
          this.loadShowrooms();
        },
      });
    this.showroomService
      .deleteShowroom(showroom.commercialRegistrationNumber)
      .subscribe((response) => {});
    this.loadShowrooms();
  }
  viewDetails(showroom: Showroom) {
    this.selectedShowroom = showroom;
    //router to the showroom details page,
  }
  editDetails(showroom: Showroom) {
    this.selectedShowroom = showroom;
    //open the modal
    this.toggleModal();
  }
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
    if (!this.isModalOpen) {
      this.selectedShowroom = null;
      this.editForm.reset();
    }
  }
  isFieldInvalid(fieldName: string): boolean {
    const field = this.editForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
  onSubmit() {
    if (this.editForm.valid && this.selectedShowroom) {
      this.isSubmitting = true;
      this.showroomService
        .updateShowroom(
          this.selectedShowroom.commercialRegistrationNumber,
          this.editForm.value
        )
        .subscribe({
          next: () => {
            this.toastService.show('Showroom updated successfully', 'success');
            this.toggleModal();
            this.loadShowrooms();
          },
          error: () => {
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          },
        });
    } else {
      Object.keys(this.editForm.controls).forEach((key) => {
        const control = this.editForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
