package com.challenge.showrooms.criteria;

import com.challenge.showrooms.dto.CarSearchCriteria;
import com.challenge.showrooms.entity.Car;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

public class CarSpecifications {

    public static Specification<Car> withFilters(BigDecimal commercialRegistrationNumber, CarSearchCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Base conditions
            predicates.add(cb.equal(root.get("deleted"), false));
            predicates.add(cb.equal(root.get("showroom").get("commercialRegistrationNumber"),
                    commercialRegistrationNumber));

            // VIN search
            if (criteria.getVin() != null && !criteria.getVin().isEmpty()) {
                predicates.add(cb.like(
                        cb.lower(root.get("vin")),
                        "%" + criteria.getVin().toLowerCase() + "%"
                ));
            }

            // Maker search
            if (criteria.getMaker() != null && !criteria.getMaker().isEmpty()) {
                predicates.add(cb.like(
                        cb.lower(root.get("maker")),
                        "%" + criteria.getMaker().toLowerCase() + "%"
                ));
            }

            // Model search
            if (criteria.getModel() != null && !criteria.getModel().isEmpty()) {
                predicates.add(cb.like(
                        cb.lower(root.get("model")),
                        "%" + criteria.getModel().toLowerCase() + "%"
                ));
            }

            // Model Year search
            if (criteria.getModelYear() != null) {
                predicates.add(cb.equal(root.get("modelYear"), criteria.getModelYear()));
            }

            // Price range search
            if (criteria.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), criteria.getMinPrice()));
            }
            if (criteria.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), criteria.getMaxPrice()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
