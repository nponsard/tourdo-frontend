export interface Match {
    id: number;
    team1ID: number | null;
    team2ID: number | null;
    row: number;
    column: number;
    tournamentID: number;
    status: MatchStatus;
    date: string | null;
}
export enum MatchStatus {
    Created = 0,
    Team1Won = 1,
    Team2Won = 2,
    Draw = 3,
    Canceled = 4,
    Started = 5,
}
