import { Component } from '@angular/core';
import {AvatarModule} from "primeng/avatar";
import {CardModule} from "primeng/card";
import {ChipModule} from "primeng/chip";
import {DividerModule} from "primeng/divider";
import {MenubarModule} from "primeng/menubar";
import {NgForOf, NgIf} from "@angular/common";
import {TabViewModule} from "primeng/tabview";
import {Candidat} from "../../../demo/models/condidat";
import {ActivatedRoute} from "@angular/router";
import {CandidatService} from "../../../demo/service/candidat.service";

@Component({
  selector: 'app-candidat-profile',
  standalone: true,
    imports: [
        AvatarModule,
        CardModule,
        ChipModule,
        DividerModule,
        MenubarModule,
        NgForOf,
        NgIf,
        TabViewModule
    ],
  templateUrl: './candidat-profile.component.html',
  styleUrl: './candidat-profile.component.scss'
})
export class CandidatProfileComponent {

    candidat: Candidat | null = null;
    menuItems = [
        {label: 'HOME', icon: 'pi pi-home'},
        {label: 'ABOUT', icon: 'pi pi-user'},
        {label: 'SKILLS', icon: 'pi pi-chart-bar'},
        {label: 'RESUME', icon: 'pi pi-file'},
        {label: 'PORTFOLIO', icon: 'pi pi-images'},
        {label: 'CONTACT', icon: 'pi pi-envelope'}
    ];

    // Objects to hold filtered technologies that the candidate knows
    webFrontSkills: string[] = [];
    webBackSkills: string[] = [];
    apiSkills: string[] = [];
    devOpsSkills: string[] = [];
    mobileSkills: string[] = [];
    blockchainSkills: string[] = [];
    iaSkills: string[] = [];
    iotSkills: string[] = [];
    lowCodeSkills: string[] = [];

    technicalSkills = [];
    professionalSkills = [];

    constructor(
        private route: ActivatedRoute,
        private candidatService: CandidatService
    ) {}

    ngOnInit(): void {
        // Capture the candidate ID from the route parameters
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                const candidateId = +id;  // Convert the string id to a number
                this.getCandidatData(candidateId);  // Fetch the candidate data using the id
            }
        });
    }

    // Method to fetch candidate data by ID
    getCandidatData(id: number): void {
        this.candidatService.getCandidatById(id).subscribe({
            next: (response: Candidat) => {
                this.candidat = response;
                this.populateSkills();  // Populate skills once data is retrieved
            },
            error: (err) => {
                console.error('Error fetching candidate data:', err);
            }
        });
    }

    // Populate the candidate's skills by filtering technologies from enums
    populateSkills(): void {
        if (this.candidat) {

        }
    }

    // Method to filter candidate's technologies based on the enum
    filterTechnologies(candidateTechnologies: any[], technologyEnum: any): string[] {
        if (!candidateTechnologies || candidateTechnologies.length === 0) {
            return [];
        }

        // Return a list of technologies that match the enum values
        return candidateTechnologies.map(tech => technologyEnum[tech]).filter(Boolean);
    }

}
