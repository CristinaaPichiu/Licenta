package com.cristina.security.entity;

import com.cristina.security.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_details")
public class UserDetailsProfile{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    private User user;

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
