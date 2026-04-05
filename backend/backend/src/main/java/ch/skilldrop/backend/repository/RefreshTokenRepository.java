package ch.skilldrop.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

import ch.skilldrop.backend.entity.RefreshToken;
import ch.skilldrop.backend.entity.User;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    @Modifying(clearAutomatically = true)
    void deleteByUser(User user);

    Optional<RefreshToken> findByUserId(Long userId);
}