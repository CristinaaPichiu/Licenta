package com.cristina.security.repository;


import com.cristina.security.entity.ContactSection;
import com.cristina.security.entity.VolunteeringSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VolunteeringSectionRepository extends JpaRepository<VolunteeringSection, Integer> {
}