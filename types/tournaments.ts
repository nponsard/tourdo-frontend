import { Team } from "./teams";

export enum TournamentType {
    None = 0,
    RoundRobin = 1,
    SimpleElimination = 2,
}

export enum TournamentStatus {
    Created = 0,
    Generated = 1,
    Started = 2,
    Finished = 3,
}

export interface Tournament {
    id: number;
    type: TournamentType;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    max_teams: number;
    game_name: string;
    status: TournamentStatus;
}
export interface TournamentTeam {
    team: Team;
    team_number: number;
}

export const FetchTournament = (id: number): Promise<Tournament> => {
    return fetch(`/api/v1/tournaments/${id}`).then((r) => r.json());
};
