package com.challenge.showrooms.criteria;

import com.challenge.showrooms.entity.Car;
import org.springframework.data.jpa.domain.Specification;

public class CarSpecifications {
    public static Specification<Car> withMaker(String maker) {
        return (root, query, cb) -> {
            if (maker == null || maker.trim().isEmpty()) {
                return null;
            }
            return cb.like(cb.lower(root.get("maker")), "%" + maker.toLowerCase() + "%");
        };
    }

    public static Specification<Car> withShowroomName(String showroomName) {
        return (root, query, cb) -> {
            if (showroomName == null || showroomName.trim().isEmpty()) {
                return null;
            }
            return cb.like(
                    cb.lower(root.join("showroom").get("name")),
                    "%" + showroomName.toLowerCase() + "%"
            );
        };
    }

    public static Specification<Car> notDeleted() {
        return (root, query, cb) -> cb.equal(root.get("deleted"), false);
    }
}
