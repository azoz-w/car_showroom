package com.challenge.showrooms.service;

import com.challenge.showrooms.criteria.CarSpecifications;
import com.challenge.showrooms.dto.CarSearchCriteria;
import com.challenge.showrooms.dto.request.CreateCarReqDto;
import com.challenge.showrooms.dto.response.CarListResDto;
import com.challenge.showrooms.dto.response.CarResDto;
import com.challenge.showrooms.entity.Car;
import com.challenge.showrooms.entity.Showroom;
import com.challenge.showrooms.exception.DuplicateResourceException;
import com.challenge.showrooms.exception.ResourceNotFoundException;
import com.challenge.showrooms.repository.CarRepository;
import com.challenge.showrooms.repository.ShowroomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Transactional
@RequiredArgsConstructor
public class CarService {
    @Autowired
    private CarRepository carRepository;
    @Autowired
    private ShowroomRepository showroomRepository;

    public CarResDto createCar(BigDecimal commercialRegistrationNumber, CreateCarReqDto request) {
        // Find showroom first
        Showroom showroom = showroomRepository.findByCommercialRegistrationNumberAndDeletedFalse(commercialRegistrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Showroom not found with commercial registration number: " + commercialRegistrationNumber));

        // Check if VIN is unique
        if (carRepository.existsByVinAndDeletedFalse(request.getVin())) {
            throw new DuplicateResourceException("Car with VIN " + request.getVin() + " already exists");
        }

        // Create and save the car
        Car car = Car.builder()
                .vin(request.getVin())
                .maker(request.getMaker())
                .model(request.getModel())
                .modelYear(request.getModelYear())
                .price(request.getPrice())
                .showroom(showroom)
                .build();

        Car savedCar = carRepository.save(car);

        return mapToResponse(savedCar);
    }

    public Page<CarListResDto> findAllWithFilters(
            BigDecimal commercialRegistrationNumber,
            CarSearchCriteria criteria,
            Pageable pageable) {

        // Verify showroom exists
        if (!showroomRepository.existsByCommercialRegistrationNumberAndDeletedFalse(commercialRegistrationNumber)) {
            throw new ResourceNotFoundException("Showroom not found with registration number: " + commercialRegistrationNumber);
        }

        Page<Car> cars = carRepository.findAll(
                CarSpecifications.withFilters(commercialRegistrationNumber, criteria),
                pageable
        );

        return cars.map(car -> CarListResDto.builder()
                .vin(car.getVin())
                .maker(car.getMaker())
                .model(car.getModel())
                .modelYear(car.getModelYear())
                .price(car.getPrice())
                .carShowroomName(car.getShowroom().getName())
                .contactNumber(car.getShowroom().getContactNumber())
                .build());
    }

    private CarListResDto mapToListResponse(Car car) {
        return CarListResDto.builder()
                .vin(car.getVin())
                .maker(car.getMaker())
                .model(car.getModel())
                .modelYear(car.getModelYear())
                .price(car.getPrice())
                .carShowroomName(car.getShowroom().getName())
                .contactNumber(car.getShowroom().getContactNumber())
                .build();
    }

    private CarResDto mapToResponse(Car car) {
        return CarResDto.builder()
                .vin(car.getVin())
                .maker(car.getMaker())
                .model(car.getModel())
                .modelYear(car.getModelYear())
                .price(car.getPrice())
                .showroomName(car.getShowroom().getName())
                .build();
    }
}
