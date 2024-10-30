package com.challenge.showrooms.service.util;

import com.challenge.showrooms.dto.response.ShowroomResDto;
import com.challenge.showrooms.entity.Showroom;

public class ShowroomUtil {
    public ShowroomResDto mapToDetailResponse(Showroom showroom) {
        ShowroomResDto response = new ShowroomResDto();
        response.setName(showroom.getName());
        response.setCommercialRegistrationNumber(showroom.getCommercialRegistrationNumber());
        response.setManagerName(showroom.getManagerName());
        response.setContactNumber(showroom.getContactNumber());
        response.setAddress(showroom.getAddress());
        return response;
    }
}
