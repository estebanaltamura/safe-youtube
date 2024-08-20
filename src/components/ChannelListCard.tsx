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

  return (
    <Card
      onClick={() => redirectToChannelDetail(channel.channelId, channel.name)}
      sx={{ borderRadius: '12px', overflow: 'hidden', height: 'fit-content', cursor: 'pointer' }}
    >
      <Box
        sx={{
          width: '100%',
          height: '200px', // Ajusta la altura de la imagen según sea necesario
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
            src={channel.thumbnail}
            alt={channel.name}
            style={{
              width: '100%',
              height: '100%',
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
