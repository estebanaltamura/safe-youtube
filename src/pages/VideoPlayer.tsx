import React, { Dispatch, useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';

interface VideoPlayerProps {
  setSelectedVideoId: Dispatch<React.SetStateAction<string | null>>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ setSelectedVideoId }) => {
  const { videoId } = useParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleBackClick = () => {
    setSelectedVideoId(null);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      iframeRef.current?.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      setIsPlaying(false);
    } else {
      iframeRef.current?.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      setIsPlaying(true);
    }
  };

  const enableEnglishSubtitles = () => {
    iframeRef.current?.contentWindow?.postMessage(
      '{"event":"command","func":"setOption","args":["captions", "track", {"languageCode": "en"}]}',
      '*',
    );
  };

  const enableSpanishSubtitles = () => {
    iframeRef.current?.contentWindow?.postMessage(
      '{"event":"command","func":"setOption","args":["captions", "track", {"languageCode": "es"}]}',
      '*',
    );
  };

  // Aquí forzamos los subtítulos en inglés al cargar el video
  useEffect(() => {
    const onIframeReady = () => {
      enableEnglishSubtitles();
    };

    // Asegurarnos de que el iframe esté listo para recibir mensajes
    const timer = setTimeout(onIframeReady, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [videoId]);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        sx={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1000,
        }}
        onClick={handleBackClick}
      >
        Volver
      </Button>

      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: 'calc(100vh - 57px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1200px',
            height: '100%',
            position: 'relative',
          }}
        >
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&vq=hd1080&rel=0&modestbranding=1&controls=0&showinfo=0&enablejsapi=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          position: 'fixed',
          bottom: 0,
          padding: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}
      >
        <Button variant="contained" color="secondary" onClick={togglePlayPause} sx={{ marginRight: '10px' }}>
          {isPlaying ? 'Pausa' : 'Play'}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={enableEnglishSubtitles}
          sx={{ marginRight: '10px' }}
        >
          Sub EN
        </Button>

        <Button variant="contained" color="secondary" onClick={enableSpanishSubtitles}>
          Sub ES
        </Button>
      </Box>
    </>
  );
};

export default VideoPlayer;
