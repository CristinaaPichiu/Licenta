package com.cristina.security.dto;


import java.time.LocalDate;

public class JobDTO {
    private Integer id;
    private String title;
    private String company;
    private LocalDate date;
    private String location;
    private Double salary;
    private String jobType;
    private String link;
    private String notes;


    // Getteri și Setteri
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @Override
    public String toString() {
        return "JobDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", company='" + company + '\'' +
                ", date=" + date +
                ", location='" + location + '\'' +
                ", salary=" + salary +
                ", jobType='" + jobType + '\'' +
                ", link='" + link + '\'' +
                ", notes='" + notes + '\'' +
                '}';
    }
}
