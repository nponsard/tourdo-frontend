import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Match } from "../utils/matches";
import { Team } from "../utils/teams";

export default function TeamSelector(props: {
    teams: Team[];
    match: Match;
    setMatch: (match: Match) => void;
    position: "team1ID" | "team2ID";
}) {
    const opposite = props.position === "team1ID" ? "team2ID" : "team1ID";

    const available = props.teams.filter((team) => {
        return team.id !== props.match[opposite];
    });
    console.log("teams :", props.teams);
    console.log("available :", available);

    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{props.position}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
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
                    console.log("team :", team);

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
