import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import ChannelListContainer from 'components/ChannelListContainer';
import { useUser } from 'contexts/userContext';
import getChannelsByChildId from 'services/getChannelsByChildId';
import { Channel } from 'types';

interface ChannelProps {
  onSelectChannel: ({ id, name }: { id: string; name: string }) => void;
}

const ChannelList: React.FC<ChannelProps> = ({ onSelectChannel }) => {
  const { user } = useUser();
  const [channels, setChannels] = useState<Channel[]>([]);

  const fetchChannels = async (childId: string) => {
    const channels: Channel[] | [] = await getChannelsByChildId('123456');
    setChannels(channels);
  };

  useEffect(() => {
    if (user?.uid) {
      fetchChannels('123456'); // Replace '123456' with the appropriate childId as needed
    }
  }, [user]);

  return (
    <>
      <Typography variant="h5" sx={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
        Canales
      </Typography>
      <ChannelListContainer channels={channels} onSelectChannel={onSelectChannel} />
    </>
  );
};

export default ChannelList;
