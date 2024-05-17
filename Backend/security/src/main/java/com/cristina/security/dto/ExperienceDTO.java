package com.cristina.security.dto;


import java.time.LocalDate;

public class ExperienceDTO {
    private String jobTitle;
    private String employer;
    private LocalDate startDate;
    private LocalDate endDate;
    private String city;
    private String description;

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getEmployer() {
        return employer;
    }

    public void setEmployer(String employer) {
        this.employer = employer;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    @Override
    public String toString() {
        return "ExperienceDTO{" +
                "jobTitle='" + jobTitle + '\'' +
                ", employer='" + employer + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", city='" + city + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
    // Constructori, getters și setters
}

