package com.cristina.security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterDTO {

    private Integer templateId;
    private CoverLetterContactUserDTO contactUser;
    private CoverLetterContactEmployerDTO contactEmployer;
    private CoverLetterBodyDTO body;

    public Integer getTemplateId() {
        return templateId;
    }

    public void setTemplateId(Integer templateId) {
        this.templateId = templateId;
    }



    public CoverLetterContactUserDTO getContactUser() {
        return contactUser;
    }

    public void setContactUser(CoverLetterContactUserDTO contactUser) {
        this.contactUser = contactUser;
    }

    public CoverLetterContactEmployerDTO getContactEmployer() {
        return contactEmployer;
    }

    public void setContactEmployer(CoverLetterContactEmployerDTO contactEmployer) {
        this.contactEmployer = contactEmployer;
    }

    public CoverLetterBodyDTO getBody() {
        return body;
    }

    public void setBody(CoverLetterBodyDTO body) {
        this.body = body;
    }
}
