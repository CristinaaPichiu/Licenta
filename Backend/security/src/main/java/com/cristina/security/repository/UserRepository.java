package com.cristina.security.repository;

import com.cristina.security.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "UPDATE _user SET photo = :photo WHERE email = :email", nativeQuery = true)
    void updatePhoto(byte[] photo, String email);
}
