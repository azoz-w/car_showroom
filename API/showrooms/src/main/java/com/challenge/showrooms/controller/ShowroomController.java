package com.challenge.showrooms.controller;

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

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/showrooms")
@RequiredArgsConstructor
public class ShowroomController {

    @Autowired
    private ShowroomService showroomService;

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ShowroomResDto createShowroom(
            @Valid @RequestBody CreateShowroomReqDto request) {
        return this.showroomService.createShowroom(request);
    }

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
    @GetMapping("/{commercialRegistrationNumber}")
    @ResponseStatus(HttpStatus.OK)
    public ShowroomResDto getShowroom(@PathVariable BigDecimal commercialRegistrationNumber) {
        return showroomService.getShowroom(commercialRegistrationNumber);
    }
    @PatchMapping("/{commercialRegistrationNumber}")
    @ResponseStatus(HttpStatus.OK)
    public ShowroomResDto updateShowroom(
            @PathVariable BigDecimal commercialRegistrationNumber,
            @Valid @RequestBody UpdateShowroomReqDto request) {
        return showroomService.updateShowroom(commercialRegistrationNumber, request);
    }
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
