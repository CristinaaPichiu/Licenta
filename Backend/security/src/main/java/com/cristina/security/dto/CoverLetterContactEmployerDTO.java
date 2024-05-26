package com.cristina.security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterContactEmployerDTO {
    private String title;
    private String firstName;
    private String lastName;
    private String position;
    private String organisation;
    private String address;
}
