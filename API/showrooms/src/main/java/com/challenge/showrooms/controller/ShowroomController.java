package com.challenge.showrooms.controller;

import com.challenge.showrooms.dto.error.ErrorResponse;
import com.challenge.showrooms.dto.error.ValidationErrorResponse;
import com.challenge.showrooms.dto.request.CreateShowroomReqDto;
import com.challenge.showrooms.dto.request.UpdateShowroomReqDto;
import com.challenge.showrooms.dto.response.ShowroomResDto;
import com.challenge.showrooms.dto.response.ListShowroomsPaginatedReqDto;
import com.challenge.showrooms.service.ShowroomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.math.BigDecimal;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/showroom")
@RequiredArgsConstructor
@Tag(name = "Showroom", description = "Showroom management APIs")
public class ShowroomController {

    @Autowired
    private ShowroomService showroomService;

    @Operation(
            summary = "Create a new showroom",
            description = "Creates a new showroom with the provided details"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Showroom created successfully",
                    content = @Content(schema = @Schema(implementation = ShowroomResDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Showroom with given commercial registration number already exists",
                    content = @Content(schema = @Schema(implementation = ValidationErrorResponse.class))
            )
    })
    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ShowroomResDto createShowroom(
            @Valid @RequestBody CreateShowroomReqDto request) {
        return this.showroomService.createShowroom(request);
    }

    @Operation(
            summary = "List all showrooms",
            description = "Returns a paginated list of showrooms with optional filtering"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved list of showrooms",
                    content = @Content(schema = @Schema(implementation = Page.class))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "unexpected error occurred",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
    })
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<ListShowroomsPaginatedReqDto> listShowrooms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sort,
            @RequestParam(defaultValue = "asc") String direction) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.Direction.fromString(direction),
                sort
        );

        return showroomService.listShowrooms(pageable);
    }

    @Operation(
            summary = "Get specific showroom",
            description = "Returns specific showroom details with selected commercialRegistrationNumber"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved showroom",
                    content = @Content(schema = @Schema(implementation = ShowroomResDto.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Showroom not found with commercialRegistrationNumber",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))

            )
    })
    @GetMapping("/{commercialRegistrationNumber}")
    @ResponseStatus(HttpStatus.OK)
    public ShowroomResDto getShowroom(@PathVariable BigDecimal commercialRegistrationNumber) {
        return showroomService.getShowroom(commercialRegistrationNumber);
    }

    @Operation(
            summary = "update showroom details",
            description = "updated showroom details (managerName, contactNumber, address)"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully Updated showroom",
                    content = @Content(schema = @Schema(implementation = ShowroomResDto.class))
            ), @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Showroom not found with commercialRegistrationNumber",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))

            )
    })
    @PatchMapping("/{commercialRegistrationNumber}")
    @ResponseStatus(HttpStatus.OK)
    public ShowroomResDto updateShowroom(
            @PathVariable BigDecimal commercialRegistrationNumber,
            @Valid @RequestBody UpdateShowroomReqDto request) {
        return showroomService.updateShowroom(commercialRegistrationNumber, request);
    }

    @Operation(
            summary = "delete showroom",
            description = "delete showroom"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "204",
                    description = "Successfully deleted showroom"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Showroom not found with commercialRegistrationNumber",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @DeleteMapping("/{commercialRegistrationNumber}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteShowroom(
            @PathVariable BigDecimal commercialRegistrationNumber) {
        showroomService.deleteShowroom(commercialRegistrationNumber);
    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<ShowroomDetailResponse> getShowroom(@PathVariable Long id) {
//        return ResponseEntity.ok(showroomService.getShowroom(id));
//    }
//
//    @PatchMapping("/{id}")
//    public ResponseEntity<ShowroomDetailResponse> updateShowroom(
//            @PathVariable Long id,
//            @Valid @RequestBody UpdateShowroomRequest request) {
//        return ResponseEntity.ok(showroomService.updateShowroom(id, request));
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteShowroom(@PathVariable Long id) {
//        showroomService.deleteShowroom(id);
//        return ResponseEntity.noContent().build();
//    }
//
//    @PostMapping("/{id}/cars")
//    public ResponseEntity<CarListResponse> addCarToShowroom(
//            @PathVariable Long id,
//            @Valid @RequestBody CreateCarRequest request) {
//        return ResponseEntity.status(HttpStatus.CREATED)
//                .body(showroomService.addCarToShowroom(id, request));
//    }
}
