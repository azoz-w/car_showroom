package com.challenge.showrooms.controller;

import com.challenge.showrooms.dto.request.CreateShowroom_req_dto;
import com.challenge.showrooms.dto.response.CreateShowroom_res_dto;
import com.challenge.showrooms.service.ShowroomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/showrooms")
@RequiredArgsConstructor
public class ShowroomController {

    @Autowired
    private ShowroomService showroomService;

    @PostMapping()
    public ResponseEntity<CreateShowroom_res_dto> createShowroom(
            @Valid @RequestBody CreateShowroom_req_dto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(this.showroomService.createShowroom(request));
    }

    @GetMapping()
    public ResponseEntity<Page<?>> listShowrooms(Pageable pageable) {
        return ResponseEntity.ok(null);
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
