import { useSelf, useMutation } from "@/liveblocks.config";

export const useDeleteLayers = () => {
    const selection = useSelf((me) => me.presence.selection);
    return useMutation((
        {storage, setMyPresence}
    ) => {
        let liveLayers = storage.get("layers");
        let liveLayerIds = storage.get("layerIds");

        selection!.forEach((layerId) => {
            liveLayers.delete(layerId);
            let index = liveLayerIds.indexOf(layerId);
            if (index !== -1) {
                liveLayerIds.delete(index);
            }
        })
        //Unselect all layers after deletion
        setMyPresence({selection: []}, {addToHistory: true});
    }, [selection]);
}