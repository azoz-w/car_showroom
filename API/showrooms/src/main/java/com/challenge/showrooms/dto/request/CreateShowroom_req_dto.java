package com.challenge.showrooms.dto.request;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateShowroom_req_dto {
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotNull(message = "Commercial registration number is required")
    @Digits(integer = 10, fraction = 0, message = "Commercial registration number must be exactly 10 digits")
    private String commercialRegistrationNumber; // Changed to String for initial input

    @Size(max = 100, message = "Manager name must not exceed 100 characters")
    private String managerName;

    @NotNull(message = "Contact number is required")
    @Digits(integer = 15, fraction = 0, message = "Contact number must not exceed 15 digits")
    private String contactNumber; // Changed to String for initial input

    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;
}
