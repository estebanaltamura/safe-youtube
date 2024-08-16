import React, { useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, useMediaQuery, useTheme, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { Channel } from 'types';

// Define la interfaz de Playlist
interface PlayListVideoContainerProps {
  channels: Channel[];
  onSelectChannel: ({ id, name }: { id: string; name: string }) => void;
}

const ChannelListContainer: React.FC<PlayListVideoContainerProps> = ({ channels, onSelectChannel }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const cardMinWidth = 270; // Ancho mínimo de la tarjeta
  const cardMaxWidth = 340; // Ancho máximo de la tarjeta

  return (
    <Box
      sx={{
        margin: '0 auto',
        padding: isSmallScreen ? '20px' : '20px 50px 50px 50px',
      }}
    >
      <Grid container spacing={2} justifyContent="flex-start">
        {channels.map((channel) => {
          const [imageError, setImageError] = useState(false);

          return (
            <Grid
              item
              xs={12} // En pantallas pequeñas, ocupará el 100% del ancho
              sm={channels.length === 1 || isSmallScreen ? 12 : 6} // En pantallas pequeñas o cuando hay una tarjeta, ocupará el 100%
              md={isMediumScreen ? 6 : 4} // En pantallas medianas, 50% del ancho, si es más grande, 33%
              lg={3} // En pantallas grandes, 25% del ancho
              key={uuidv4()}
              sx={{
                flexGrow: 1,
                minWidth: isSmallScreen || channels.length === 1 ? '100%' : `${cardMinWidth}px`, // Si hay solo una tarjeta o es pantalla pequeña, ocupa 100% del ancho
                maxWidth: `${cardMaxWidth}px`,
              }}
            >
              <Card
                onClick={() => onSelectChannel({ id: channel.id, name: channel.name })}
                sx={{ borderRadius: '12px', overflow: 'hidden', height: 'fit-content', cursor: 'pointer' }}
              >
                <CardMedia
                  component="img"
                  image={imageError ? '' : channel.thumbnail} // Si hay un error, no se mostrará la imagen
                  alt={channel.name}
                  sx={{
                    width: '100%',
                    height: 'fit-content', // Altura fija para la imagen
                    backgroundColor: imageError ? 'gray' : 'transparent', // Fondo gris si hay un error
                    objectFit: 'cover', // Mantiene la proporción de la imagen
                  }}
                  onError={() => setImageError(true)} // Maneja el error de carga de la imagen
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
                      textAlign: 'center',
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
                    {channel.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ChannelListContainer;
