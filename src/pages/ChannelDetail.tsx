import React, { useEffect, useState, useCallback, Dispatch } from 'react';
import { Typography, Grid, Tabs, Tab, Box, TextField, Button, useTheme, useMediaQuery } from '@mui/material';
import { Playlist, Video } from 'types';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import VideoListContainer from 'components/VideoListContainer';
import { getPlaylistsByChannelId } from 'services/getPlaylistsByChannelId';
import { getGeneralPlaylistId } from 'services/getgeneralIdPlaylist';
import { getVideosIdFromPlaylistId } from 'services/getVideosIdFromPlaylistId';
import { getVideosDetails } from 'services/getVideosDetails';
import PlayListVideoContainer from 'components/PlayListVideosContainer';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';

const ChannelDetail: React.FC = () => {
  const { channelId, channelName } = useParams();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // height of top components
  const heightTopComponents = isSmallScreen ? '100px' : '200px';

  // States para los tabs y datos
  const [tabIndex, setTabIndex] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  // Videos
  const [generalVideos, setGeneralVideos] = useState<Video[]>([]);
  const [videosNextPageToken, setVideosNextPageToken] = useState<string | null>(null);

  // Playlists
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistsNextPageToken, setPlaylistsNextPageToken] = useState<string | null>(null);

  // Cambio de pestañas
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Scroll infinito para playlists
  const handleScrollPlaylists = useCallback(
    async (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const scrollPosition = scrollTop + clientHeight;
      const threshold = scrollHeight * 0.9;

      if (scrollPosition >= threshold && !isFetching && playlistsNextPageToken && tabIndex === 1) {
        setIsFetching(true);
        await fetchPlaylists(playlistsNextPageToken); // Carga más playlists usando el nextPageToken
        setIsFetching(false);
      }
    },
    [playlistsNextPageToken, isFetching, tabIndex],
  );

  // Scroll infinito para videos
  const handleScrollVideos = useCallback(
    async (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const scrollPosition = scrollTop + clientHeight;
      const threshold = scrollHeight * 0.9;

      if (scrollPosition >= threshold && !isFetching && videosNextPageToken && tabIndex === 0) {
        setIsFetching(true);
        await fetchVideos(videosNextPageToken); // Carga más videos usando el nextPageToken
        setIsFetching(false);
      }
    },
    [videosNextPageToken, isFetching, tabIndex],
  );

  // Función para cargar playlists
  const fetchPlaylists = async (pageToken: string | null = null) => {
    if (!channelId) return;

    const fetchedPlaylists = await getPlaylistsByChannelId(channelId, videosNextPageToken);
    setPlaylists((prevPlaylists) => [...prevPlaylists, ...fetchedPlaylists.playlists]);
    setPlaylistsNextPageToken(fetchedPlaylists.nextPageToken);
  };

  // Función para cargar videos
  const fetchVideos = async (pageToken: string | null = null) => {
    if (!channelId) return;

    const playlistId = await getGeneralPlaylistId(channelId);
    if (playlistId) {
      const { videosId, nextPageToken: nextPageTokenRes } = await getVideosIdFromPlaylistId(
        playlistId,
        pageToken,
      );

      if (videosId.length > 0) {
        const videoIds = videosId.map((videoId: any) => videoId.id);
        const videosDetails = await getVideosDetails(videoIds);

        setGeneralVideos((prevVideos) => [...prevVideos, ...videosDetails]);
        setVideosNextPageToken(nextPageTokenRes);
      }
    }
  };

  useEffect(() => {
    if (!channelId) return;

    if (tabIndex === 0) {
      setGeneralVideos([]);
      fetchVideos();
    } else if (tabIndex === 1) {
      setPlaylists([]);
      fetchPlaylists();
    }
  }, [channelId, tabIndex]);

  const handleBackClick = () => {
    navigate('/channel-list');
  };

  return (
    <>
      {/* Input y botón de búsqueda */}
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
        {channelName && decodeURIComponent(channelName)}
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange} centered sx={{ marginBottom: '30px' }}>
        <Tab label="Videos" />
        <Tab label="Playlists" />
      </Tabs>

      {tabIndex === 0 && (
        <Box onScroll={handleScrollVideos} sx={{ overflowY: 'auto', height: 'calc(100vh - 194px)' }}>
          <VideoListContainer videos={generalVideos} />
        </Box>
      )}

      {tabIndex === 1 && (
        <Box onScroll={handleScrollPlaylists} sx={{ overflowY: 'auto', height: 'calc(100vh - 194px)' }}>
          <PlayListVideoContainer playlists={playlists} />
        </Box>
      )}
    </>
  );
};

export default ChannelDetail;
