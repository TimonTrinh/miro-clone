
import { Loader } from "lucide-react";

export const Loading = () => {
    return (
        <main className="h-full w-full relative flex items-center justify-center bg-neutral-100 touch-none">
            <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
        </main>
    );
}