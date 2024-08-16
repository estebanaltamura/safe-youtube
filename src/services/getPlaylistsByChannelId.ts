import axios from 'axios';
import { Playlist } from 'types';

interface PlaylistResponse {
  playlists: Playlist[];
  nextPageToken: string | null;
}

export const getPlaylistsByChannelId = async (
  channelId: string,
  pageToken: string | null = null,
): Promise<PlaylistResponse> => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlists', {
      params: {
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
        channelId: channelId,
        part: 'snippet,contentDetails',
        maxResults: 50,
        pageToken: pageToken || '', // Incluye el pageToken si está disponible
      },
    });

    // Mapear los datos de las playlists
    const playlists = response.data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      itemCount: item.contentDetails.itemCount,
    }));

    return {
      playlists,
      nextPageToken: response.data.nextPageToken || null, // Devuelve el nextPageToken si existe
    };
  } catch (error) {
    console.error('Error al obtener las listas de reproducción del canal:', error);
    return { playlists: [], nextPageToken: null };
  }
};
