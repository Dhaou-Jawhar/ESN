package nesstechnologies.fr.applicationesnbackend.controleurs.StatistiquesProfil;

import lombok.AllArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.entities.StatistiquesProfil;
import nesstechnologies.fr.applicationesnbackend.services.StatistiquesProfil.StatistiquesProfilServices;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/StatistiquesProfil")
public class StatistiquesProfilController {
    private final StatistiquesProfilServices statistiquesProfilServices;


    @GetMapping("/getStatProfil/{id}")
    public ResponseEntity<StatistiquesProfil> getStatistiquesProfil(@PathVariable Integer id) {
        try {
            StatistiquesProfil statistiquesProfil = statistiquesProfilServices.getStatistiquesProfilById(id);
            return new ResponseEntity<>(statistiquesProfil, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
}
