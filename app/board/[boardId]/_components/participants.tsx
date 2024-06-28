
interface ParticipantsProps {
    boardId: string;
}

export const Participants = ({
    boardId
}:ParticipantsProps) => {
    return (
        <div className="absolute h-12 top-2 right-2 rounded-md p-3 flex items-center shadow-md bg-white">
            List of participants
        </div>
    );
}