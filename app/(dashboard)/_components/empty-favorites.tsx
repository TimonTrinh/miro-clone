import Image from "next/image";

export const EmptyFavorites = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
        <Image src="/empty-favorites.svg" width={140} height={140} 
        alt={"empty favorites"} />
        <h2 className="text-2xl font-semibold mt-6">No favorite board!</h2>
        <p className="text-muted-foreground text-sm mt-2">Try favoring a board.</p>
    </div>
  )
};