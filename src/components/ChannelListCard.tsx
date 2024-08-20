import { Card, CardContent, Typography, Box } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Channel } from 'types';

const ChannelListCard: React.FC<{ channel: Channel }> = ({ channel }) => {
  const navigate = useNavigate();
  const [errorImage, setErrorImage] = useState(false);

  const redirectToChannelDetail = (channelId: string, channelName: string) => {
    const encodedPlaylistName = encodeURIComponent(channelName);
    navigate(`/channel-detail/${channelId}/${encodedPlaylistName}`);
  };

  const handleError = () => {
    setErrorImage(true);
  };

  // Función para obtener la URL de alta resolución
  const getHDThumbnail = (url: string) => {
    // Reemplaza los parámetros de la URL para obtener una miniatura en alta definición (HD)
    return url.replace(/=s\d+-[a-zA-Z0-9-]+$/, '=s1000'); // Ajustar a s800 para una resolución HD
  };

  return (
    <Card
      onClick={() => redirectToChannelDetail(channel.channelId, channel.name)}
      sx={{ borderRadius: '12px', overflow: 'hidden', height: 'fit-content', cursor: 'pointer' }}
    >
      <Box
        sx={{
          width: '100%',
          height: 'auto', // Ajusta la altura de la imagen según sea necesario
          backgroundColor: errorImage ? 'gray' : 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {errorImage ? (
          <Typography variant="body2" color="textSecondary">
            Error loading image
          </Typography>
        ) : (
          <img
            src={getHDThumbnail(channel.thumbnail)} // Aplicamos la función para obtener la URL en HD
            alt={channel.name}
            onError={handleError}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
            }}
          />
        )}
      </Box>
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px !important',
          justifyContent: 'space-between',
          height: '44px',
        }}
      >
        <Typography
          variant="h6"
          component="h4"
          sx={{
            width: '100%',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            lineHeight: '22px',
            height: 'fit-content',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {channel.name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ChannelListCard;
