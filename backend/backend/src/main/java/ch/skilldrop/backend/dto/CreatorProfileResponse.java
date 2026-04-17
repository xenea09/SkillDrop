package ch.skilldrop.backend.dto;

import ch.skilldrop.backend.entity.CreatorProfile;
import lombok.Data;

@Data
public class CreatorProfileResponse {
    private Long id;
    private String userName;
    private String bio;
    private String category;
    private Double pricePerMonth;

    public static CreatorProfileResponse from(CreatorProfile profile) {
        CreatorProfileResponse dto = new CreatorProfileResponse();
        dto.setId(profile.getId());
        dto.setUserName(profile.getUser().getUserName());
        dto.setBio(profile.getBio());
        dto.setCategory(profile.getCategory());
        dto.setPricePerMonth(profile.getPricePerMonth());
        return dto;
    }
}