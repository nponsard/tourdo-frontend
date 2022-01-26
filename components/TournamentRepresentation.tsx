import { Match } from "../types/matches";
import { Tournament } from "../types/tournaments";

const TournamentRepresentation = ({
    matches,
    tournament,
}: {
    tournament: Tournament;
    matches: Match[] | undefined;
}) => {
    if (!matches) return <div>Loading...</div>;

    return <></>;
};

export default TournamentRepresentation;
