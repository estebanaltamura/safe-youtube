import React, { Dispatch, useEffect } from 'react';
import { channels } from 'channels';
import { v4 as uuidv4 } from 'uuid';
import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import ChannelListContainer from 'components/ChannelListContainer';

interface ChannelProps {
  onSelectChannel: ({ id, name }: { id: string; name: string }) => void;
}

const ChannelList: React.FC<ChannelProps> = ({ onSelectChannel }) => {
  return (
    <>
      <Typography variant="h5" sx={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
        Canales
      </Typography>
      <ChannelListContainer channels={channels} onSelectChannel={onSelectChannel} />;
    </>
  );
};

export default ChannelList;
