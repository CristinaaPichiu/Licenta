package com.cristina.security.repository;

import com.cristina.security.entity.ContactSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactSectionRepository extends JpaRepository<ContactSection, Integer> {
}

