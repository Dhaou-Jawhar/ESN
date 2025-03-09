export class Technologie {
    id?: number;
    technoKey: string = '';
    technoValue: string = '';
    statistiquesProfilId?: number;  // L'ID du StatistiquesProfil auquel cette technologie appartient

    constructor(init?: Partial<Technologie>) {
        Object.assign(this, init);
    }
}
