import axios from 'axios';
import { Video } from 'types';

export const getVideosDetails = async (videoIds: string[]): Promise<Video[]> => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
        id: videoIds.join(','),
        part: 'snippet,contentDetails,statistics',
      },
    });
    console.log(videoIds);

    return response.data.items.map((item: any) => {
      const duration = item.contentDetails.duration;
      const viewCount = item.statistics.viewCount;

      // Obtener la miniatura en la mayor resolución posible
      const thumbnail =
        item.snippet.thumbnails.maxres?.url ||
        item.snippet.thumbnails.standard?.url ||
        item.snippet.thumbnails.high.url;

      return {
        id: item.id,
        title: item.snippet.title,
        thumbnail, // Miniatura en Full HD si está disponible
        publishedAt: item.snippet.publishedAt,
        duration,
        viewCount,
      };
    });
  } catch (error) {
    console.error('Error al obtener detalles del video:', error);
    return [];
  }
};
