package nesstechnologies.fr.applicationesnbackend.services.StatistiquesProfil;

import nesstechnologies.fr.applicationesnbackend.entities.StatistiquesProfil;
import nesstechnologies.fr.applicationesnbackend.repositories.StatistiquesProfilRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StatistiquesProfilServicesImpl implements StatistiquesProfilServices {
    private final StatistiquesProfilRepository statistiquesProfilRepository;

    public StatistiquesProfilServicesImpl(StatistiquesProfilRepository statistiquesProfilRepository) {
        this.statistiquesProfilRepository = statistiquesProfilRepository;
    }

    @Override
    public StatistiquesProfil getStatistiquesProfilById(Integer id) {
        Optional<StatistiquesProfil> statistiquesProfil = statistiquesProfilRepository.findById(id);

        if (statistiquesProfil.isPresent()) {
            return statistiquesProfil.get();
        } else {
            throw new RuntimeException("StatistiquesProfil not found with id: " + id);
        }
    }
}
