package com.challenge.showrooms.controller;

import com.challenge.showrooms.dto.CarSearchCriteria;
import com.challenge.showrooms.dto.error.ErrorResponse;
import com.challenge.showrooms.dto.error.ValidationErrorResponse;
import com.challenge.showrooms.dto.request.CreateCarReqDto;
import com.challenge.showrooms.dto.response.CarListResDto;
import com.challenge.showrooms.dto.response.CarResDto;
import com.challenge.showrooms.dto.response.ListShowroomsPaginatedReqDto;
import com.challenge.showrooms.dto.response.ShowroomResDto;
import com.challenge.showrooms.service.CarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/car")
@RequiredArgsConstructor
public class CarController {
    @Autowired
    private CarService carService;

    @Operation(
            summary = "create a new cars",
            description = "Creates a new car with the provided details"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Successfully created car",
                    content = @Content(schema = @Schema(implementation = CarResDto.class))
            ), @ApiResponse(
            responseCode = "400",
            description = "Invalid input",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
    ),
            @ApiResponse(
                    responseCode = "409",
                    description = "car with given vin number number already exists",
                    content = @Content(schema = @Schema(implementation = ValidationErrorResponse.class))
            )
    })
    @PostMapping("/{commercialRegistrationNumber}")
    public CarResDto createCar(
            @PathVariable BigDecimal commercialRegistrationNumber,
            @Valid @RequestBody CreateCarReqDto request) {
        return carService.createCar(commercialRegistrationNumber, request);
    }

    @Operation(
            summary = "List all cars",
            description = "Returns a paginated list of cars with optional filtering"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved list of cars",
                    content = @Content(schema = @Schema(implementation = Page.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "unexpected error occurred",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
    })
    @GetMapping
    public Page<CarListResDto> listCars(
            @RequestParam(required = false) String vin,
            @RequestParam(required = false) String maker,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) BigDecimal modelYear,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String showroomName,
            @RequestParam(required = false) BigDecimal contactNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "maker") String sort,
            @RequestParam(defaultValue = "asc") String direction) {

        CarSearchCriteria criteria = new CarSearchCriteria();
        criteria.setVin(vin);
        criteria.setMaker(maker);
        criteria.setModel(model);
        criteria.setModelYear(modelYear);
        criteria.setMinPrice(minPrice);
        criteria.setMaxPrice(maxPrice);
        criteria.setShowroomName(showroomName);
        criteria.setContactNumber(contactNumber);
        PageRequest pageRequest = PageRequest.of(
                page,
                size,
                Sort.Direction.fromString(direction),
                sort
        );

        return carService.findAllWithFilters(criteria, pageRequest);
    }
}