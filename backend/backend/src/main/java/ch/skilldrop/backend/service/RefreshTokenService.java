package ch.skilldrop.backend.service;

import ch.skilldrop.backend.entity.RefreshToken;
import ch.skilldrop.backend.entity.User;
import ch.skilldrop.backend.repository.RefreshTokenRepository;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.springframework.transaction.annotation.Transactional;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Transactional
    public String createRefreshToken(User user) {
    RefreshToken refreshToken = refreshTokenRepository
            .findByUserId(user.getId())
            .orElse(new RefreshToken());
    
    refreshToken.setToken(UUID.randomUUID().toString());
    refreshToken.setUser(user);
    refreshToken.setExpiration(Instant.now().plus(30, ChronoUnit.DAYS));
    refreshTokenRepository.save(refreshToken);
    return refreshToken.getToken();
}
    public boolean verifyExpiration(RefreshToken token) {
        return !token.getExpiration().isBefore(java.time.Instant.now());
    }
}
