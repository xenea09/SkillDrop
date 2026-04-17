package ch.skilldrop.backend.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ch.skilldrop.backend.dto.RefreshTokenRequest;
import ch.skilldrop.backend.dto.LoginRequest;
import ch.skilldrop.backend.dto.LoginResponse;
import ch.skilldrop.backend.dto.RegisterRequest;
import ch.skilldrop.backend.dto.VerifyRequest;
import ch.skilldrop.backend.entity.User;
import ch.skilldrop.backend.repository.UserRepository;
import ch.skilldrop.backend.security.JwtService;
import ch.skilldrop.backend.service.EmailService;
import ch.skilldrop.backend.repository.RefreshTokenRepository;
import ch.skilldrop.backend.entity.RefreshToken;
import ch.skilldrop.backend.service.RefreshTokenService;
import java.util.Random;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RefreshTokenService refreshTokenService;

    public AuthController(UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      JwtService jwtService,
                      EmailService emailService,
                      RefreshTokenRepository refreshTokenRepository,
                      RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-Mail bereits vergeben");
        }

        User user = new User();
        user.setUserName(request.getUserName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        String code = String.format("%06d", new Random().nextInt(999999));
        user.setVerificationToken(code);
        user.setEmailVerified(false);

        userRepository.save(user);

        emailService.sendEmailVerification(user.getEmail(), code);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Registrierung erfolgreich. Bitte bestätige deine E-Mail.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Ungültige Anmeldedaten"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Ungültige Anmeldedaten");
        }

        if (!user.isEmailVerified()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Bitte bestätige zuerst deine E-Mail-Adresse");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getUserName());
        String refreshToken = refreshTokenService.createRefreshToken(user);
        return ResponseEntity.ok(new LoginResponse(token, refreshToken));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshTokenRequest request) {
        return refreshTokenRepository.findByToken(request.getRefreshToken())
                .filter(token -> refreshTokenService.verifyExpiration(token))
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtService.generateToken(user.getEmail(), user.getUserName());
                    String newRefreshToken = refreshTokenService.createRefreshToken(user);
                    return ResponseEntity.ok(new LoginResponse(token, newRefreshToken));
                })
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Ungültiges oder abgelaufenes Refresh-Token"));
    }

    @Transactional
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody RefreshTokenRequest request) {
        refreshTokenRepository.findByToken(request.getRefreshToken())
                .ifPresent(refreshToken -> refreshTokenRepository.deleteByUser(refreshToken.getUser()));
        return ResponseEntity.ok("Erfolgreich ausgeloggt");
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody VerifyRequest request) {
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User nicht gefunden"));

        if (!user.getVerificationToken().equals(request.getCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ungültiger Code");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        return ResponseEntity.ok("Email erfolgreich verifiziert!");
    }
}