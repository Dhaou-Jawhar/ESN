package nesstechnologies.fr.applicationesnbackend.controleurs.SocieteController;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.AllArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.dto.SocieteDTO;
import nesstechnologies.fr.applicationesnbackend.entities.Besoins;
import nesstechnologies.fr.applicationesnbackend.entities.Societe;
import nesstechnologies.fr.applicationesnbackend.services.Societe.SocieteServices;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/societe")
public class SocieteController {
    private final SocieteServices societeServices;
    @PostMapping("/creer")
    public Societe creerSociete(
            @RequestPart("societeData") String societeDataJson,
            @RequestPart(value = "organigrammes",required = false) List<MultipartFile> organigrammes,
            @RequestPart(value = "logo",required = false) MultipartFile logo) throws Exception {
        // Convert the JSON string into the Societe object
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        Societe societeData = objectMapper.readValue(societeDataJson, Societe.class);

        return societeServices.createSociete(societeData, organigrammes,logo);
    }

    @PutMapping("/update/{id}")
    public Societe updateSociete(
            @PathVariable Integer id,
            @RequestPart("societeData") String societeDataJson,
            @RequestPart(value = "organigrammes", required = false) List<MultipartFile> newOrganigrammes,
            @RequestPart(value = "logo", required = false) MultipartFile newLogo) throws Exception {

        // Convertir la chaîne JSON en objet Societe
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        Societe societeData = objectMapper.readValue(societeDataJson, Societe.class);
        // Handle null for newOrganigrammes
        if (newOrganigrammes == null) {
            newOrganigrammes = new ArrayList<>(); // Initialize as empty list if null
        }
        // Appeler le service de mise à jour
        return societeServices.updateSociete(id, societeData, newOrganigrammes, newLogo);
    }



    @GetMapping("/getSociete/{id}")
    public ResponseEntity<SocieteDTO> getClientById(@PathVariable Integer id) {
        SocieteDTO societeSimpleDTO = societeServices.getSocieteById(id);
        return ResponseEntity.ok(societeSimpleDTO);
    }

    @GetMapping("getAllSociete")
    public List<Societe> getAll() {
        return societeServices.getAll();
    }

    @DeleteMapping("/{id}/organigrammes")
    public ResponseEntity<String> deleteOrganigram(@PathVariable Integer id, @RequestParam String organigrammeUrl) {
        try {
            societeServices.deleteOrganigramFromSociete(id, organigrammeUrl);
            return ResponseEntity.ok("Organigramme supprimé avec succès."); // Return 200 OK with success message
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Erreur : " + e.getMessage()); // Return 404 if not found
        }
    }


    @PutMapping("/updateSocieteBesoin/{societeId}")
    public Besoins updateBesoin(
            @PathVariable Integer societeId,
            @RequestBody Besoins updatedBesoin) throws Exception {

        // Appeler le service pour mettre à jour le besoin et son profil
        return societeServices.updateBesoinAndProfil(societeId, updatedBesoin);
    }


    // Endpoint pour créer un besoin en associant une société par ID
    @PostMapping("/createBesoinAndAdsignToSociete/{societeId}")
    public Besoins createBesoin(
            @RequestBody Besoins besoin,  // Le besoin passé dans le corps de la requête
            @PathVariable Integer societeId) throws Exception {  // L'ID de la société
            // Appeler le service pour créer le besoin et l'associer à la société
            return societeServices.createBesoinAndAssignToSociete(besoin, societeId);
    }



    @DeleteMapping("/delete/{besoinId}")
    public ResponseEntity<String> deleteBesoin(@PathVariable Integer besoinId) {
        try {
            // Appel du service pour supprimer le besoin
            societeServices.deleteBesoinFromSociete(besoinId);

            // Retour d'une réponse de succès
            return ResponseEntity.status(200).body("Besoin supprimé avec succès.");
        } catch (Exception e) {
            // Gestion des erreurs et renvoi d'un message d'erreur
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur lors de la suppression du besoin : " + e.getMessage());
        }
    }

}
