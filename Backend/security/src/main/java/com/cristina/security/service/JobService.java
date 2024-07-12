package com.cristina.security.service;

import com.cristina.security.entity.Job;
import com.cristina.security.entity.ToDoItem;
import com.cristina.security.entity.User;
import com.cristina.security.repository.JobRepository;
import com.cristina.security.repository.ToDoItemRepository;
import com.cristina.security.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ToDoItemRepository toDoItemRepository;

    public Job saveOrUpdateJob(Job job) {
        User user;
        Job existingJob = null;
        if (job.getId() != null) {
            existingJob = jobRepository.findById(job.getId()).orElseThrow(() -> new RuntimeException("Job not found"));
            user = existingJob.getUser();
        } else {
            String email = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
            user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        }
        job.setUser(user);

        if (existingJob != null) {
            existingJob.setTitle(job.getTitle());
            existingJob.setCompany(job.getCompany());
            existingJob.setDate(job.getDate());
            existingJob.setLocation(job.getLocation());
            existingJob.setSalary(job.getSalary());
            existingJob.setJobType(job.getJobType());
            existingJob.setLink(job.getLink());
            existingJob.setNotes(job.getNotes());
            existingJob.setColor(job.getColor());
            existingJob.setColumnName(job.getColumnName());

            syncToDoItems(existingJob, job.getTodoItems());

            return jobRepository.save(existingJob);
        }

        return jobRepository.save(job);
    }

    private void syncToDoItems(Job existingJob, List<ToDoItem> newToDoItems) {
        if (newToDoItems == null) {
            existingJob.getTodoItems().clear();
            return;
        }

        existingJob.getTodoItems().removeIf(existingItem ->
                newToDoItems.stream().noneMatch(newItem -> newItem.getId().equals(existingItem.getId()))
        );

        for (ToDoItem newItem : newToDoItems) {
            ToDoItem existingItem = existingJob.getTodoItems().stream()
                    .filter(e -> e.getId().equals(newItem.getId()))
                    .findFirst()
                    .orElse(null);

            if (existingItem == null) {
                existingJob.getTodoItems().add(newItem);
                newItem.setJob(existingJob);
            } else {
                existingItem.setName(newItem.getName());
                existingItem.setLocation(newItem.getLocation());
                existingItem.setStartDate(newItem.getStartDate());
                existingItem.setStartTime(newItem.getStartTime());
                existingItem.setDescription(newItem.getDescription());
            }
        }
    }



    public List<Job> getJobsByUser(Integer userId) {
        return jobRepository.findByUserId(userId);
    }

    public void deleteJob(Integer id) {
        jobRepository.deleteById(id);
    }

    public Job findById(Integer id) {
        Optional<Job> job = jobRepository.findById(id);
        if (job.isPresent()) {
            return job.get();
        } else {
            throw new RuntimeException("Job not found with id: " + id);
        }
    }

    public Map<String, Integer> getJobStatisticsByUser(Integer userId) {
        Map<String, Integer> statistics = new HashMap<>();
        statistics.put("toApply", jobRepository.countJobsByUserAndColumnName(userId, "toApply"));
        statistics.put("applied", jobRepository.countJobsByUserAndColumnName(userId, "applied"));
        statistics.put("interview", jobRepository.countJobsByUserAndColumnName(userId, "interview"));
        statistics.put("offer", jobRepository.countJobsByUserAndColumnName(userId, "offer"));
        statistics.put("rejected", jobRepository.countJobsByUserAndColumnName(userId, "rejected"));
        return statistics;
    }

}
