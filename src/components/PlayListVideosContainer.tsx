import React, { useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, useMediaQuery, useTheme, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

// Define la interfaz de Playlist
interface Playlist {
  id: string;
  title: string;
  thumbnail: string;
  itemCount: number; // Cantidad de videos en la playlist
}

interface PlayListVideoContainerProps {
  playlists: Playlist[];
}

const PlayListVideoContainer: React.FC<PlayListVideoContainerProps> = ({ playlists }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const cardMinWidth = 270; // Ancho mínimo de la tarjeta
  const cardMaxWidth = 340; // Ancho máximo de la tarjeta

  const navigate = useNavigate();

  const redirectToPlayListDetail = (playlistId: string, playlistName: string) => {
    const encodedPlaylistName = encodeURIComponent(playlistName);
    navigate(`/playlist-detail/${playlistId}/${encodedPlaylistName}`);
  };

  return (
    <Box
      sx={{
        margin: '0 auto',
        padding: isSmallScreen ? '20px' : '20px 50px 50px 50px',
      }}
    >
      <Grid container spacing={2} justifyContent="flex-start">
        {playlists.map((playlist) => (
          <Grid
            item
            xs={12} // En pantallas pequeñas, ocupará el 100% del ancho
            sm={playlists.length === 1 || isSmallScreen ? 12 : 6} // En pantallas pequeñas o cuando hay una tarjeta, ocupará el 100%
            md={isMediumScreen ? 6 : 4} // En pantallas medianas, 50% del ancho, si es más grande, 33%
            lg={3} // En pantallas grandes, 25% del ancho
            key={uuidv4()}
            sx={{
              flexGrow: 1,
              minWidth: isSmallScreen || playlists.length === 1 ? '100%' : `${cardMinWidth}px`, // Si hay solo una tarjeta o es pantalla pequeña, ocupa 100% del ancho
              maxWidth: `${cardMaxWidth}px`,
            }}
          >
            <Card
              onClick={() => redirectToPlayListDetail(playlist.id, playlist.title)}
              sx={{ borderRadius: '12px', overflow: 'hidden', height: 'fit-content', cursor: 'pointer' }}
            >
              <CardMedia
                component="img"
                image={playlist.thumbnail} // Si hay un error, no se mostrará la imagen
                alt={playlist.title}
                sx={{
                  width: '100%',
                  height: 'auto', // Altura fija para la imagen
                  backgroundColor: 'transparent', // Fondo gris si hay un error
                  objectFit: 'cover', // Mantiene la proporción de la imagen
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
                  {playlist.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ fontSize: '12px', marginTop: '4px', padding: 0 }}
                >
                  {playlist.itemCount} videos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PlayListVideoContainer;
