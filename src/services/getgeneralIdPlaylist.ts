import axios from 'axios';

export const getGeneralPlaylistId = async (channelId: string): Promise<string | null> => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
        id: channelId,
        part: 'contentDetails',
      },
    });

    const uploadPlaylistId = response.data.items[0].contentDetails.relatedPlaylists.uploads;
    return uploadPlaylistId;
  } catch (error) {
    console.error('Error al obtener la lista de reproducción de subidas:', error);
    return null;
  }
};
