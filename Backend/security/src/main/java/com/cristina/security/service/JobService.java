package com.cristina.security.service;

import com.cristina.security.entity.Job;
import com.cristina.security.entity.User;
import com.cristina.security.repository.JobRepository;
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

    public Job saveJob(Job job) {
        String email = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new RuntimeException("User not found with email: " + email));
        job.setUser(user);
        return jobRepository.save(job);
    }

    public List<Job> getJobsByUser(Integer userId) {
        return jobRepository.findByUserId(userId);
    }

    // Metode pentru update și delete
}
