package nesstechnologies.fr.applicationesnbackend.controleurs.CandidatController;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.dto.CandidatDTO;
import nesstechnologies.fr.applicationesnbackend.entities.*;
import nesstechnologies.fr.applicationesnbackend.services.Candidat.candidatServices;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/candidats")
@RequiredArgsConstructor
@Tag(name = "✅ Gestion de candidats ✅", description = "APIs de gestion de candidats")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CandidatController {

    private final candidatServices candidatSer;


    @Operation(
            description = "Créer un compte candidat",
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
   @SecurityRequirement(name = "Token Authentification")
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Candidat createCandidat(
            @ModelAttribute Candidat candidateData,
            @RequestParam(value = "cvFile",required = false) MultipartFile cvFile) throws IOException {

        // Traitement de la création du candidat avec les données et fichiers

        return candidatSer.createCandidat( candidateData, cvFile);
    }




    @SecurityRequirement(name = "Token Authentification")
    @GetMapping("/getAll")
    public Page<CandidatDTO> getAllActions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return candidatSer.getAllCandidats(page, size);
    }


    @SecurityRequirement(name = "Token Authentification")
    @GetMapping("/getCandidat/{id}")
    public Candidat getCandidatById(@PathVariable int id) {

        return candidatSer.getCandidatById(id);
    }
    @Operation(
            description = "Créer un compte candidat",
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
    @SecurityRequirement(name = "Token Authentification")
    @PutMapping("/updateCandidat/{id}")
    public ResponseEntity<Candidat> updateCandidat(
            @PathVariable int id,
            @RequestPart("updatedCandidatData") String candidatDataJson,
            @RequestPart(value = "cvFile", required = false) MultipartFile cvFile,
            @RequestPart(value = "imgFile", required = false) MultipartFile imgFile,
            @RequestPart(value = "cvNessFile", required = false) MultipartFile cvNessFile) {
        try {
            // Convertir la chaîne JSON en objet Candidat
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            Candidat candidatData = objectMapper.readValue(candidatDataJson, Candidat.class);
            System.err.println(candidatData);

            // Mise à jour des fichiers si présents
            if (cvFile != null || imgFile != null || cvNessFile != null) {
                candidatSer.updateCandidatFiles(id, cvFile, imgFile, cvNessFile);
            }

            // Mise à jour du candidat sans inclure les fichiers
            Candidat updatedCandidatResponse = candidatSer.updateCandidat(id, candidatData);

            return new ResponseEntity<>(updatedCandidatResponse, HttpStatus.OK);
        } catch (IOException e) {
            // Erreur lors de la conversion JSON ou manipulation de fichiers
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        } catch (EntityNotFoundException e) {
            // Candidat introuvable
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        } catch (Exception e) {
            // Autres erreurs
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }





    @SecurityRequirement(name = "Token Authentification")
    @PostMapping(value = "/updateCandidatFiles/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Candidat> updateCandidatFiles(
            @PathVariable int id,
            @RequestPart(value = "cvFile", required = false) MultipartFile cvFile,
            @RequestPart(value = "imgFile", required = false) MultipartFile imgFile,
            @RequestPart(value = "cvNessFile", required = false) MultipartFile cvNessFile) {

        try {
            Candidat updatedCandidat = candidatSer.updateCandidatFiles(id, cvFile, imgFile, cvNessFile);
            return ResponseEntity.ok(updatedCandidat);
        } catch (Exception e) {
            System.err.println("Error updating candidat: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Retourner une réponse d'erreur appropriée
        }
    }



    @SecurityRequirement(name = "Token Authentification")
    @DeleteMapping("/removeCandidat/{id}")
    public void deleteCandidat(@PathVariable int id) {
        candidatSer.deleteCandidat(id);
    }
    @SecurityRequirement(name = "Token Authentification")
    @PutMapping("/updateEtat/{id}/{etat}")
    public Candidat updateEtat(@PathVariable int id, @PathVariable String etat) {
            return candidatSer.updateEtat(id, etat);
    }

    @SecurityRequirement(name = "Token Authentification")
    @GetMapping("/count-added-in-interval")
    public int countAddedCandidatesInInterval() {
        return candidatSer.countAddedCandidatesInInterval();
    }

    @SecurityRequirement(name = "Token Authentification")
    @GetMapping("/getCandidatActions/{candidatId}")
    public ResponseEntity<List<Actions>> getActionsByCandidatId(@PathVariable int candidatId) {
        List<Actions> actions = candidatSer.getActionsByCandidatId(candidatId);
        return ResponseEntity.ok(actions);
    }

    @GetMapping("/totalCandidats")
    public long getTotalCandidats() {
        return candidatSer.getTotalCandidats(); // Correct
    }

    @GetMapping("/nbrRessources")
    public long getNombreCandidatsRessource() {
        return candidatSer.getNombreCandidatsRessource();
    }

    @GetMapping("/nbrVivierTopVivier")
    public Map<String, Long> getNombreCandidatsVivier() {
        return candidatSer.getNombreCandidatsVivier();
    }

    @GetMapping("/pourcentage-vivier")
    public Map<String, Object> getPourcentageCandidatsVivier() {
        return candidatSer.getPourcentageCandidatsVivier();
    }

    @GetMapping("/pourcentage-Topvivier")
    public Map<String, Object>  getPourcentageCandidatsTopVivier() {
        return candidatSer.getPourcentageCandidatsTopVivier();
    }
    @GetMapping("/pourcentage-EnCoursDeQualification")
    public Map<String, Object>  getPourcentageCandidatsEnCoursDeQualification() {
        return candidatSer.getPourcentageCandidatsEnCoursDeQualification();
    }

    @GetMapping("/pourcentage-non-vivier-topvivier-encours")
     public Map<String, Object> getPourcentageCandidatsNonVivierTopVivierEnCours() {
        return candidatSer.getPourcentageCandidatsNonVivierTopVivierEnCours();
    }
}
