package nesstechnologies.fr.applicationesnbackend.services.Langues;

import nesstechnologies.fr.applicationesnbackend.entities.Langues;
import nesstechnologies.fr.applicationesnbackend.entities.Rating;
import nesstechnologies.fr.applicationesnbackend.repositories.LanguesRepository;
import nesstechnologies.fr.applicationesnbackend.repositories.RateRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
@Service
public class LanguesServicesImpl implements LanguesServices {
    private final LanguesRepository languesRepository;
    private final RateRepository rateRepository;

    public LanguesServicesImpl(LanguesRepository languesRepository, RateRepository rateRepository) {
        this.languesRepository = languesRepository;
        this.rateRepository = rateRepository;
    }

    @Override
    public Rating addRatingToLangue(  float ratingValue,int id) {

        Langues langue = languesRepository.findById(id).get();
                Rating existingRating = rateRepository.findByLangues(id);
        if (existingRating != null) {
            // Update the existing rating with the new values
            existingRating.setValue(ratingValue);
            existingRating.setRatedAt(LocalDateTime.now());
            return rateRepository.save(existingRating);
        }
            // Create a new rating or update an existing one
            Rating rating = new Rating();
            rating.setValue(ratingValue);
            rating.setRatedAt(LocalDateTime.now());
            rating.setLangues(langue);
            rateRepository.save(rating);
            return rating;

    }

    @Override
    public float getRatingByLanguage(int idLanguage) {
        Rating rating = rateRepository.findByLangues(idLanguage);

        if (rating == null){
            return 0;
        }
        return rateRepository.findByLangues(idLanguage).getValue();
    }
}
