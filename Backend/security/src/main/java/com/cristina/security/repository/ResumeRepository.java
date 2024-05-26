package com.cristina.security.repository;

import com.cristina.security.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, UUID> {

    @Query("SELECT r FROM Resume r WHERE r.user.id = :userId ORDER BY r.id DESC")
    Optional<Resume> findLatestByUserId(@Param("userId") Integer userId);
}
