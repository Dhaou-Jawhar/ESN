export class Segment {
    id?: number;
    segmentKey: string = '';
    segmentValue: string = '';
    statistiquesProfilId?: number;  // L'ID du StatistiquesProfil auquel ce segment appartient

    constructor(init?: Partial<Segment>) {
        Object.assign(this, init);
    }
}
