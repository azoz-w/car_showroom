package com.challenge.showrooms.service.util;

import com.challenge.showrooms.dto.response.CreateShowroom_res_dto;
import com.challenge.showrooms.entity.Showroom;

public class ShowroomUtil {
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
