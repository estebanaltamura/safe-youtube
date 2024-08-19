import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import ChannelList from 'pages/ChannelList';
import ChannelDetail from 'pages/ChannelDetail';
import PlayListDetail from 'pages/PlayListDetail';
import VideoPlayer from 'pages/VideoPlayer';
import AuthGuard from 'guard/authGuard';
import { AppBar, Toolbar, Button, Typography, useMediaQuery } from '@mui/material';
import { useUser } from 'contexts/userContext';
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import { Playlist, Video } from 'types';
import Landing from 'pages/Landing';

function App() {
  // Estados para el canal, video y playlist seleccionados
  const [selectedChannel, setSelectedChannel] = useState<{ id: string; name: string } | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  const isMobile = useMediaQuery('(max-width: 600px)'); // Usamos estado para determinar si el dispositivo es móvil

  const { user, loading, setUser } = useUser();
  const auth = getAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      if (isMobile) {
        await signInWithRedirect(auth, provider); // Usamos signInWithRedirect en móviles
      } else {
        const result = await signInWithPopup(auth, provider); // Usamos signInWithPopup en desktops
        const user = result.user;

        setUser(user);
        console.log('Login exitoso:', user);
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    if (loading) return; // No hacer nada mientras loading es true

    if (user) {
      // Lógica para navegar basándonos en el estado de selección
      if (!selectedChannel) {
        navigate('/channel-list');
      } else if (selectedChannel && !selectedPlaylist && !selectedVideo) {
        navigate(`/channel-detail/${selectedChannel.id}/${selectedChannel.name}`);
      } else if (selectedChannel && selectedPlaylist && !selectedVideo) {
        navigate(`/playlist-detail/${selectedPlaylist.id}`);
      } else if (selectedChannel && selectedVideo) {
        navigate(`/videoPlayer/${selectedChannel.id}/videos/${selectedVideo.id}`);
      }
    } else {
      navigate('/login');
    }
  }, [selectedChannel, selectedPlaylist, selectedVideo, navigate, user, loading]);

  useEffect(() => {
    if (selectedVideo) {
      setSelectedPlaylist(null);
    }
  }, [selectedVideo]);

  useEffect(() => {
    const auth = getAuth();
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
          console.log('Login exitoso después de redirección:', result.user);
        }
      })
      .catch((error) => {
        console.error('Error al manejar el resultado de la redirección:', error);
      });
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SAFE YOUTUBE
          </Typography>
          {!user ? (
            <Button color="inherit" onClick={handleGoogleLogin}>
              Login
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<Navigate to="/channel-list" />} />
        <Route path="/login" element={<Landing />} />
        <Route
          path="/channel-list"
          element={
            <AuthGuard>
              <ChannelList onSelectChannel={setSelectedChannel} />
            </AuthGuard>
          }
        />
        <Route
          path="/channel-detail/:channelId/:channelName"
          element={
            <AuthGuard>
              <ChannelDetail
                setSelectedPlaylist={setSelectedPlaylist}
                setSelectedChannel={setSelectedChannel}
                setSelectedVideo={setSelectedVideo}
              />
            </AuthGuard>
          }
        />
        <Route
          path="/playlist-detail/:playlistId"
          element={
            <AuthGuard>
              <PlayListDetail
                setSelectedPlaylist={setSelectedPlaylist}
                selectedPlaylist={selectedPlaylist}
                setSelectedVideo={setSelectedVideo}
              />
            </AuthGuard>
          }
        />
        <Route
          path="/videoPlayer/:channelId/videos/:videoId"
          element={
            <AuthGuard>
              <VideoPlayer setSelectedVideo={setSelectedVideo} selectedVideo={selectedVideo} />
            </AuthGuard>
          }
        />
      </Routes>
    </>
  );
}

export default App;
