import { getFirestore, collection, addDoc } from '@firebase/firestore';
import { Channel } from 'types'; // Asegúrate de que este import sea correcto

/**
 * Guarda múltiples canales en Firestore.
 * @param channels Array de objetos tipo Channel que contiene la información de los canales a guardar.
 * @returns Promise que se resuelve cuando todos los canales han sido guardados correctamente.
 */
const createChannelsFromList = async (channels: Channel[]): Promise<void> => {
  const db = getFirestore();
  const channelsCollection = collection(db, 'channels');

  try {
    const promises = channels.map(async (channel) => {
      // Guardar cada canal en Firestore
      await addDoc(channelsCollection, {
        channelId: channel.channelId,
        name: channel.name,
        thumbnail: channel.thumbnail,
      });
    });

    // Esperar a que todas las promesas se completen
    await Promise.all(promises);

    console.log('Todos los canales se han guardado correctamente en Firestore.');
  } catch (error) {
    console.error('Error al crear los canales en Firestore:', error);
  }
};

export default createChannelsFromList;
