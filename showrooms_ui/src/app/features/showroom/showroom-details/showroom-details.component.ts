import { Component, OnInit } from '@angular/core';
import { Showroom } from '../../../core/models/showroom.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ShowroomService } from '../../../core/services/showroom.service';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { Car } from '../../../core/models/car.model';
import { CarService } from '../../../core/services/car.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-showroom-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ModalComponent],
  templateUrl: './showroom-details.component.html',
  styleUrl: './showroom-details.component.css',
})
export class ShowroomDetailsComponent implements OnInit {
  showroom: Showroom | null = null;
  isEditing = false;
  isSubmitting = false;
  editForm: FormGroup;
  // Cars list properties
  cars: Car[] = [];
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalItems = 0;
  sortDirection = 'asc';
  searchTerm = '';
  isLoading = false;
  isAddCarModalOpen = false;
  addCarForm: FormGroup;
  isSubmittingCar = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private showroomService: ShowroomService,
    private carService: CarService,
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
    this.addCarForm = this.fb.group({
      vin: ['', [Validators.required, Validators.maxLength(25)]],
      maker: ['', [Validators.required, Validators.maxLength(25)]],
      model: ['', [Validators.required, Validators.maxLength(25)]],
      modelYear: ['', [Validators.required, Validators.pattern('^\\d{4}$')]],
      price: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern('^\\d{1,8}(\\.\\d{1,2})?$'),
        ],
      ],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const commercialRegistrationNumber =
        params['commercialRegistrationNumber'];
      if (commercialRegistrationNumber) {
        this.loadShowroomDetails(commercialRegistrationNumber);
        this.loadCars(); // Load cars after loading showroom details
      }
    });
  }

  loadShowroomDetails(commercialRegistrationNumber: string) {
    this.showroomService.getShowroom(commercialRegistrationNumber).subscribe({
      next: (showroom) => {
        this.showroom = showroom;
        this.resetForm();
      },
      error: () => {
        this.router.navigate(['/showrooms']);
      },
    });
  }

  resetForm() {
    if (this.showroom) {
      this.editForm.patchValue({
        contactNumber: this.showroom.contactNumber,
        managerName: this.showroom.managerName || '',
        address: this.showroom.address || '',
      });
    }
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.resetForm();
    }
  }

  onSubmit() {
    if (this.editForm.valid && this.showroom) {
      this.isSubmitting = true;
      this.showroomService
        .updateShowroom(
          this.showroom.commercialRegistrationNumber,
          this.editForm.value
        )
        .subscribe({
          next: (updatedShowroom) => {
            this.showroom = updatedShowroom;
            this.isEditing = false;
            this.isSubmitting = false;
            this.toastService.show('Showroom updated successfully', 'success');
          },
          error: () => {
            this.isSubmitting = false;
          },
        });
    }
  }

  goBack() {
    this.router.navigate(['/showrooms']);
  }
  loadCars() {
    // if (!this.showroom) return;

    this.isLoading = true;
    this.carService
      .getShowroomCars(
        // this.showroom.commercialRegistrationNumber,
        this.currentPage,
        this.pageSize,
        this.searchTerm,
        this.sortDirection
        // this.searchTerm
      )
      .subscribe({
        next: (response) => {
          this.cars = response.content;
          this.totalPages = response.totalPages;
          this.totalItems = response.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  onSearch() {
    this.currentPage = 0;
    this.loadCars();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadCars();
  }
  changeSize(newSize: string | number | any) {
    console.log(newSize);

    this.pageSize = newSize;
    this.currentPage = 0; // Reset to first page when changing size
    this.loadCars();
  }

  // Add these methods
  openAddCarModal() {
    this.addCarForm.reset();
    this.isAddCarModalOpen = true;
  }

  closeAddCarModal() {
    this.isAddCarModalOpen = false;
  }

  onAddCarSubmit() {
    if (this.addCarForm.valid && this.showroom) {
      this.isSubmittingCar = true;
      const carData = {
        ...this.addCarForm.value,
        showroomId: this.showroom.commercialRegistrationNumber,
      };

      this.carService
        .createCar(this.showroom.commercialRegistrationNumber, carData)
        .subscribe({
          next: () => {
            this.toastService.show('Car added successfully', 'success');
            this.closeAddCarModal();
            this.loadCars(); // Refresh the cars list
          },
          error: () => {
            this.isSubmittingCar = false;
          },
          complete: () => {
            this.isSubmittingCar = false;
          },
        });
    } else {
      Object.keys(this.addCarForm.controls).forEach((key) => {
        const control = this.addCarForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
  isPriceValid(): string | null {
    const control = this.addCarForm.get('price');
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Price is required';
      }
      if (control.errors['min']) {
        return 'Price must be positive';
      }
      if (control.errors['pattern']) {
        return 'Price must have at most 8 digits before decimal and 2 after';
      }
    }
    return null;
  }
}
