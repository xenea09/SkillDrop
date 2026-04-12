package ch.skilldrop.backend.repository;

import ch.skilldrop.backend.entity.Subscription;
import ch.skilldrop.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findBySubscriber(User user);
}