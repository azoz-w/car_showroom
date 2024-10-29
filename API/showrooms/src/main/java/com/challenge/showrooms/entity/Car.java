package com.challenge.showrooms.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cars")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Car extends BaseEntity {

    @NotBlank(message = "VIN is required")
    @Size(max = 25, message = "VIN must not exceed 25 characters")
    @Column(nullable = false, length = 25)
    private String vin;

    @NotBlank(message = "Maker is required")
    @Size(max = 25, message = "Maker must not exceed 25 characters")
    @Column(nullable = false, length = 25)
    private String maker;

    @NotBlank(message = "Model is required")
    @Size(max = 25, message = "Model must not exceed 25 characters")
    @Column(nullable = false, length = 25)
    private String model;

    @NotNull(message = "Model year is required")
    @Digits(integer = 4, fraction = 0, message = "Model year must be exactly 4 digits")
    @Column(name = "model_year", nullable = false, precision = 4, scale = 0)
    private BigDecimal modelYear;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showroom_id", nullable = false)
    private Showroom showroom;

//    public void setShowroom(Showroom showroom) {
//        if (this.showroom != null) {
//            this.showroom.getCars().remove(this);
//        }
//        this.showroom = showroom;
//        if (showroom != null) {
//            showroom.getCars().add(this);
//        }
//    }
}
