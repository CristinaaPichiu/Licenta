package com.cristina.security.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

import java.util.List;

public class ResumeDTO {

    private Integer templateId;
    private ContactDTO contactSection;
    private List<EducationDTO> educationSections;
    private List<ExperienceDTO> experienceSections;
    private List<SkillsDTO> skillsSections;
    private List<ProjectDTO> projectSections;
    private List<VolunteeringDTO> volunteeringSections;
    private List<LinkDTO> linkSections;
    private List<CustomSectionDTO> customSections;
    private AboutDTO aboutSection;

    public ContactDTO getContactSection() {
        return contactSection;
    }

    public void setContactSection(ContactDTO contactSection) {
        this.contactSection = contactSection;
    }

    public List<EducationDTO> getEducationSections() {
        return educationSections;
    }

    public void setEducationSections(List<EducationDTO> educationSections) {
        this.educationSections = educationSections;
    }

    public List<ExperienceDTO> getExperienceSections() {
        return experienceSections;
    }

    public void setExperienceSections(List<ExperienceDTO> experienceSections) {
        this.experienceSections = experienceSections;
    }

    public List<SkillsDTO> getSkillsSections() {
        return skillsSections;
    }

    public void setSkillsSections(List<SkillsDTO> skillsSections) {
        this.skillsSections = skillsSections;
    }

    public List<ProjectDTO> getProjectSections() {
        return projectSections;
    }

    public void setProjectSections(List<ProjectDTO> projectSections) {
        this.projectSections = projectSections;
    }

    public List<VolunteeringDTO> getVolunteeringSections() {
        return volunteeringSections;
    }

    public void setVolunteeringSections(List<VolunteeringDTO> volunteeringSections) {
        this.volunteeringSections = volunteeringSections;
    }

    public List<LinkDTO> getLinkSections() {
        return linkSections;
    }

    public void setLinkSections(List<LinkDTO> linkSections) {
        this.linkSections = linkSections;
    }

    public List<CustomSectionDTO> getCustomSections() {
        return customSections;
    }

    public void setCustomSections(List<CustomSectionDTO> customSections) {
        this.customSections = customSections;
    }

    public AboutDTO getAboutSection() {
        return aboutSection;
    }


    public void setAboutSection(AboutDTO aboutSection) {
        this.aboutSection = aboutSection;
    }

    public Integer getTemplateId() {
        return templateId;
    }

    public void setTemplateId(Integer templateId) {
        this.templateId = templateId;
    }

    @Override
    public String toString() {
        return "ResumeDTO{" +
                "contactSection=" + contactSection +
                ", experienceSections=" + experienceSections +
                ", educationSections=" + educationSections +
                ", skillsSections=" + skillsSections +
                ", projectSections=" + projectSections +
                ", linkSections=" + linkSections +
                ", volunteeringSections=" + volunteeringSections +
                ", customSections=" + customSections +
                ", aboutSection=" + aboutSection +
                '}';
    }

    // Getters and Setters
}
