package nesstechnologies.fr.applicationesnbackend.services.Rating;

import lombok.AllArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.entities.Rating;
import nesstechnologies.fr.applicationesnbackend.entities.Candidat;
import nesstechnologies.fr.applicationesnbackend.repositories.RateRepository;
import nesstechnologies.fr.applicationesnbackend.repositories.UserRepo;
import nesstechnologies.fr.applicationesnbackend.repositories.candidatRepository;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;

@Service
@AllArgsConstructor

public class RatingServiceImpl implements RatingService {
   private UserRepo userRepo;
   private RateRepository rateRepository;
   private final candidatRepository candidatRepository;

    public Rating createRate(float ratingValue,int candId) {

        Candidat ca = candidatRepository.findById(candId).get();
        // Check if the user has already rated the shop
        Rating existingRating = rateRepository.findByUser1(ca);
        if (existingRating != null) {
            // Update the existing rating with the new values
            existingRating.setValue(ratingValue);
            existingRating.setRatedAt(LocalDateTime.now());
            return rateRepository.save(existingRating);
        }
        Rating ra = new Rating();
        // Create a new rating for the user and shop
        ra.setRatedAt(LocalDateTime.now());
        ra.setValue(ratingValue);
        ra.setCand(ca);
         rateRepository.save(ra);
        return ra;
    }



    public float getRatingByUser(int idCandidat){
        Candidat ca = candidatRepository.findById(idCandidat).get();
        Rating rating = rateRepository.findByUser1(ca);

        if (rating == null){
            return 0;
        }
         return rateRepository.findByUser1(ca).getValue();
    }
}
