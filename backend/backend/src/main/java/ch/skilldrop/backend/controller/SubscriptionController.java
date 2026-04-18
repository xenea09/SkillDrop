package ch.skilldrop.backend.controller;

import ch.skilldrop.backend.entity.Subscription;
import ch.skilldrop.backend.repository.CreatorProfileRepository;
import ch.skilldrop.backend.repository.SubscriptionRepository;
import ch.skilldrop.backend.repository.UserRepository;
import ch.skilldrop.backend.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionRepository subscriptionRepository;
    private final CreatorProfileRepository creatorProfileRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public SubscriptionController(SubscriptionRepository subscriptionRepository,
                                  CreatorProfileRepository creatorProfileRepository,
                                  UserRepository userRepository,
                                  JwtService jwtService) {
        this.subscriptionRepository = subscriptionRepository;
        this.creatorProfileRepository = creatorProfileRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/{creatorId}")
    public ResponseEntity<?> subscribe(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long creatorId) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);

            var user = userRepository.findByEmail(email).orElseThrow();
            var creator = creatorProfileRepository.findById(creatorId)
                    .orElseThrow(() -> new RuntimeException("Creator nicht gefunden"));

            if (creator.getUser().getEmail().equals(email)) {
                return ResponseEntity.badRequest().body("Du kannst dich nicht selbst subscriben!");
            }

            boolean alreadySubscribed = subscriptionRepository
                    .findBySubscriber(user)
                    .stream()
                    .anyMatch(s -> s.getCreator().getId().equals(creatorId)
                            && s.getStatus() == Subscription.Status.ACTIVE);

            if (alreadySubscribed) {
                return ResponseEntity.badRequest().body("Du bist bereits subscribed!");
            }

            Subscription subscription = new Subscription();
            subscription.setSubscriber(user);
            subscription.setCreator(creator);
            subscription.setStatus(Subscription.Status.ACTIVE);

            subscriptionRepository.save(subscription);

            return ResponseEntity.ok("Erfolgreich subscribed bei " + creator.getUser().getUserName());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler: " + e.getMessage());
        }
    }

    @DeleteMapping("/{creatorId}")
    public ResponseEntity<?> unsubscribe(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long creatorId) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);

            var user = userRepository.findByEmail(email).orElseThrow();

            subscriptionRepository.findBySubscriber(user)
                    .stream()
                    .filter(s -> s.getCreator().getId().equals(creatorId))
                    .forEach(subscriptionRepository::delete);

            return ResponseEntity.ok("Erfolgreich unsubscribed!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getMySubscriptions(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);

            var user = userRepository.findByEmail(email).orElseThrow();
            var subscriptions = subscriptionRepository.findBySubscriber(user);

            var result = subscriptions.stream()
                    .map(s -> s.getCreator().getUser().getUserName())
                    .toList();

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler: " + e.getMessage());
        }
    }
}