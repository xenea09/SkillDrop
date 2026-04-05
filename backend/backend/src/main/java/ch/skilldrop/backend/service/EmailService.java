package ch.skilldrop.backend.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendEmailVerification(String email, String code) {
        System.out.println("Verification code for " + email + ": " + code);
    }
}