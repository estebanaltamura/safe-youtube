import React, { Dispatch, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Video } from 'types';

interface VideoPlayerProps {
  setSelectedVideo: Dispatch<React.SetStateAction<Video | null>>;
  selectedVideo: Video | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ setSelectedVideo, selectedVideo }) => {
  const { videoId } = useParams();
  const [videoEnded, setVideoEnded] = useState(false); // Para controlar si el video ha terminado
  const [isPaused, setIsPaused] = useState(false); // Para controlar si el video está en pausa
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleBackClick = () => {
    setSelectedVideo(null);
  };

  useEffect(() => {
    const handlePlayerStateChange = (event: MessageEvent) => {
      const { data } = event;

      console.log('Player state change:', data);
      try {
        const parsedData = JSON.parse(data);
        // Comprobamos si es un evento de cambio de estado del reproductor
        if (parsedData.event === 'onStateChange') {
          switch (parsedData.info) {
            case 1: // Video en reproducción
              setIsPaused(false);
              console.log('Video is playing');
              break;
            case 2: // Video en pausa
              setIsPaused(true);
              console.log('Video is paused');
              break;
            case 0: // Video finalizado
              setVideoEnded(true);
              console.log('Video has ended');
              break;
            default:
              break;
          }
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    // Añadimos el listener para detectar cambios de estado en el video
    window.addEventListener('message', handlePlayerStateChange);

    return () => {
      // Removemos el listener cuando el componente se desmonta
      window.removeEventListener('message', handlePlayerStateChange);
    };
  }, [iframeRef]);

  // useEffect(() => {
  //   // Escuchar mensajes del iframe para detectar el fin del video y pausa
  //   const handleMessage = (event: MessageEvent) => {
  //     const { data } = event;
  //     try {
  //       const parsedData = JSON.parse(data);
  //       if (parsedData.event === 'onStateChange') {
  //         // Video pausado
  //         if (parsedData.info === 2) {
  //           setIsPaused(true);
  //         }
  //         // Video finalizado
  //         if (parsedData.info === 0) {
  //           setVideoEnded(true);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error parsing message:', error);
  //     }
  //   };

  //   window.addEventListener('message', handleMessage);

  //   return () => window.removeEventListener('message', handleMessage);
  // }, []);

  return (
    <>
      <Button
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
        }}
      >
        {/* Mostrar miniatura si el video ha terminado o está pausado */}
        {(videoEnded || isPaused) && selectedVideo && (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              width: '100%',
              height: 'calc(100vh - 64px)',
              backgroundImage: `url(${selectedVideo.thumbnail})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 1,
            }}
          />
        )}

        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${selectedVideo?.id}?autoplay=1&controls=1&rel=0&modestbranding=1&showinfo=0&fs=1&disablekb=1&iv_load_policy=3&playsinline=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
          style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            width: '100%',
            height: 'calc(100vh - 64px)',
            zIndex: 0,
          }}
        />
      </Box>
    </>
  );
};

export default VideoPlayer;
