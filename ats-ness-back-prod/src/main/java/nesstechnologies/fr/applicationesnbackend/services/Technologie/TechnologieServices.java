package nesstechnologies.fr.applicationesnbackend.services.Technologie;

import nesstechnologies.fr.applicationesnbackend.entities.Rating;
import nesstechnologies.fr.applicationesnbackend.entities.Technology;

public interface TechnologieServices {
    public Rating addAndRateTechnology(int id,float ratingValue, Technology techno);
    public float getRatingByTechno(int idTechnology);
    public Technology updateTechnologExperience(int id,float experience);
    public void removeTechnology(int idTechnology);

    }
