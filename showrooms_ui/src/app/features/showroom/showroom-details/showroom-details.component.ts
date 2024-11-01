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
  FormControl,
} from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { Car } from '../../../core/models/car.model';
import { CarService } from '../../../core/services/car.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import {
  debounceTime,
  distinctUntilChanged,
  merge,
  Subject,
  takeUntil,
} from 'rxjs';
import { CarSearchCriteria } from '../../../core/models/car.criteria.model';

@Component({
  selector: 'app-showroom-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ModalComponent],
  templateUrl: './showroom-details.component.html',
  styleUrl: './showroom-details.component.css',
})
export class ShowroomDetailsComponent implements OnInit {
  showroom: Showroom | null = null;
  commercialRegistrationNumber: string = '';
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
  searchForm: FormGroup;
  searchDebouncer = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private showroomService: ShowroomService,
    private carService: CarService,
    private toastService: ToastService
  ) {
    this.searchForm = this.fb.group({
      vin: new FormControl(''),
      maker: new FormControl(''),
      model: new FormControl(''),
      modelYear: new FormControl(''),
      minPrice: new FormControl(''),
      maxPrice: new FormControl(''),
    });
    // Setup search debouncing
    this.searchDebouncer
      .pipe(debounceTime(1), distinctUntilChanged())
      .subscribe(() => {
        console.log('debouncing');
        this.currentPage = 0; // Reset to first page on new search
        this.loadCars(this.commercialRegistrationNumber);
      });

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
        this.commercialRegistrationNumber = commercialRegistrationNumber;
        this.loadShowroomDetails(commercialRegistrationNumber);
        this.loadCars(commercialRegistrationNumber); // Load cars after loading showroom details
      }
    });
    // Subscribe to form changes
    this.vinControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.onSearchChange());

    this.makerControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.onSearchChange());

    this.modelControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.onSearchChange());

    this.modelYearControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.onSearchChange());

    this.minPriceControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.onSearchChange());

    this.maxPriceControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.onSearchChange());
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
  loadCars(commercialRegistrationNumber: string) {
    // if (!this.showroom) return;

    this.isLoading = true;
    const criteria: CarSearchCriteria = this.getValidSearchCriteria();

    this.carService
      .getShowroomCars(
        commercialRegistrationNumber,
        this.currentPage,
        this.pageSize,
        this.searchTerm,
        this.sortDirection,
        criteria
      )
      .subscribe({
        next: (response) => {
          console.log(
            'is it the last page,:' + (this.currentPage === this.totalPages - 1)
          );

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
    this.loadCars(this.showroom?.commercialRegistrationNumber ?? '');
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadCars(this.showroom?.commercialRegistrationNumber ?? '');
  }
  changeSize(newSize: string | number | any) {
    console.log(newSize);

    this.pageSize = newSize;
    this.currentPage = 0; // Reset to first page when changing size
    this.loadCars(this.showroom?.commercialRegistrationNumber ?? '');
  }
  onSearchChange() {
    this.currentPage = 0; // Reset to first page
    this.loadCars(this.commercialRegistrationNumber);
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
            this.loadCars(this.showroom?.commercialRegistrationNumber ?? ''); // Refresh the cars list
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
  isAnyFilterActive(): boolean {
    const formValue = this.searchForm.value;
    return Object.values(formValue).some(
      (value) => value !== null && value !== '' && value !== undefined
    );
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
  getValidSearchCriteria(): CarSearchCriteria {
    const formValue = this.searchForm.value;
    const criteria: CarSearchCriteria = {};

    // Only add non-empty values
    if (formValue.vin?.trim()) criteria.vin = formValue.vin.trim();
    if (formValue.maker?.trim()) criteria.maker = formValue.maker.trim();
    if (formValue.model?.trim()) criteria.model = formValue.model.trim();
    if (formValue.modelYear) criteria.modelYear = Number(formValue.modelYear);
    if (formValue.minPrice) criteria.minPrice = Number(formValue.minPrice);
    if (formValue.maxPrice) criteria.maxPrice = Number(formValue.maxPrice);

    return criteria;
  }
  clearFilters() {
    this.searchForm.reset();
    this.currentPage = 0;
    this.loadCars(this.commercialRegistrationNumber);
  }
  // Helper getters for form controls
  get vinControl() {
    return this.searchForm.get('vin') as FormControl;
  }
  get makerControl() {
    return this.searchForm.get('maker') as FormControl;
  }
  get modelControl() {
    return this.searchForm.get('model') as FormControl;
  }
  get modelYearControl() {
    return this.searchForm.get('modelYear') as FormControl;
  }
  get minPriceControl() {
    return this.searchForm.get('minPrice') as FormControl;
  }
  get maxPriceControl() {
    return this.searchForm.get('maxPrice') as FormControl;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
