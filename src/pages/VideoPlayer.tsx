import React, { Dispatch, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';

interface VideoPlayerProps {
  setSelectedVideoId: Dispatch<React.SetStateAction<string | null>>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ setSelectedVideoId }) => {
  const { videoId } = useParams();
  const [isLandscape, setIsLandscape] = useState(window.screen.orientation.type.includes('landscape'));

  const handleBackClick = () => {
    setSelectedVideoId(null);
  };

  const handleRotateClick = () => {
    const currentOrientation = window.screen.orientation.type;
    if (currentOrientation.includes('landscape')) {
      setIsLandscape(false);
      window.screen.orientation.lock('portrait').catch(() => alert('Lock failed'));
    } else {
      setIsLandscape(true);
      window.screen.orientation.lock('landscape').catch(() => alert('Lock failed'));
    }
  };

  useEffect(() => {
    const handleOrientationChange = () => {
      const newOrientation = window.screen.orientation.type;
      setIsLandscape(newOrientation.includes('landscape'));
    };

    window.screen.orientation.addEventListener('change', handleOrientationChange);

    return () => {
      window.screen.orientation.removeEventListener('change', handleOrientationChange);
    };
  }, []);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        sx={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1000, // Aseguramos que siempre esté sobre el contenido
        }}
        onClick={handleBackClick}
      >
        Volver
      </Button>

      <Button
        variant="contained"
        color="secondary"
        sx={{
          position: 'fixed',
          top: '80px', // Debajo del botón de "Volver"
          left: '20px',
          zIndex: 1000,
        }}
        onClick={handleRotateClick}
      >
        Rotar Pantalla
      </Button>

      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh', // Hace que el contenedor ocupe toda la altura de la pantalla
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: isLandscape ? '100%' : '100%', // Ajuste de tamaño basado en la orientación
            maxWidth: '1200px',
            height: '100%', // Ajusta la altura al 100% del contenedor
            position: 'relative',
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&vq=hd1080`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%', // Asegura que el iframe ocupe el 100% de la altura disponible
            }}
          />
        </Box>
      </Box>
    </>
  );
};

//Forzar cambio
export default VideoPlayer;
