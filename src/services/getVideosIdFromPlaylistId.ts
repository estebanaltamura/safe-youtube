import axios from 'axios';

export const getVideosIdFromPlaylistId = async (
  playlistId: string,
  pageToken: string | null = null,
): Promise<{ videosId: string[] | []; nextPageToken: string | null }> => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
        playlistId: playlistId,
        part: 'snippet',
        maxResults: 20,
        pageToken: pageToken || '',
      },
    });

    const videosId: string[] = response.data.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
    }));

    return {
      videosId,
      nextPageToken: response.data.nextPageToken || null,
    };
  } catch (error) {
    console.error('Error al obtener los videos de la lista de reproducción:', error);
    return { videosId: [], nextPageToken: null };
  }
};
