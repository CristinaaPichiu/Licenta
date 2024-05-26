package com.cristina.security.repository;

import com.cristina.security.entity.CoverLetterContactUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoverLetterContactUserRepository extends JpaRepository<CoverLetterContactUser, Integer> {
}
