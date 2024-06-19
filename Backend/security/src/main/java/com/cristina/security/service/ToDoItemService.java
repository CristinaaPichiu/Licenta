package com.cristina.security.service;

import com.cristina.security.dto.ToDoItemDTO;
import com.cristina.security.entity.ToDoItem;
import com.cristina.security.entity.Job;
import com.cristina.security.repository.ToDoItemRepository;
import com.cristina.security.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ToDoItemService {

    @Autowired
    private ToDoItemRepository toDoItemRepository;
    @Autowired
    private JobRepository jobRepository;

    @Transactional
    public ToDoItem createToDoItem(ToDoItemDTO toDoItemDTO) {
        Job job = jobRepository.findById(toDoItemDTO.getJobId()).orElseThrow(() -> new RuntimeException("Job not found"));
        ToDoItem toDoItem = new ToDoItem();
        toDoItem.setName(toDoItemDTO.getName());
        toDoItem.setLocation(toDoItemDTO.getLocation());
        toDoItem.setStartDate(toDoItemDTO.getStartDate());
        toDoItem.setStartTime(toDoItemDTO.getStartTime());
        toDoItem.setDescription(toDoItemDTO.getDescription());
        toDoItem.setJob(job);
        return toDoItemRepository.save(toDoItem);
    }

    public List<ToDoItem> findToDoItemsByJobId(Integer jobId) {
        return toDoItemRepository.findByJobId(jobId);
    }
}
