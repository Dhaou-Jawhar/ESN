package nesstechnologies.fr.applicationesnbackend.controleurs.Actions;

import lombok.RequiredArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.dto.ActionsSimpleDTO;
import nesstechnologies.fr.applicationesnbackend.dto.BesoinsDTO;
import nesstechnologies.fr.applicationesnbackend.dto.CandidatForActionsDTO;
import nesstechnologies.fr.applicationesnbackend.entities.Actions;
import nesstechnologies.fr.applicationesnbackend.services.Actions.ActionsServices;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/actions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ActionsController {
    private final ActionsServices actionsServices;


    @PostMapping("/addActionToClient/{clientId}")
    public ResponseEntity<Actions> addActionAndAssignToClient(
            @PathVariable("clientId") int clientId,
            @RequestBody Actions action) {
        try {
            Actions savedAction = actionsServices.AddActionAndAssignToClient(clientId, action);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAction);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PostMapping("/addActionToCandidat/{candidatId}")
    public ActionsSimpleDTO addActionAndAssignToCandidat(
            @PathVariable("candidatId") int candidatId,
            @RequestBody Actions action) {
            return actionsServices.AddActionAndAssignToCandidat(candidatId, action);

    }



    @GetMapping("/getAllActions")
    public Page<ActionsSimpleDTO> getAllActions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return actionsServices.getAllActions(page, size);
    }

    @GetMapping("/getAllCandidatsActions")
    public Page<CandidatForActionsDTO> getAllCandidatsActions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return actionsServices.getAllCandidatsActions(page, size);
    }

    @GetMapping("/getAction/{id}")
    public Actions getCandidatById(@PathVariable int id) {

        return actionsServices.getActionById(id);
    }


    @GetMapping("/getAllBesoinsActions")
    public Page<BesoinsDTO> getAllBesoinsActions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return actionsServices.getAllBesoinsActions(page, size);
    }


    @PutMapping("/updateAction/{id}")
    public ResponseEntity<Actions> updateAction(@PathVariable int id, @RequestBody Actions action) {
        try {
            Actions updatedAction = actionsServices.updateAction(id, action);
            return ResponseEntity.ok(updatedAction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/removeAction/{id}")
    public void deleteAction(@PathVariable int id) {
        actionsServices.deleteAction(id);
    }

}
