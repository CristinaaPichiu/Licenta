package com.cristina.security.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "about")
public class AboutSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "summary", length = 1024)
    private String summary;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @JsonBackReference
    @OneToOne(mappedBy = "aboutSection")
    private Resume resume;
}
