import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Este servicio acepta una lista de objetos con 'channelId' y 'childId'
// y guarda cada registro en la colección 'channel_child' en Firestore.

export const createChannel_ChildFromList = async (
  channelChildList: { channelId: string; childId: string }[],
) => {
  const db = getFirestore(); // Inicializa Firestore
  const collectionRef = collection(db, 'channel_child'); // Apunta a la colección 'channel_child'

  try {
    // Recorre cada registro en la lista y guárdalo en Firestore
    for (const item of channelChildList) {
      await addDoc(collectionRef, {
        channelId: item.channelId,
        childId: item.childId,
      });
    }
    console.log('Todos los registros fueron guardados exitosamente.');
  } catch (error) {
    console.error('Error al guardar los registros en Firestore:', error);
  }
};
