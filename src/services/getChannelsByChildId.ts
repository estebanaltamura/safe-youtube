import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import { Channel } from 'types';

const getChannelsByChildId = async (childId: string): Promise<Channel[]> => {
  try {
    // Obtén la referencia a la colección 'channels'
    const channelsCollection = collection(db, 'channels');

    // Crea una consulta que filtre los documentos por 'childId'
    const q = query(channelsCollection, where('childId', '==', childId));

    // Ejecuta la consulta
    const querySnapshot = await getDocs(q);

    // Mapea los resultados a un array de objetos Channel
    const channels: Channel[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        channelId: data.channelId,
        name: data.name,
        thumbnail: data.thumbnail,
        childId: data.childId,
      };
    });

    return channels;
  } catch (error) {
    console.error('Error al obtener los canales:', error);
    return [];
  }
};

export default getChannelsByChildId;
