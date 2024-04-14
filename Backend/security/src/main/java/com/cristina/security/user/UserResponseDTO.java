package com.cristina.security.user;



import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponseDTO {
    private String firstName;
    private String lastName;
}
