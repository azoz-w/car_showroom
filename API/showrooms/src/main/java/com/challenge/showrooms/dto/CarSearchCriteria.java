package com.challenge.showrooms.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CarSearchCriteria {
    private String vin;
    private String maker;
    private String model;
    private BigDecimal modelYear;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String showroomName;
    private BigDecimal contactNumber;
}