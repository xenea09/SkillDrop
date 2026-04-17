package ch.skilldrop.backend.dto;

import lombok.Data;

@Data
public class CreatorProfileRequest {
    private String bio;
    private String category;
    private Double pricePerMonth;
}