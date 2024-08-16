import React, { Dispatch, useCallback, useEffect, useState } from 'react';

import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import VideoListContainer from 'components/VideoListContainer';
import { useParams } from 'react-router-dom';
import { getVideosDetails } from 'services/getVideosDetails';
import { getVideosIdFromPlaylistId } from 'services/getVideosIdFromPlaylistId';
import { Playlist, Video } from 'types';

interface PlayListDetailProps {
  setSelectedPlaylist: (playlist: Playlist | null) => void;
  selectedPlaylist: Playlist | null;
  setSelectedVideoId: Dispatch<React.SetStateAction<string | null>>;
}

const PlayListDetail: React.FC<PlayListDetailProps> = ({
  setSelectedPlaylist,
  selectedPlaylist,
  setSelectedVideoId,
}) => {
  const { playlistId } = useParams();

  const [isFetching, setIsFetching] = useState(false);
  const [generalVideos, setGeneralVideos] = useState<Video[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleScroll = useCallback(
    async (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      if (scrollTop + clientHeight >= scrollHeight * 0.9 && !isFetching && nextPageToken && playlistId) {
        setIsFetching(true);
        await fetchVideos(nextPageToken);
        setIsFetching(false);
      }
    },
    [playlistId, nextPageToken, isFetching],
  );

  const fetchVideos = async (pageToken: string | null = null) => {
    if (!playlistId) return;

    try {
      const { videosId, nextPageToken: nextPageTokenRes } = await getVideosIdFromPlaylistId(
        playlistId,
        pageToken,
      );

      if (videosId.length > 0) {
        const videoIds = videosId.map((videoId: any) => videoId.id);
        const videosDetails = await getVideosDetails(videoIds);

        setGeneralVideos((prevVideos) => [...prevVideos, ...videosDetails]);
        setNextPageToken(nextPageTokenRes);
      }
    } catch (error) {
      console.error('Error al obtener los videos:', error);
    }
  };

  useEffect(() => {
    if (playlistId) {
      setGeneralVideos([]);
      fetchVideos();
    }
  }, [playlistId]);

  const handleBackClick = () => {
    setSelectedPlaylist(null);
  };

  return (
    <div onScroll={handleScroll} style={{ overflowY: 'auto', height: '100vh' }}>
      <Button
        variant="contained"
        color="primary"
        style={{ margin: isSmallScreen ? '20px 0 0 20px' : '20px 0 0 50px' }}
        onClick={handleBackClick}
      >
        Volver
      </Button>
      <Typography variant="h5" sx={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
        {selectedPlaylist && selectedPlaylist.title}
      </Typography>
      <VideoListContainer videos={generalVideos} setSelectedVideoId={setSelectedVideoId} />
    </div>
  );
};

export default PlayListDetail;
