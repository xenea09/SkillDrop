package ch.skilldrop.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "drops")
public class Drop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private CreatorProfile creator;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    private DropType type;

    private String fileUrl;

    @Column(length = 2000)
    private String content;

    private LocalDateTime publishedAt = LocalDateTime.now();

    public enum DropType {
        TEXT, AUDIO, VIDEO
    }
}