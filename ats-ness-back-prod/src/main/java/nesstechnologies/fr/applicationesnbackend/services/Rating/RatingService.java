package nesstechnologies.fr.applicationesnbackend.services.Rating;


import nesstechnologies.fr.applicationesnbackend.entities.Rating;


public interface RatingService {
     Rating createRate(float ratingValue,int candId);
     public float getRatingByUser(int idCandidat);
}
