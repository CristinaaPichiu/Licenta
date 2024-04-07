package com.cristina.security.userProfile;



import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDetailsResponse {
    private String firstName;
    private String lastName;
    private String email;
}
