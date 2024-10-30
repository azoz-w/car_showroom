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
public class CarResDto {
    private String vin;
    private String maker;
    private String model;
    private BigDecimal modelYear;
    private BigDecimal price;
    private String showroomName;
}
