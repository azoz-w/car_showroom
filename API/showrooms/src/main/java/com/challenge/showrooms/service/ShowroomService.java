package com.challenge.showrooms.service;

import com.challenge.showrooms.dto.request.CreateShowroomReqDto;
import com.challenge.showrooms.dto.request.UpdateShowroomReqDto;
import com.challenge.showrooms.dto.response.ShowroomResDto;
import com.challenge.showrooms.dto.response.ListShowroomsPaginatedReqDto;
import com.challenge.showrooms.entity.Showroom;
import com.challenge.showrooms.exception.DuplicateResourceException;
import com.challenge.showrooms.exception.ResourceNotFoundException;
import com.challenge.showrooms.repository.ShowroomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ShowroomService {

    @Autowired
    private ShowroomRepository showroomRepository;

    public ShowroomResDto createShowroom(CreateShowroomReqDto request) {
        //TODO: add validation for unique elements,
        Showroom showroom = Showroom.builder()
                .name(request.getName())
                .commercialRegistrationNumber(new BigDecimal(request.getCommercialRegistrationNumber()))
                .managerName(request.getManagerName())
                .contactNumber(new BigDecimal(request.getContactNumber()))
                .address(request.getAddress())
                .build();
        //if CommercialRegistrationNumber exist throw conflict error
        if (showroomRepository.existsByCommercialRegistrationNumber(showroom.getCommercialRegistrationNumber()))
            throw new DuplicateResourceException(
                    String.format("Showroom with commercial registration number %s already exists",
                            request.getCommercialRegistrationNumber()));
        return mapToDetailResponse(showroomRepository.save(showroom));
    }

    public Page<ListShowroomsPaginatedReqDto> listShowrooms(Pageable pageable) {
        return showroomRepository.findByDeletedFalse(pageable).map(this::mapToListResponse);
    }

    public ShowroomResDto getShowroom(BigDecimal commercialRegistrationNumber) {
        return showroomRepository.findByCommercialRegistrationNumberAndDeletedFalse(commercialRegistrationNumber)
                .map(this::mapToDetailResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Showroom not found with commercialRegistrationNumber: " + commercialRegistrationNumber));
    }

    public ShowroomResDto updateShowroom(BigDecimal commercialRegistrationNumber, UpdateShowroomReqDto request) {
        Showroom showroom = showroomRepository.findByCommercialRegistrationNumberAndDeletedFalse(commercialRegistrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Showroom not found with commercialRegistrationNumber: " + commercialRegistrationNumber));

        // Only update provided fields
        if (request.getContactNumber() != null) {
            showroom.setContactNumber(new BigDecimal(request.getContactNumber()));
        }

        if (request.getManagerName() != null) {
            showroom.setManagerName(request.getManagerName());
        }

        if (request.getAddress() != null) {
            showroom.setAddress(request.getAddress());
        }

        return mapToDetailResponse(showroomRepository.save(showroom));
    }

    public ShowroomResDto deleteShowroom(BigDecimal commercialRegistrationNumber) {
        Showroom showroom = showroomRepository.findByCommercialRegistrationNumberAndDeletedFalse(commercialRegistrationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Showroom not found with id: " + commercialRegistrationNumber));
        showroom.setDeleted(true);
        return mapToDetailResponse(showroomRepository.save(showroom));
    }

    private ListShowroomsPaginatedReqDto mapToListResponse(Showroom showroom) {
        return ListShowroomsPaginatedReqDto.builder()
                .name(showroom.getName())
                .commercialRegistrationNumber(showroom.getCommercialRegistrationNumber())
                .contactNumber(showroom.getContactNumber())
                .build();
    }

    private ShowroomResDto mapToDetailResponse(Showroom showroom) {
        ShowroomResDto response = new ShowroomResDto();
        response.setName(showroom.getName());
        response.setCommercialRegistrationNumber(showroom.getCommercialRegistrationNumber());
        response.setManagerName(showroom.getManagerName());
        response.setContactNumber(showroom.getContactNumber());
        response.setAddress(showroom.getAddress());
        return response;
    }
}
