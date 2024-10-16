package com.cristina.security.repository;


import com.cristina.security.entity.UserDetailsProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDetailsProfileRepository extends JpaRepository<UserDetailsProfile, Long> {
    Optional<UserDetailsProfile> findByUserId(Integer userId);

}
