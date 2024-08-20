import React, { Dispatch, useCallback, useEffect, useState } from 'react';

import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import VideoListContainer from 'components/VideoListContainer';
import { useNavigate, useParams } from 'react-router-dom';
import { getVideosDetails } from 'services/getVideosDetails';
import { getVideosIdFromPlaylistId } from 'services/getVideosIdFromPlaylistId';
import { Playlist, Video } from 'types';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import { Box } from '@mui/system';

const PlayListDetail: React.FC = () => {
  const { playlistId, playlistName } = useParams();

  const [isFetching, setIsFetching] = useState(false);
  const [generalVideos, setGeneralVideos] = useState<Video[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const navigate = useNavigate();

  const theme = useTheme();

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
    console.log('fetchea');
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
    console.log(playlistId);
    if (playlistId) {
      setGeneralVideos([]);
      fetchVideos();
    }
  }, [playlistId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div>
      <Button
        startIcon={<KeyboardArrowLeftOutlinedIcon sx={{ position: 'relative', top: '-1px' }} />}
        sx={{
          position: 'fixed',
          top: '8px',
          left: '50%',
          fontSize: '14px',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          color: 'white',
        }}
        onClick={handleBackClick}
      >
        Volver
      </Button>
      <Typography variant="h5" sx={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
        {playlistName && decodeURIComponent(playlistName)}
      </Typography>
      <Box onScroll={handleScroll} sx={{ overflowY: 'auto', height: 'calc(100vh - 116px)' }}>
        <VideoListContainer videos={generalVideos} />
      </Box>
    </div>
  );
};

export default PlayListDetail;
