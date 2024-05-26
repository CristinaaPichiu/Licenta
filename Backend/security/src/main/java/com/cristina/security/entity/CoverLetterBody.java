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
@Table(name = "body")
public class CoverLetterBody {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "body")
    private String body;

    @JsonBackReference
    @OneToOne(mappedBy = "coverLetterBody")
    private CoverLetter coverLetter;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
