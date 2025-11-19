import { useManagerPersistentStore } from "@/app/stores/managerStores";
import { getSetById } from "@/lib/dbFunctions";

// Add Set

// Update Set Data
export const updateCurrentSet = async (id: number) => {
    const updatedSet = await getSetById(id)
    useManagerPersistentStore.getState().setCurrentSet(updatedSet[0])
}

// Delete Set
