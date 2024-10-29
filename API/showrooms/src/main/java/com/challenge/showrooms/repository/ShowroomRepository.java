package com.challenge.showrooms.repository;

import com.challenge.showrooms.entity.Showroom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.Optional;

public interface ShowroomRepository extends JpaRepository<Showroom, Long> {

    Page<Showroom> findByDeletedFalse(Pageable pageable);

    Optional<Showroom> findByIdAndDeletedFalse(Long id);

    boolean existsByCommercialRegistrationNumberAndDeletedFalse(BigDecimal commercialRegistrationNumber);
}