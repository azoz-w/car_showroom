package com.challenge.showrooms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarListResDto {
    private String vin;
    private String maker;
    private String model;
    private BigDecimal modelYear;
    private BigDecimal price; // price
    private String carShowroomName;
    private BigDecimal contactNumber;
}
