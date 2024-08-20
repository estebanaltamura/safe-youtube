import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import { Channel } from 'types';

const getChannelsByChildId = async (childId: string): Promise<Channel[]> => {
  try {
    const db = getFirestore();

    // 1. Obtener los channelIds de la tabla 'channel_child'
    const channelChildCollection = collection(db, 'channel_child');
    const q1 = query(channelChildCollection, where('childId', '==', childId));
    const channelChildSnapshot = await getDocs(q1);

    const channelIds = channelChildSnapshot.docs.map((doc) => doc.data().channelId);

    // Si no hay channelIds asociados, devolvemos un array vacío
    if (channelIds.length === 0) {
      return [];
    }

    // 2. Consulta a 'channels' en lotes de 30 channelIds
    const channelsCollection = collection(db, 'channels');
    const channels: Channel[] = [];

    // Dividimos los channelIds en lotes de 30
    const batchSize = 30;
    for (let i = 0; i < channelIds.length; i += batchSize) {
      const batchIds = channelIds.slice(i, i + batchSize);
      const q2 = query(channelsCollection, where('channelId', 'in', batchIds));
      const channelsSnapshot = await getDocs(q2);

      // Mapeamos los resultados y los añadimos al array 'channels'
      channelsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        channels.push({
          channelId: data.channelId,
          name: data.name,
          thumbnail: data.thumbnail,
          // Otras propiedades de 'Channel' si es necesario
        });
      });
    }

    return channels;
  } catch (error) {
    console.error('Error al obtener los canales:', error);
    return [];
  }
};

export default getChannelsByChildId;
