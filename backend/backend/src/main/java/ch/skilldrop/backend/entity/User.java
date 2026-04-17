package ch.skilldrop.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column (nullable = false, unique = true)
    private String userName;

    @Column
    private boolean emailVerified = false;

    @JsonIgnore
    @Column(unique = true)
    private String verificationToken;

    @Enumerated(EnumType.STRING)
    private Role role = Role.SUBSCRIBER;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToOne(mappedBy = "user")
    private CreatorProfile creatorProfile;

    public enum Role {
        SUBSCRIBER, CREATOR, ADMIN
    }
}