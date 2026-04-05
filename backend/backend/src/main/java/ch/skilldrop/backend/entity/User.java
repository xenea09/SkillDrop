package ch.skilldrop.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column (nullable = false, unique = true)
    private String userName;

    @Column
    private boolean emailVerified = false;

    @Column (nullable = false, unique = true)
    private String verificationToken;

    @Enumerated(EnumType.STRING)
    private Role role = Role.SUBSCRIBER;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        SUBSCRIBER, CREATOR, ADMIN
    }
}