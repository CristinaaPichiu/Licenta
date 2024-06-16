package com.cristina.security.repository;

import com.cristina.security.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Integer> {
    List<Job> findByUserId(Integer userId);
}
