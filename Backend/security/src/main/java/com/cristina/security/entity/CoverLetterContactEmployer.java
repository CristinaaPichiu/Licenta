package com.cristina.security.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "contact_employer")
public class CoverLetterContactEmployer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title")
    private String title;
    @Column(name = "firstName")
    private String firstName;
    @Column(name = "lastName")
    private String lastName;
    @Column(name = "position")
    private String position;
    @Column(name = "organisation")
    private String organisation;
    @Column(name = "address")
    private String address;

    @JsonBackReference
    @OneToOne(mappedBy = "coverLetterContactEmployer")
    private CoverLetter coverLetter;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
