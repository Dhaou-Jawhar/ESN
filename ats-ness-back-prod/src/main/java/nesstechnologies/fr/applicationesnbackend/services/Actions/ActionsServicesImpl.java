package nesstechnologies.fr.applicationesnbackend.services.Actions;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import nesstechnologies.fr.applicationesnbackend.dto.ActionsSimpleDTO;
import nesstechnologies.fr.applicationesnbackend.dto.BesoinsDTO;
import nesstechnologies.fr.applicationesnbackend.dto.CandidatForActionsDTO;
import nesstechnologies.fr.applicationesnbackend.entities.*;
import nesstechnologies.fr.applicationesnbackend.mapper.EntitiesMapper;
import nesstechnologies.fr.applicationesnbackend.repositories.ActionsRepository;
import nesstechnologies.fr.applicationesnbackend.repositories.BesoinsRepository;
import nesstechnologies.fr.applicationesnbackend.repositories.ClientRepository;
import nesstechnologies.fr.applicationesnbackend.repositories.candidatRepository;
import nesstechnologies.fr.applicationesnbackend.services.Authentication.AuthenticationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ActionsServicesImpl implements ActionsServices {
    private final ClientRepository clientRepository;
    private final candidatRepository candRepository;
    private final ActionsRepository actionsRepository;
    private final BesoinsRepository besoinsRepository;
    private final AuthenticationService authenticationService;
    private final EntitiesMapper entitiesMapper;
    @PersistenceContext
    private EntityManager entityManager;
    public ActionsServicesImpl(ClientRepository clientRepository, candidatRepository candRepository, ActionsRepository actionsRepository, BesoinsRepository besoinsRepository, AuthenticationService authenticationService, EntitiesMapper entitiesMapper) {
        this.clientRepository = clientRepository;
        this.candRepository = candRepository;
        this.actionsRepository = actionsRepository;
        this.besoinsRepository = besoinsRepository;
        this.authenticationService = authenticationService;
        this.entitiesMapper = entitiesMapper;
    }

    @Override
    public Actions AddActionAndAssignToClient(int id, Actions action) {
        utilisateur u = authenticationService.currentlyAuthenticatedUser();
        String username = u.getNom()+" "+u.getPrenom();
        Client client = clientRepository.findById(id).get();
        String personneConcernee = client.getNom()+" "+client.getPrenom()+" : "+client.getPoste();
        List<Actions> clientActions = client.getActions();
        action.setEtatPersonneConcerne(personneConcernee);
        clientActions.add(action);
        clientRepository.save(client);
        action.setClient(client);
        action.setManager(username);
        if(action.getActionPour()==null){
            action.setActionPour("Client/Prospection");
        }

        action.setDateDeCreation(LocalDateTime.now());
        action.setDateMiseAJour(LocalDateTime.now());
        return actionsRepository.save(action);
    }



    @Override
    @Transactional
    public ActionsSimpleDTO AddActionAndAssignToCandidat(int id, Actions action) {
        try {
            utilisateur u = authenticationService.currentlyAuthenticatedUser();
            String username = u.getNom() + " " + u.getPrenom();

            Candidat candidat = candRepository.findById(id).orElseThrow(() ->
                    new EntityNotFoundException("Candidat avec ID " + id + " non trouvé.")
            );

            // Si un besoin est associé à l'action, vérifier qu'il existe et le récupérer
            if (action.getBesoin() != null) {
                Besoins besoin = besoinsRepository.findById(action.getBesoin().getId())
                        .orElseThrow(() -> new EntityNotFoundException("Besoin non trouvé"));
                System.err.println("Besoin récupéré : " + besoin); // Log pour vérifier
                action.setBesoin(besoin);
            }

            String personneConcernee = candidat.getNom() + " " + candidat.getPrenom() + " : " + candidat.getTitre();
            action.setEtatPersonneConcerne(personneConcernee);
            action.setCandidat(candidat);
            action.setManager(username);
            action.setDateDeCreation(LocalDateTime.now());
            action.setDateMiseAJour(LocalDateTime.now());

            // Sauvegarder l'action
            action = actionsRepository.saveAndFlush(action); // Forcer la synchronisation

            // Ajouter l'action au candidat et sauvegarder
            if (candidat.getActions() == null) {
                candidat.setActions(new ArrayList<>());
            }
            if (action.getActionPour() == null) {
                action.setActionPour("Candidat/Ressource");
            }
            candidat.getActions().add(action);
            candRepository.save(candidat);

            return mapToDto(action);

        } catch (Exception e) {
            throw new RuntimeException("Erreur dans AddActionAndAssignToCandidat : " + e.getMessage(), e);
        }
    }

    @Override
    public Actions getActionById(int id) {
        return actionsRepository.findById(id).get();
    }

    private ActionsSimpleDTO mapToDto(Actions action) {
        ActionsSimpleDTO dto = new ActionsSimpleDTO();
        dto.setId(action.getId());
       // dto.setEtatPersonneConcerne(action.getEtatPersonneConcerne());
        dto.setManager(action.getManager());
       // dto.setDateDeCreation(action.getDateDeCreation());
        dto.setDateMiseAJour(action.getDateMiseAJour());
        dto.setActionPour(action.getActionPour());
        return dto;
    }


    @Override
    public Page<ActionsSimpleDTO> getAllActions(int page, int size) {
        // Création de la pagination avec les paramètres page et size
        Pageable pageable = PageRequest.of(page, size);

        // Récupération de la page d'actions
        Page<Actions> actionsPage = actionsRepository.findAll(pageable);

        // Mapping des entités Actions en ActionsSimpleDTO
        Page<ActionsSimpleDTO> actionsDTOPage = actionsPage.map(entitiesMapper::toActionsSimpleDTO);

        return actionsDTOPage;
    }

    @Override
    public Page<CandidatForActionsDTO> getAllCandidatsActions(int page, int size) {
        // Création de la pagination avec les paramètres page et size
        Pageable pageable = PageRequest.of(page, size);

        // Récupération de la page d'actions
        Page<Candidat> candidatPage = candRepository.findAll(pageable);

        // Mapping des entités Actions en ActionsSimpleDTO
        Page<CandidatForActionsDTO> candidatDTOPage = candidatPage.map(entitiesMapper::toCandidatForActionsDTO);

        return candidatDTOPage;    }

    @Override
    public Page<BesoinsDTO> getAllBesoinsActions(int page, int size) {
        // Création de la pagination avec les paramètres page et size
        Pageable pageable = PageRequest.of(page, size);

        // Récupération de la page d'actions
        Page<Besoins> besoinsPage = besoinsRepository.findAll(pageable);

        // Mapping des entités Actions en ActionsSimpleDTO
        Page<BesoinsDTO> besoinDTOPage = besoinsPage.map(entitiesMapper::toBesoinsDTO);

        return besoinDTOPage;      }

    @Override
    @Transactional
    public Actions updateAction(int id, Actions action) {
        try {
            // Vérifier si l'action existe
            Actions existingAction = actionsRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Action avec ID " + id + " non trouvée."));

            // Vérifier si le candidat associé existe (si applicable)
            if (action.getCandidat() != null && action.getCandidat().getId() != null) {
                Candidat candidat = candRepository.findById(action.getCandidat().getId())
                        .orElseThrow(() -> new EntityNotFoundException("Candidat avec ID " + action.getCandidat().getId() + " non trouvé."));
                existingAction.setCandidat(candidat);
            }

            // Vérifier si le besoin existe (si applicable)
            if (action.getBesoin() != null && action.getBesoin().getId() != null) {
                Besoins besoin = besoinsRepository.findById(action.getBesoin().getId())
                        .orElseThrow(() -> new EntityNotFoundException("Besoin avec ID " + action.getBesoin().getId() + " non trouvé."));
                existingAction.setBesoin(besoin);
            }

            // Mettre à jour les autres informations de l'action
            existingAction.setCommentaires(action.getCommentaires());
            existingAction.setDateDeCreation(action.getDateDeCreation() != null ? action.getDateDeCreation() : existingAction.getDateDeCreation());
            existingAction.setDateMiseAJour(LocalDateTime.now()); // Mettre à jour la date de mise à jour
            existingAction.setType(action.getType());
            existingAction.setRelance(action.isRelance());
            existingAction.setProchainRdvPlanifie(action.isProchainRdvPlanifie());
            existingAction.setDateProchainRdvPlanifie(action.getDateProchainRdvPlanifie());
            // Sauvegarder les modifications de l'action
            return actionsRepository.save(existingAction);

        } catch (Exception e) {
            throw new RuntimeException("Erreur dans updateAction : " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void deleteAction(int id) {
        Actions actions = actionsRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("Action with ID " + id + " not found"));

        // Dissocier les relations bidirectionnelles (si existantes)
        if (actions.getClient() != null) {
            actions.getClient().getActions().remove(actions);
            actions.setClient(null);
        }

        if (actions.getBesoin() != null) {
            actions.getBesoin().getActions().remove(actions);
            actions.setBesoin(null);
        }

        if (actions.getCandidat() != null) {
            actions.getCandidat().getActions().remove(actions);
            actions.setCandidat(null);
        }

        // Supprimer l'entité
        actionsRepository.delete(actions);
    }




}
