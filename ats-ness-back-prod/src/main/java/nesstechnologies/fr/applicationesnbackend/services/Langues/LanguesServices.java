package nesstechnologies.fr.applicationesnbackend.services.Langues;

import nesstechnologies.fr.applicationesnbackend.entities.Rating;

public interface LanguesServices {
    public Rating addRatingToLangue(float ratingValue, int id);
    public float getRatingByLanguage(int idLanguage);
}
