export enum Role {
    PLAYER = 0,
    LEADER = 1,
    COACH = 2,
}

export interface Team {
    id: number;
    name: string;
    description: string;
    match_count: number;
    win_count: number;
}
export interface TeamMember {
    user_id: number;
    team_id: number;
    role: Role;
}
