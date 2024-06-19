package com.cristina.security.repository;


import com.cristina.security.entity.ToDoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ToDoItemRepository extends JpaRepository<ToDoItem, Integer> {

    List<ToDoItem> findByJobId(Integer jobId);

}
