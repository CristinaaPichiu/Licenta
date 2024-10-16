package com.cristina.security.dto;

import lombok.Data;

@Data
public class UserDetailsDTO {
    private String email;
    private String phoneNumber;
    private String city;
    private String address;
    private String postCode;
    private String github;
    private String linkedIn;
    private String language;
    private String skills;
    private String status;
}

