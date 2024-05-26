package com.cristina.security.repository;

import com.cristina.security.entity.CoverLetterBody;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoverLetterBodyRepository extends JpaRepository<CoverLetterBody, Integer> {
}
