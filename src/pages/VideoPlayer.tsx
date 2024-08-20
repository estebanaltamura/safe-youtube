import React, { useEffect, useRef, useState } from 'react';
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
  const [player, setPlayer] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(false);
  const iframeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const loadYouTubeAPI = () => {
      // Si la API de YouTube ya está cargada, inicializar directamente
      if (window.YT && window.YT.Player) {
        initializePlayer();
      } else {
        // Cargar la API de YouTube si no está cargada
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(script);

        // Inicializar el reproductor cuando la API esté lista
        window.onYouTubeIframeAPIReady = () => {
          initializePlayer();
        };
      }
    };

    const initializePlayer = () => {
      const newPlayer = new window.YT.Player(iframeRef.current, {
        videoId: videoId,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
          fs: 1,
          disablekb: 1,
          iv_load_policy: 3,
          playsinline: 1,
        },
      });
      setPlayer(newPlayer);
    };

    loadYouTubeAPI();

    return () => {
      player?.destroy();
    };
  }, [videoId]);

  const onPlayerReady = (event: any) => {
    event.target.playVideo();
  };

  const onPlayerStateChange = (event: any) => {
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        setIsPaused(false);
        break;
      case window.YT.PlayerState.PAUSED:
        setIsPaused(true);
        break;
      case window.YT.PlayerState.ENDED:
        setIsPaused(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Button
        startIcon={<KeyboardArrowLeftOutlinedIcon sx={{ position: 'relative', top: '-1px' }} />}
        sx={{
          position: 'fixed',
          top: '12px',
          left: '50%',
          fontSize: '16px',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          color: 'white',
        }}
        onClick={handleBackClick}
      >
        Volver
      </Button>

      <Box
        sx={{
          width: '100%',
          background: '#000',
          position: 'relative',
          height: 'calc(100vh - 64px)', // Máxima altura del video
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

        {/* Superposición que se mostrará cuando el video esté pausado */}
        {isPaused && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 'calc(100vh - 64px - 34px)', // Deja 50px para los controles
              backgroundColor: 'black', // Fondo negro pleno
              backgroundImage: `url(${thumbnailUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 2, // Asegurarnos de que esté sobre el video pero bajo los controles
              pointerEvents: 'none', // Permitir interacción con los controles de YouTube
            }}
          />
        )}
      </Box>
    </>
  );
};

export default VideoPlayer;
