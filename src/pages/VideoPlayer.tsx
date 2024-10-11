import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const VideoPlayer: React.FC = () => {
  const { videoId } = useParams();
  const iframeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const FOUR_HOURS = 240 * 60 * 1000; // 3 segundos para probar (puedes cambiarlo a 4 horas)
  let timeoutId: NodeJS.Timeout;

  // Función para redirigir a Google
  const handleInactivity = () => {
    window.location.href = 'https://www.google.com'; // Redirige a Google
  };

  // Resetea el temporizador cuando hay actividad
  const resetTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(handleInactivity, FOUR_HOURS);
  };

  useEffect(() => {
    // Inicializa el temporizador de inactividad
    timeoutId = setTimeout(handleInactivity, FOUR_HOURS);

    // Escucha eventos de actividad del usuario
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initializePlayer();
      } else {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(script);

        window.onYouTubeIframeAPIReady = () => {
          initializePlayer();
        };
      }
    };

    const initializePlayer = () => {
      new window.YT.Player(iframeRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
          fs: 1, // Pantalla completa deshabilitada
          disablekb: 1,
          iv_load_policy: 3,
          playsinline: 1,
        },
      });
    };

    loadYouTubeAPI();

    // Limpieza: elimina los event listeners y el temporizador cuando el componente se desmonta
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [videoId]);

  return (
    <Box sx={{ height: '100vh', backgroundColor: '#000' }}>
      <Box
        sx={{
          width: '100%',
          background: '#000',
          position: 'relative',
          top: '48px',
          height: isMobile ? 'calc(90vh - 48px)' : 'calc(100vh - 48px)', // Máxima altura del video menos barra de navegación
        }}
      >
        <div
          ref={iframeRef}
          id="player"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        ></div>
      </Box>
    </Box>
  );
};

export default VideoPlayer;
