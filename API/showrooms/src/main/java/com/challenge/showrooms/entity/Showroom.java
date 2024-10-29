package com.challenge.showrooms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "showrooms")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Showroom extends BaseEntity {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    @Column(nullable = false, length = 100)
    private String name;

    @NotNull(message = "Commercial registration number is required")
    @Digits(integer = 10, fraction = 0, message = "Commercial registration number must be exactly 10 digits")
    @Column(name = "commercial_registration_number", nullable = false, precision = 10, scale = 0, unique = true)
    private BigDecimal commercialRegistrationNumber;

    @Size(max = 100, message = "Manager name must not exceed 100 characters")
    @Column(name = "manager_name", length = 100)
    private String managerName;

    @NotNull(message = "Contact number is required")
    @Digits(integer = 15, fraction = 0, message = "Contact number must not exceed 15 digits")
    @Column(name = "contact_number", nullable = false, precision = 15, scale = 0)
    private BigDecimal contactNumber;

    @Size(max = 255, message = "Address must not exceed 255 characters")
    @Column(length = 255)
    private String address;

    @OneToMany(mappedBy = "showroom", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Car> cars = new ArrayList<>();
}
