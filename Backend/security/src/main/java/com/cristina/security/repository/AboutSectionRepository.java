package com.cristina.security.repository;


import com.cristina.security.entity.AboutSection;
import com.cristina.security.entity.ContactSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AboutSectionRepository extends JpaRepository<AboutSection, Integer> {
}
