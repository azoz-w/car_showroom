import { Component, OnInit } from '@angular/core';
import { Showroom } from '../../core/models/showroom.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ShowroomService } from '../../core/services/showroom.service';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { Car } from '../../core/models/car.model';
import { CarService } from '../../core/services/car.service';

@Component({
  selector: 'app-showroom-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.editForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
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
        this.sortDirection,
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
  openAddCarModal() {
    // Implement add car modal
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
  // sort(field: string) {
  //   if (this.sortField === field) {
  //     this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  //   } else {
  //     this.sortField = field;
  //     this.sortDirection = 'asc';
  //   }
  //   this.loadCars();
  // }
}
