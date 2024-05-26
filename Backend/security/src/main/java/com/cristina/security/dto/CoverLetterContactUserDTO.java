package com.cristina.security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterContactUserDTO {
    private String firstName;
    private String lastName;
    private String status;
    private String address;
    private String city;
    private String postalCode;
    private String phone;
    private String email;
}
