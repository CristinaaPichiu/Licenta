package com.cristina.security.repository;


import com.cristina.security.entity.ContactSection;
import com.cristina.security.entity.EducationSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EducationSectionRepository extends JpaRepository<EducationSection, Integer> {
}