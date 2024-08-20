import React, { Dispatch } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, useMediaQuery, useTheme, Box } from '@mui/material';
import { Video } from 'types';
import { formatViewCount } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

// Define la interfaz de Video

interface VideoListContainerProps {
  videos: Video[];
}

const VideoListContainer: React.FC<VideoListContainerProps> = ({ videos }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();

  const cardMinWidth = 270; // Ancho mínimo de la tarjeta
  const cardMaxWidth = 340; // Ancho máximo de la tarjeta

  // Función para analizar la duración del video en formato ISO 8601
  const parseDuration = (duration: string): number => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = (parseInt(match[1]) || 0) * 3600;
    const minutes = (parseInt(match[2]) || 0) * 60;
    const seconds = parseInt(match[3]) || 0;

    return hours + minutes + seconds;
  };

  // Función para formatear la duración en minutos y segundos
  const formatDuration = (duration: string): string => {
    const totalSeconds = parseDuration(duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const redirectToVideoPlayer = (videoId: string) => {
    navigate(`/videoPlayer/${videoId}`);
  };

  return (
    <Box
      sx={{
        margin: '0 auto',
        padding: isSmallScreen ? '20px' : '20px 50px 50px 50px',
      }}
    >
      <Grid container spacing={2} justifyContent="flex-start">
        {videos.map((video) => (
          <Grid
            item
            xs={12} // En pantallas pequeñas, ocupará el 100% del ancho
            sm={videos.length === 1 || isSmallScreen ? 12 : 6} // En pantallas pequeñas o cuando hay una tarjeta, ocupará el 100%
            md={isMediumScreen ? 6 : 4} // En pantallas medianas, 50% del ancho, si es más grande, 33%
            lg={3} // En pantallas grandes, 25% del ancho
            key={uuidv4()}
            sx={{
              flexGrow: 1,
              minWidth: isSmallScreen || videos.length === 1 ? '100%' : `${cardMinWidth}px`, // Si hay solo una tarjeta o es pantalla pequeña, ocupa 100% del ancho
              maxWidth: `${cardMaxWidth}px`,
            }}
          >
            <Card
              sx={{ borderRadius: '12px', overflow: 'hidden', height: 'fit-content', cursor: 'pointer' }}
              onClick={() => redirectToVideoPlayer(video.id)}
            >
              <CardMedia
                component="img"
                image={video.thumbnail}
                alt={video.title}
                sx={{
                  width: '100%', // La imagen ocupará el 100% del ancho de la tarjeta
                  height: 'auto', // La altura será automática según la proporción de la imagen
                }}
              />
              <CardContent
                sx={{
                  padding: '12px !important',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant="h6"
                  component="h4"
                  sx={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    lineHeight: '22px',
                    minHeight: '44px', // Reservamos espacio para 3 líneas
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2, // Permitimos hasta 3 líneas
                  }}
                >
                  {video.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: '12px', marginTop: '4px', padding: 0 }}
                >
                  Duración: {formatDuration(video.duration)}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px', padding: 0 }}>
                  Vistas: {formatViewCount(video.viewCount)}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px', padding: 0 }}>
                  {video.channelName}{' '}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px', padding: 0 }}>
                  Publicado el {new Date(video.publishedAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VideoListContainer;
