import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import ChannelList from 'pages/ChannelList';
import ChannelDetail from 'pages/ChannelDetail';
import PlayListDetail from 'pages/PlayListDetail';
import { Playlist, Video } from 'types'; // Asume que existe un tipo Playlist
import VideoPlayer from 'pages/VideoPlayer';

function App() {
  // Estados para el canal, video y playlist seleccionados
  const [selectedChannel, setSelectedChannel] = useState<{ id: string; name: string } | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Redirige a la lista de canales si no hay ningún canal seleccionado
    if (!selectedChannel) {
      navigate('/channel-list');
      return;
    }

    // Si hay un canal seleccionado pero no hay playlist ni video, redirige al detalle del canal
    if (selectedChannel && !selectedPlaylist && !selectedVideoId) {
      navigate(`/channel-detail/${selectedChannel.id}/${selectedChannel.name}`);
      return;
    }

    // Si se selecciona una playlist pero no un video, redirige al detalle de la playlist
    if (selectedChannel && selectedPlaylist && !selectedVideoId) {
      navigate(`/playlist-detail/${selectedPlaylist.id}`);
      return;
    }

    // Si se selecciona un video, redirige al detalle del video
    if (selectedChannel && selectedVideoId) {
      navigate(`/videoPlayer/${selectedChannel.id}/videos/${selectedVideoId}`);
    }
  }, [selectedChannel, selectedPlaylist, selectedVideoId, navigate]);

  useEffect(() => {
    // Cuando el usuario vuelve de un video hay que setear a null el videoId seleccionado y con este use efect garantiza que vuelva a la pestaña videos de channel detail
    if (selectedVideoId) {
      setSelectedPlaylist(null);
    }
  }, [selectedVideoId]);

  return (
    <Routes>
      {/* Definimos que el Layout será la ruta principal */}
      {/* Rutas dentro del Layout */}
      <Route path="/" element={<Navigate to="/channel-list" />} />
      <Route path="/channel-list" element={<ChannelList onSelectChannel={setSelectedChannel} />} />
      <Route
        path="/channel-detail/:channelId/:channelName"
        element={
          <ChannelDetail
            setSelectedPlaylist={setSelectedPlaylist}
            setSelectedChannel={setSelectedChannel}
            setSelectedVideoId={setSelectedVideoId}
          />
        }
      />
      <Route
        path="/playlist-detail/:playlistId"
        element={
          <PlayListDetail
            setSelectedPlaylist={setSelectedPlaylist}
            selectedPlaylist={selectedPlaylist}
            setSelectedVideoId={setSelectedVideoId}
          />
        }
      />
      <Route
        path="/videoPlayer/:channelId/videos/:videoId"
        element={<VideoPlayer setSelectedVideoId={setSelectedVideoId} />}
      />
    </Routes>
  );
}

export default App;
