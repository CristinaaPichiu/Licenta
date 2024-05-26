package com.cristina.security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterDTO {
    private UUID userId;
    private CoverLetterContactUserDTO contactUser;
    private CoverLetterContactEmployerDTO contactEmployer;
    private CoverLetterBodyDTO body;
}
