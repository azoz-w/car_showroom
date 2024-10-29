package com.challenge.showrooms.repository;


import com.challenge.showrooms.entity.Car;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Long>, JpaSpecificationExecutor<Car> {

    Page<Car> findByDeletedFalse(Pageable pageable);

    Page<Car> findByDeletedFalseAndShowroomId(Long showroomId, Pageable pageable);

    Optional<Car> findByIdAndDeletedFalse(Long id);
}