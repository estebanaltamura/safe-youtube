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
  const [selectedChannel, setSelectedChannel] = useState<{ id: string; name: string } | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  const isMobile = useMediaQuery('(max-width: 600px)'); // Verificamos si es un dispositivo móvil

  const { user, loading, setUser } = useUser();
  const auth = getAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      if (isMobile) {
        await signInWithRedirect(auth, provider); // Redireccionar en móviles
        navigate('/channel-list');
      } else {
        const result = await signInWithPopup(auth, provider); // Usar popup en desktops
        setUser(result.user);
        navigate('/channel-list');
        console.log('Login exitoso:', result.user);
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

  // Verificar el resultado de la redirección después de iniciar sesión
  useEffect(() => {
    const fetchRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          setUser(result.user);
          alert('Login exitoso después de redirección:');
        }
      } catch (error) {
        alert('Error al manejar el resultado de la redirección:');
        console.error('Error al manejar el resultado de la redirección:', error);
      }
    };

    fetchRedirectResult();
  }, [auth, setUser]);

  // Navegación automática según la selección
  useEffect(() => {
    if (loading) return; // No hacer nada mientras loading es true

    // if (user) {
    //   if (!selectedChannel) {
    //     navigate('/channel-list');
    //   } else if (selectedChannel && !selectedPlaylist && !selectedVideo) {
    //     navigate(`/channel-detail/${selectedChannel.id}/${selectedChannel.name}`);
    //   } else if (selectedChannel && selectedPlaylist && !selectedVideo) {
    //     navigate(`/playlist-detail/${selectedPlaylist.id}`);
    //   } else if (selectedChannel && selectedVideo) {
    //     navigate(`/videoPlayer/${selectedChannel.id}/videos/${selectedVideo.id}`);
    //   }
    // } else {
    //   navigate('/login');
    // }
  }, [selectedChannel, selectedPlaylist, selectedVideo, navigate, user, loading]);

  useEffect(() => {
    if (selectedVideo) {
      setSelectedPlaylist(null);
    }
  }, [selectedVideo]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SAFE YOUTUBE
          </Typography>
          {/* {!user ? (
            <Button color="inherit" onClick={handleGoogleLogin}>
              Login
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )} */}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<Navigate to="/channel-list" />} />
        {/* <Route path="/login" element={<Landing />} /> */}
        <Route
          path="/channel-list"
          element={
            // <AuthGuard>
            <ChannelList />
            // </AuthGuard>
          }
        />
        <Route
          path="/channel-detail/:channelId/:channelName"
          element={
            // <AuthGuard>
            <ChannelDetail />
            // </AuthGuard>
          }
        />
        <Route
          path="/playlist-detail/:playlistId/:playlistName"
          element={
            // <AuthGuard>
            <PlayListDetail />
            // </AuthGuard>
          }
        />
        <Route
          path="/videoPlayer/:videoId"
          element={
            // <AuthGuard>
            <VideoPlayer />
            // </AuthGuard>
          }
        />
      </Routes>
    </>
  );
}

export default App;
