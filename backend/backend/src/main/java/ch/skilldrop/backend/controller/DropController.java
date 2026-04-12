package ch.skilldrop.backend.controller;

import ch.skilldrop.backend.entity.Drop;
import ch.skilldrop.backend.repository.DropRepository;
import ch.skilldrop.backend.repository.UserRepository;
import ch.skilldrop.backend.security.JwtService;
import ch.skilldrop.backend.service.R2Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ch.skilldrop.backend.repository.SubscriptionRepository;


@RestController
@RequestMapping("/api/drops")
public class DropController {

    private final R2Service r2Service;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final DropRepository dropRepository;
    private final SubscriptionRepository subscriptionRepository;

    public DropController(R2Service r2Service,
                          JwtService jwtService,
                          UserRepository userRepository,
                          DropRepository dropRepository,
                          SubscriptionRepository subscriptionRepository) {
        this.r2Service = r2Service;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.dropRepository = dropRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @PostMapping
    public ResponseEntity<?> createDrop(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("title") String title,
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String fileUrl = r2Service.uploadFile(fileName, file.getBytes(), file.getContentType());

            Drop drop = new Drop();
            drop.setTitle(title);
            drop.setType(Drop.DropType.valueOf(type));
            drop.setFileUrl(fileUrl);

            userRepository.findByEmail(email).ifPresent(user -> {
                drop.setCreator(user.getCreatorProfile());
            });

            dropRepository.save(drop);

            return ResponseEntity.ok("Drop erstellt: " + fileUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler: " + e.getMessage());
        }
    }
    @GetMapping("/feed")
    public ResponseEntity<?> getFeed(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);

            var user = userRepository.findByEmail(email).orElseThrow();
            var subscriptions = subscriptionRepository.findBySubscriber(user);

            var drops = subscriptions.stream()
                    .flatMap(sub -> dropRepository.findByCreator(sub.getCreator()).stream())
                    .toList();

            return ResponseEntity.ok(drops);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler: " + e.getMessage());
        }
    }
}