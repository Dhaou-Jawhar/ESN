package nesstechnologies.fr.applicationesnbackend.controleurs.TechnologyController;

import lombok.AllArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.entities.Technology;
import nesstechnologies.fr.applicationesnbackend.services.Technologie.TechnologieServices;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/technology")
public class TechnologyController {
    private final TechnologieServices technologieServices;

    @PostMapping("addAnRateTechno/{id}/{value}")
    public ResponseEntity<Map<String, String>> addTechnology(
            @PathVariable int id,
            @PathVariable float value,
            @RequestBody Technology techno) {
        try {
            System.err.println("ID: " + id + ", Value: " + value + ", Technology: " + techno);

            technologieServices.addAndRateTechnology(id, value, techno);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Technology added successfully");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }




    @GetMapping("/getRatingByTechnoId/{id}")
    public float getAverageRatingForTechno(@PathVariable("id") int id){
        return technologieServices.getRatingByTechno(id);
    }

    @PostMapping("/updateTechnologyExperience/{id}/{experience}")
    public ResponseEntity<Technology> updateTechnologyExperience(
            @PathVariable int id,
            @PathVariable float experience) {
        try {
            // Appel du service pour mettre à jour l'expérience de la technologie
            Technology updatedTechnology = technologieServices.updateTechnologExperience(id, experience);
            return new ResponseEntity<>(updatedTechnology, HttpStatus.OK);
        } catch (Exception e) {
            // En cas d'erreur, renvoie un message avec le statut BAD_REQUEST
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeTechnology(@PathVariable int id) {
        try {
            technologieServices.removeTechnology(id);
            return new ResponseEntity<>("Technology removed successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

}
