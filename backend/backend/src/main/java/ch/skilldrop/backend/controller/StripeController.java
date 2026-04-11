package ch.skilldrop.backend.controller;

import ch.skilldrop.backend.dto.SubscribeRequest;
import ch.skilldrop.backend.service.StripeService;
import ch.skilldrop.backend.repository.UserRepository;
import ch.skilldrop.backend.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stripe")
public class StripeController {

    private final StripeService stripeService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public StripeController(StripeService stripeService,
                            UserRepository userRepository,
                            JwtService jwtService) {
        this.stripeService = stripeService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody SubscribeRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);

            String subscriptionId = stripeService.createSubscription(
                email,
                request.getPaymentMethodId(),
                request.getPriceId()
            );

            return ResponseEntity.ok("Abo erstellt: " + subscriptionId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler: " + e.getMessage());
        }
    }
}