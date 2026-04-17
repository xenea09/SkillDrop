package ch.skilldrop.backend.dto;

import ch.skilldrop.backend.entity.User;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String email;
    private String userName;
    private String role;

    public static UserResponse from(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setUserName(user.getUserName());
        dto.setRole(user.getRole().name());
        return dto;
    }
}