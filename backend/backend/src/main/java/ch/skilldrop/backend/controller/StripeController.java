package ch.skilldrop.backend.controller;

import ch.skilldrop.backend.entity.Subscription;
import ch.skilldrop.backend.repository.CreatorProfileRepository;
import ch.skilldrop.backend.repository.SubscriptionRepository;
import ch.skilldrop.backend.repository.UserRepository;
import ch.skilldrop.backend.security.JwtService;
import ch.skilldrop.backend.service.StripeService;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stripe")
public class StripeController {

    private final StripeService stripeService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final CreatorProfileRepository creatorProfileRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Value("${stripe.webhook-secret:}")
    private String webhookSecret;

    public StripeController(StripeService stripeService,
                            UserRepository userRepository,
                            JwtService jwtService,
                            CreatorProfileRepository creatorProfileRepository,
                            SubscriptionRepository subscriptionRepository) {
        this.stripeService = stripeService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.creatorProfileRepository = creatorProfileRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @PostMapping("/checkout/{creatorId}")
    public ResponseEntity<?> createCheckout(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long creatorId) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtService.extractEmail(token);

            var creator = creatorProfileRepository.findById(creatorId)
                    .orElseThrow(() -> new RuntimeException("Creator nicht gefunden"));

            if (creator.getStripePriceId() == null) {
                return ResponseEntity.badRequest().body("Creator hat keinen Stripe Price!");
            }

            String checkoutUrl = stripeService.createCheckoutSession(
                email, creator.getStripePriceId(), creatorId
            );

            return ResponseEntity.ok(checkoutUrl);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler: " + e.getMessage());
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> webhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

            if ("checkout.session.completed".equals(event.getType())) {
                Session session = (Session) event.getDataObjectDeserializer()
                        .getObject().orElseThrow();

                String email = session.getCustomerEmail();
                Long creatorId = Long.parseLong(session.getMetadata().get("creatorId"));

                var user = userRepository.findByEmail(email).orElseThrow();
                var creator = creatorProfileRepository.findById(creatorId).orElseThrow();

                Subscription subscription = new Subscription();
                subscription.setSubscriber(user);
                subscription.setCreator(creator);
                subscription.setStripeSubscriptionId(session.getSubscription());
                subscription.setStatus(Subscription.Status.ACTIVE);

                subscriptionRepository.save(subscription);
            }

            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Webhook Fehler: " + e.getMessage());
        }
    }
}