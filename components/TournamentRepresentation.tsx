import { Match } from "../utils/matches";
import { Tournament } from "../utils/tournaments";

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
