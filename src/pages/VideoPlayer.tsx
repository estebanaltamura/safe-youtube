import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';

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

  useEffect(() => {
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
          fs: 0, // Pantalla completa deshabilitada
          disablekb: 1,
          iv_load_policy: 3,
          playsinline: 1,
        },
      });
    };

    loadYouTubeAPI();
  }, [videoId]);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          background: '#000',
          position: 'relative',
          top: '48px',
          height: 'calc(100vh - 48px)', // Máxima altura del video menos barra de navegación
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

        {/* Capa transparente que evita clics en el video pero deja libres los controles */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 'calc(100vh - 64px - 50px)', // Deja 50px para los controles
            backgroundColor: 'rgba(0, 0, 0, 0)', // Capa completamente transparente
            zIndex: 2, // Asegurarnos de que esté sobre el video
            pointerEvents: 'auto', // Permitir interacción con esta capa
          }}
          onClick={(e) => e.stopPropagation()} // Evitar que los clics pasen al video
        />
      </Box>
    </>
  );
};

export default VideoPlayer;
