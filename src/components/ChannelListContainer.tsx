import React, { useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, useMediaQuery, useTheme, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { Channel } from 'types';
import { useNavigate } from 'react-router-dom';
import ChannelListCard from './ChannelListCard';

// Define la interfaz de Playlist
interface PlayListVideoContainerProps {
  channels: Channel[];
}

const ChannelListContainer: React.FC<PlayListVideoContainerProps> = ({ channels }) => {
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
              <ChannelListCard channel={channel} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ChannelListContainer;
