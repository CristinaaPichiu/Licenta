package com.cristina.security.dto;

public class SkillsDTO {
    private String skillName;
    private String proficiencyLevel;

    public String getSkillName() {
        return skillName;
    }

    public String getLevel() {
        return proficiencyLevel;
    }

    public void setSkillName(String skillName) {
        this.skillName=skillName;
    }

    public void setProficiencyLevel(String proficiencyLevel) {
        this.proficiencyLevel=proficiencyLevel;
    }

    public String getProficiencyLevel() {
        return proficiencyLevel;
    }

    // Constructori, getters și setters
}

