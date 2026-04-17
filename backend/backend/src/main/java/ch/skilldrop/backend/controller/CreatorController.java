package ch.skilldrop.backend.controller;

import ch.skilldrop.backend.dto.CreatorProfileRequest;
import ch.skilldrop.backend.dto.CreatorProfileResponse;
import ch.skilldrop.backend.entity.CreatorProfile;
import ch.skilldrop.backend.repository.CreatorProfileRepository;
import ch.skilldrop.backend.repository.UserRepository;
import ch.skilldrop.backend.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/creators")
public class CreatorController {

    private final CreatorProfileRepository creatorProfileRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public CreatorController(CreatorProfileRepository creatorProfileRepository,
                             UserRepository userRepository,
                             JwtService jwtService) {
        this.creatorProfileRepository = creatorProfileRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<?> getAllCreators() {
        var creators = creatorProfileRepository.findAll()
                .stream()
                .map(CreatorProfileResponse::from)
                .toList();
        return ResponseEntity.ok(creators);
    }

    @PostMapping("/become-creator")
    public ResponseEntity<?> becomeCreator(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreatorProfileRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);

            var user = userRepository.findByEmail(email).orElseThrow();

            if (user.getCreatorProfile() != null) {
                return ResponseEntity.badRequest().body("Du bist bereits ein Creator!");
            }

            CreatorProfile profile = new CreatorProfile();
            profile.setUser(user);
            profile.setBio(request.getBio());
            profile.setCategory(request.getCategory());
            profile.setPricePerMonth(request.getPricePerMonth() != null ? request.getPricePerMonth() : 5.0);

            creatorProfileRepository.save(profile);

            return ResponseEntity.ok(CreatorProfileResponse.from(profile));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler: " + e.getMessage());
        }
    }
}