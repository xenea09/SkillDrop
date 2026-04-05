package ch.skilldrop.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import ch.skilldrop.backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}