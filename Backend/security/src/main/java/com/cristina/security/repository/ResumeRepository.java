package com.cristina.security.repository;

import com.cristina.security.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Integer> {
    // Aici poți adăuga metode personalizate de interogare dacă este necesar
}
