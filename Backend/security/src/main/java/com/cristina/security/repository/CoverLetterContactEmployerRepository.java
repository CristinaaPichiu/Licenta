package com.cristina.security.repository;

import com.cristina.security.entity.CoverLetterContactEmployer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoverLetterContactEmployerRepository extends JpaRepository<CoverLetterContactEmployer, Integer> {
}
