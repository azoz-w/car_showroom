package com.challenge.showrooms.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowroomResDto {
    private String name;

    private BigDecimal commercialRegistrationNumber; // Changed to String for initial input

    private String managerName;

    private BigDecimal contactNumber; // Changed to String for initial input

    private String address;
}
