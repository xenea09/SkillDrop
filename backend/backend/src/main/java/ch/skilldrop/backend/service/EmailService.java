package ch.skilldrop.backend.service;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${resend.api-key}")
    private String resendApiKey;

    public void sendEmailVerification(String email, String code) {
        Resend resend = new Resend(resendApiKey);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("SkillDrop <onboarding@resend.dev>")
                .to(email)
                .subject("Dein SkillDrop Verifizierungscode")
                .html("<h2>Willkommen bei SkillDrop! 🎉</h2>" +
                      "<p>Dein Verifizierungscode lautet:</p>" +
                      "<h1 style='color: #1E3A5F; letter-spacing: 8px;'>" + code + "</h1>" +
                      "<p>Der Code ist 15 Minuten gültig.</p>")
                .build();

        try {
            resend.emails().send(params);
        } catch (Exception e) {
            System.out.println("Email Fehler: " + e.getMessage());
        }
    }
}