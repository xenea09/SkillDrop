package ch.skilldrop.backend.controller;

import ch.skilldrop.backend.repository.CreatorProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/creators")
public class CreatorController {

    private final CreatorProfileRepository creatorProfileRepository;

    public CreatorController(CreatorProfileRepository creatorProfileRepository) {
        this.creatorProfileRepository = creatorProfileRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllCreators() {
        return ResponseEntity.ok(creatorProfileRepository.findAll());
    }
}