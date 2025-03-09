package nesstechnologies.fr.applicationesnbackend.services.EmailSender;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class EmailSenderServiceImpl implements EmailSenderService {

    private final JavaMailSender mailSender;

    @Value(value ="${ats.config.mail.from}")
    private String emailFrom;

    @Async
    public void send(String to, String email) {
        try {

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setText(email, true);
            helper.setTo(to);
            helper.setSubject("Confirmer votre email");
            helper.setFrom(emailFrom);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            log.error("failed to send email " + e);

            throw new IllegalStateException("failed to send email");
        }
    }


    @Async
    public void send1(String to, String email) {
        try {

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setText(email, true);
            helper.setTo(to);
            helper.setSubject("Nouvelle tâche assignée");
            helper.setFrom(emailFrom);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            log.error("failed to send email " + e);

            throw new IllegalStateException("failed to send email");
        }
    }

    @Async
    public void send2(String to, String email) {
        try {

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setText(email, true);
            helper.setTo(to);
            helper.setSubject("Retrait d'un groupe");
            helper.setFrom(emailFrom);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            log.error("failed to send email " + e);

            throw new IllegalStateException("failed to send email");
        }
    }

    @Async
    public void send3(String to, String email) {
        try {

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setText(email, true);
            helper.setTo(to);
            helper.setSubject("Affectation à un groupe");
            helper.setFrom(emailFrom);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            log.error("failed to send email " + e);

            throw new IllegalStateException("failed to send email");
        }
    }

}

