package com.cristina.security.service;

import com.cristina.security.entity.Job;
import com.cristina.security.entity.ToDoItem;
import com.cristina.security.entity.User;
import com.cristina.security.repository.JobRepository;
import com.cristina.security.repository.ToDoItemRepository;
import com.cristina.security.repository.UserRepository; // Asigură-te că importul este corect
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private UserRepository userRepository;  // Injectare UserRepository
    @Autowired
    private ToDoItemRepository toDoItemRepository;  // Presupunând că ai un repository pentru ToDoItem

    public Job saveOrUpdateJob(Job job) {
        User user;
        Job existingJob = null;
        if (job.getId() != null) {
            existingJob = jobRepository.findById(job.getId()).orElseThrow(() -> new RuntimeException("Job not found"));
            user = existingJob.getUser();  // Păstrează utilizatorul existent
        } else {
            String email = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
            user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        }
        job.setUser(user);

        if (existingJob != null) {
            // Actualizează proprietățile existente
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

            // Sincronizează colecția de ToDoItems
            syncToDoItems(existingJob, job.getTodoItems());

            return jobRepository.save(existingJob);
        }

        return jobRepository.save(job);
    }

    private void syncToDoItems(Job existingJob, List<ToDoItem> newToDoItems) {
        if (newToDoItems == null) {
            // Poți decide să ștergi toate elementele sau să nu faci nimic
            existingJob.getTodoItems().clear();
            return;
        }

        // Elimină orfani
        existingJob.getTodoItems().removeIf(existingItem ->
                newToDoItems.stream().noneMatch(newItem -> newItem.getId().equals(existingItem.getId()))
        );

        // Adaugă sau actualizează elementele noi
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

    // Metode pentru update și delete
}
