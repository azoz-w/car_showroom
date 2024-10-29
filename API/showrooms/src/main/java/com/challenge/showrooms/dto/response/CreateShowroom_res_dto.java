package com.challenge.showrooms.dto.response;


import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateShowroom_res_dto {
    private String name;

    private BigDecimal commercialRegistrationNumber; // Changed to String for initial input

    private String managerName;

    private BigDecimal contactNumber; // Changed to String for initial input

    private String address;
}
