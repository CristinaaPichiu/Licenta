package com.cristina.security.user.repository;


import com.cristina.security.user.UserDetailsProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDetailsProfileRepository extends JpaRepository<UserDetailsProfile, Long> {
    Optional<UserDetailsProfile> findByUserId(Integer userId);

}
