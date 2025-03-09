export class SousSegment {
    id?: number;
    sousSegmentKey: string = '';
    sousSegmentValue: string = '';
    statistiquesProfilId?: number;  // L'ID du StatistiquesProfil auquel ce sous-segment appartient

    constructor(init?: Partial<SousSegment>) {
        Object.assign(this, init);
    }
}
