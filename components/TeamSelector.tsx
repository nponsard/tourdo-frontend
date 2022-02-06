import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Match } from "../utils/matches";
import { Team } from "../utils/teams";

export default function TeamSelector(props: {
    teams: Team[];
    match: Match;
    setMatch: (match: Match) => void;
    position: "team1_id" | "team2_id";
}) {
    const opposite = props.position === "team1_id" ? "team2_id" : "team1_id";

    const available = props.teams.filter((team) => {
        return team.id !== props.match[opposite];
    });

    return (
        <FormControl fullWidth>
            <InputLabel >{props.position}</InputLabel>
            <Select
                value={props.match[props.position] === null ? -1 : props.match[props.position]}
                label={props.position}
                onChange={(e) => {
                    props.setMatch({
                        ...props.match,
                        [props.position]: e.target.value,
                    });
                }}
            >
                <MenuItem value={-1}>TBD</MenuItem>

                {available.map((team) => {

                    return (
                        <MenuItem key={team.id} value={team.id}>
                            {props.teams.find((t) => t.id === team.id)?.name}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}
