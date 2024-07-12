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
    public ToDoItem createOrUpdateToDoItem(ToDoItemDTO toDoItemDTO) {
        ToDoItem toDoItem = null;

        if (toDoItemDTO.getId() != null) {
            toDoItem = toDoItemRepository.findById(toDoItemDTO.getId())
                    .orElseThrow(() -> new RuntimeException("Activity not found with id: " + toDoItemDTO.getId()));
        } else {
            toDoItem = new ToDoItem();
        }

        toDoItem.setName(toDoItemDTO.getName());
        toDoItem.setLocation(toDoItemDTO.getLocation());
        toDoItem.setStartDate(toDoItemDTO.getStartDate());
        toDoItem.setStartTime(toDoItemDTO.getStartTime());
        toDoItem.setDescription(toDoItemDTO.getDescription());
        toDoItem.setChecked(toDoItemDTO.getIsChecked());


        Job job = jobRepository.findById(toDoItemDTO.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + toDoItemDTO.getJobId()));
        toDoItem.setJob(job);

        return toDoItemRepository.save(toDoItem);
    }


    public List<ToDoItem> findToDoItemsByJobId(Integer jobId) {
        return toDoItemRepository.findByJobId(jobId);
    }

    @Transactional
    public void deleteToDoItem(Integer id) {
        if (!toDoItemRepository.existsById(id)) {
            throw new RuntimeException("ToDoItem not found with id " + id);
        }
        toDoItemRepository.deleteById(id);
    }
}
