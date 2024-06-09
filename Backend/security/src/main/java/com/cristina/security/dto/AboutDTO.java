package com.cristina.security.dto;

public class AboutDTO {
    private String summary;

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    @Override
    public String toString() {
        return "AboutDTO{" +
                "summary='" + summary + '\'' +
                '}';
    }
}
