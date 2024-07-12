package com.cristina.security.repository;

import com.cristina.security.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Integer> {
    List<Job> findByUserId(Integer userId);

    @Query("SELECT COUNT(j) FROM Job j WHERE j.user.id = :userId AND j.columnName = :columnName")
    Integer countJobsByUserAndColumnName(Integer userId, String columnName);
}
