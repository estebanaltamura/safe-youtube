import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import ChannelListContainer from 'components/ChannelListContainer';
import { useUser } from 'contexts/userContext';
import getChannelsByChildId from 'services/getChannelsByChildId';
import { Channel } from 'types';

const ChannelList: React.FC = () => {
  const { user } = useUser();
  const [channels, setChannels] = useState<Channel[]>([]);

  const fetchChannels = async (childId: string) => {
    const channels: Channel[] | [] = await getChannelsByChildId('123456');

    console.log(channels);
    setChannels(channels);
  };

  useEffect(() => {
    if (user?.uid) {
      fetchChannels('123456');
    }
  }, [user]);

  return (
    <>
      <Typography variant="h5" sx={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
        Canales
      </Typography>
      {channels.length > 0 && <ChannelListContainer channels={channels} />}
    </>
  );
};

export default ChannelList;
