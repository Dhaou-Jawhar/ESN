package nesstechnologies.fr.applicationesnbackend.controleurs.BesoinsController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.entities.Besoins;
import nesstechnologies.fr.applicationesnbackend.entities.Rating;
import nesstechnologies.fr.applicationesnbackend.services.Besoins.BesoinsServices;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/besoins")
@RequiredArgsConstructor
@Tag(name = "✅ Gestion de besoins ✅", description = "APIs de gestion de candidats")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BesoinsController {
    private final BesoinsServices besoinsServices;
    @Operation(
            description = "Créer un besoin",
            summary = "Saisir votre adresse mail, votre futur mot de passe, votre nom et votre prénom pour crééer votre compte",
            responses = {
                    @ApiResponse(
                            description = "Succès",
                            responseCode = "200"
                    ),
                    @ApiResponse(
                            description = "Non Autorisé / Token invalide",
                            responseCode = "403"
                    ),
                    @ApiResponse(
                            description = "Erreur au niveau du serveur",
                            responseCode = "500"
                    ),
            }
    )
    @PostMapping("/createBesoin")
    public Besoins createBesoin(
            @RequestBody Besoins besoin) throws Exception {

        // Appel à la méthode principale
        return besoinsServices.createBesoin(besoin);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Besoins>> getAllbesoins() {
        List<Besoins> besoins = besoinsServices.getAllBesoins();
        return ResponseEntity.ok(besoins);
    }

    @GetMapping("/getBesoin/{id}")
    public ResponseEntity<Besoins> getBesoinById(@PathVariable int id) {
        Optional<Besoins> besoin = besoinsServices.getBesoinById(id);

        if (besoin.isPresent()) {
            return ResponseEntity.ok(besoin.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    @PostMapping("/add/{value}/{id}")
    public Rating createRate (@PathVariable("value") float value, @PathVariable("id") int id) {
        return besoinsServices.addRatingToBesoin(value,id);
    }

    @GetMapping("/getRatingByBesoin/{id}")
    public double getAverageRatingForBesoin(@PathVariable("id") int id){
        return besoinsServices.getRatingByBesooin(id);
    }


    @PutMapping("/updateBesoin/{besoinId}")
    public Besoins updateBesoin(
            @PathVariable Integer besoinId,
            @RequestBody Besoins updatedBesoin) throws Exception {

        // Appeler le service pour mettre à jour le besoin et son profil
        return besoinsServices.updateBesoin(besoinId, updatedBesoin);
    }


}
