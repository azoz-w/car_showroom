package com.challenge.showrooms.repository;

import com.challenge.showrooms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndEnabledTrue(String username);

    boolean existsByUsername(String username);
}