package ch.skilldrop.backend.dto;

import ch.skilldrop.backend.entity.Drop;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DropResponse {
    private Long id;
    private String title;
    private String type;
    private String fileUrl;
    private LocalDateTime publishedAt;
    private String creatorUserName;

    public static DropResponse from(Drop drop) {
        DropResponse dto = new DropResponse();
        dto.setId(drop.getId());
        dto.setTitle(drop.getTitle());
        dto.setType(drop.getType().name());
        dto.setFileUrl(drop.getFileUrl());
        dto.setPublishedAt(drop.getPublishedAt());
        dto.setCreatorUserName(drop.getCreator().getUser().getUserName());
        return dto;
    }
}