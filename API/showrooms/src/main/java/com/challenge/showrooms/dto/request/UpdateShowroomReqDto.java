package com.challenge.showrooms.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateShowroomReqDto {
    @Size(max = 100, message = "Manager name must not exceed 100 characters")
    private String managerName;

    @Digits(integer = 15, fraction = 0, message = "Contact number must not exceed 15 digits")
    @Size(max = 15, message = "Commercial registration number must be exactly 10 digits")
    private String contactNumber; // Changed to String for initial input

    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;
}
