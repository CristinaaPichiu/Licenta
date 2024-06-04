package com.cristina.security.repository;

import com.cristina.security.entity.CoverLetter;
import com.cristina.security.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CoverLetterRepository extends JpaRepository<CoverLetter, UUID> {

    @Query("SELECT r FROM CoverLetter r WHERE r.user.id = :userId ORDER BY r.id DESC")
    List<CoverLetter> findLatestByUserId(@Param("userId") Integer userId, Pageable pageable);
    List<CoverLetter> findAllByUserId(Integer userId);

}

