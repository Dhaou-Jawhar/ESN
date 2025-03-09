package nesstechnologies.fr.applicationesnbackend.services.Technologie;

import nesstechnologies.fr.applicationesnbackend.entities.Rating;
import nesstechnologies.fr.applicationesnbackend.entities.Technology;
import nesstechnologies.fr.applicationesnbackend.entities.Candidat;
import nesstechnologies.fr.applicationesnbackend.repositories.RateRepository;
import nesstechnologies.fr.applicationesnbackend.repositories.TechnologyRepo;
import nesstechnologies.fr.applicationesnbackend.repositories.candidatRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class TechnologieServicesImpl implements TechnologieServices{
    private final candidatRepository candidatRepo;
    private final TechnologyRepo technologyRepo;
    private final RateRepository ratingRepository;
    public TechnologieServicesImpl(candidatRepository candidatRepo, TechnologyRepo technologyRepo, RateRepository ratingRepository) {
        this.candidatRepo = candidatRepo;
        this.technologyRepo = technologyRepo;
        this.ratingRepository = ratingRepository;
    }

    @Override
    public Rating addAndRateTechnology(int id, float ratingValue, Technology techno) {
        // Récupérer le candidat à partir de l'ID
        Candidat candidate = candidatRepo.findById(id).orElseThrow(() -> new RuntimeException("Candidat non trouvé"));

        // Rechercher la technologie par nom
        Technology technology = technologyRepo.findByName(techno.getName());
        if (technology == null) {
            // Si la technologie n'existe pas, créez-en une nouvelle
            Technology newTechnology = new Technology();
            newTechnology.setName(techno.getName());
            newTechnology.setAnneesExperiences(techno.getAnneesExperiences());
            newTechnology.setCandidate(candidate);
            technology = technologyRepo.save(newTechnology);
        } else {
            // Si la technologie existe déjà, mettre à jour les années d'expérience
            technology.setAnneesExperiences(techno.getAnneesExperiences());
            technology = technologyRepo.save(technology);
        }

        // Stocker la référence de la technologie recherchée pour la lambda
        final Technology finalTechnology = technology;

        // Vérifier si la technologie est déjà évaluée par le candidat
        boolean isTechAlreadyRated = candidate.getRatedTechnologies()
                .stream()
                .anyMatch(t -> t.getName().equals(finalTechnology.getName()));

        if (!isTechAlreadyRated) {
            // La technologie n'a pas encore été évaluée par le candidat, on l'ajoute
            candidate.getRatedTechnologies().add(finalTechnology);
            candidatRepo.save(candidate);
        }

        // Vérifier s'il existe déjà une évaluation pour cette technologie
        Rating existingRating = ratingRepository.findByTechno(finalTechnology.getId());
        if (existingRating != null) {
            // Mettre à jour la note existante
            existingRating.setValue(ratingValue);
            existingRating.setRatedAt(LocalDateTime.now());
            return ratingRepository.save(existingRating);
        }

        // Créer une nouvelle note pour la technologie
        Rating rating = new Rating();
        rating.setValue(ratingValue);
        rating.setRatedAt(LocalDateTime.now());
        rating.setTechnology(finalTechnology);
        rating = ratingRepository.save(rating);

        // Sauvegarder le candidat avec la technologie associée
        candidatRepo.save(candidate);

        return rating;
    }





    @Override
    public float getRatingByTechno(int idTechnology) {
            Rating rating = ratingRepository.findByTechno(idTechnology);

            if (rating == null){
                return 0;
            }
            return ratingRepository.findByTechno(idTechnology).getValue();
        }

    @Override
    public Technology updateTechnologExperience(int id, float experience) {
        Optional<Technology> technology = technologyRepo.findById(id);
        technology.get().setAnneesExperiences(experience);
        return technologyRepo.save(technology.get());

    }

    @Override
    public void removeTechnology(int idTechnology) {
        Optional<Technology> technology = technologyRepo.findById(idTechnology);

        if (technology.isPresent()) {
            technologyRepo.delete(technology.get());
        } else {
            throw new RuntimeException("Technology not found with ID: " + idTechnology);
        }
    }

}
