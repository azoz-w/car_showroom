package com.challenge.showrooms.service;

import com.challenge.showrooms.dto.request.CreateShowroom_req_dto;
import com.challenge.showrooms.dto.response.CreateShowroom_res_dto;
import com.challenge.showrooms.entity.Showroom;
import com.challenge.showrooms.repository.ShowroomRepository;
import com.challenge.showrooms.service.util.ShowroomUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ShowroomService {

    @Autowired
    private ShowroomRepository showroomRepository;

    private ShowroomUtil showroomUtil;

    public CreateShowroom_res_dto createShowroom(CreateShowroom_req_dto request) {
        //TODO: add validation for unique elements,
        Showroom showroom = Showroom.builder()
                .name(request.getName())
                .commercialRegistrationNumber(new BigDecimal(request.getCommercialRegistrationNumber()))
                .managerName(request.getManagerName())
                .contactNumber(new BigDecimal(request.getContactNumber()))
                .address(request.getAddress())
                .build();
        return mapToDetailResponse(showroomRepository.save(showroom));
    }
    public CreateShowroom_res_dto mapToDetailResponse(Showroom showroom) {
        CreateShowroom_res_dto response = new CreateShowroom_res_dto();
        response.setName(showroom.getName());
        response.setCommercialRegistrationNumber(showroom.getCommercialRegistrationNumber());
        response.setManagerName(showroom.getManagerName());
        response.setContactNumber(showroom.getContactNumber());
        response.setAddress(showroom.getAddress());
        return response;
    }
}
