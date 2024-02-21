export interface IMessage {
  id: number;
  avatar: string;
  user: string;
  message: string;
  time: string;
  online: boolean;
  seen: string;
  status: 'read' | 'unread';
}

export interface IUser {
  id: string | null;
  name: string | null;
  status: 'online' | 'offline' | null;
  messages?: IMessage[];
  lastMessageAt: string | null;
}

export interface IChatData {
  user: IUser;
}

export const testData: IChatData[] = [
  {
    user: {
      id: '1',
      name: 'Вячеслав Баумтрок',
      status: 'online',
      lastMessageAt: '2023-11-15 00:30:22',
      messages: [
        {
          id: 1,
          avatar: '',
          user: 'Вячеслав Баумтрок',
          message: 'Инициализация дилога',
          time: '16 мин назад',
          online: false,
          seen: '14:05',
          status: 'read',
        },
      ],
    },
  },
];
