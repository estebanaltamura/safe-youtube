export interface Channel {
  channelId: string;
  name: string;
  thumbnail: string;
  childId: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
  channelName: string;
}

export interface Playlist {
  id: string;
  title: string;
  thumbnail: string;
  itemCount: number;
}
