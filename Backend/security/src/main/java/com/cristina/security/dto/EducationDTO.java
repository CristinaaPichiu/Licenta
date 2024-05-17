package com.cristina.security.dto;


import java.time.LocalDate;

public class EducationDTO {
    private String school;
    private String degree;
    private LocalDate startDate;
    private LocalDate endDate;

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
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

    @Override
    public String toString() {
        return "EducationDTO{" +
                "school='" + school + '\'' +
                ", degree='" + degree + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                '}';
    }
}

