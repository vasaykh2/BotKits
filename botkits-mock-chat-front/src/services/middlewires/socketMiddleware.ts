import { Middleware } from 'redux';
import { wsActions } from '../actions/socket';
import { Socket, io } from 'socket.io-client';
import {
  NEW_USER_CONNECTED,
  SET_CHATS_HISTORY,
  SET_STATUS,
  UPDATE_HISTORY,
} from '../actions/chat';

//socketMiddleware.ts
const socketMiddleware = (WsActions: typeof wsActions): Middleware => {
  return (store) => {
    let socket: Socket | null = null;
    let url;

    return (next) => (action) => {
      const { dispatch } = store;
      const { type, payload } = action;
      const { wsStart, onError, onClose, onMessage, wsSend, wsSendUserId } =
        WsActions;

      if (type === wsStart) {
        url = payload;
        socket = io(url);
      } else if (type === onClose) {
        socket && socket.off();
      }

      if (socket) {
        // Отписываемся от всех предыдущих событий
        socket.off('connect');
        socket.off('connect_error');
        socket.off('messageMockClient');
        socket.off('disconnect');
        socket.off('allChatsHistory');
        socket.off('register');

        // Закрываем предыдущее соединение
        socket.on('connect', () => {
          console.log('Socket.IO Connected');
          dispatch({ type: SET_STATUS, payload: 'success' });
        });

        socket.on('connect_error', (error) => {
          console.error('Socket.IO Connection Error', error);
          dispatch({ type: SET_STATUS, payload: 'error' });
        });

        socket.on('messageMockClient', (message) => {
          console.log('Socket.IO Message', message);
          dispatch({type: UPDATE_HISTORY, payload: message})
        });

        socket.on('disconnect', (reason) => {
          console.log('Socket.IO Disconnected', reason);
          dispatch({ type: SET_STATUS, payload: 'closed' });
        });

        socket.on('allChatsHistory', (history) => {
          console.log(
            'Socket.IO allChatsHistory',
            JSON.stringify(history, null, 2)
          );
          if (history.length === 0) {
            return;
          }
          dispatch({ type: SET_CHATS_HISTORY, payload: history });
        });

        socket.on('register', (user) => {
          const userObj = JSON.parse(user);
          console.log(`Socket.IO на рутовом фронтенде к чатам подключился пользователь - ${JSON.stringify(userObj, null, 2)}`);
          dispatch({ type: NEW_USER_CONNECTED, payload: userObj });
        });

        if (type === wsSend) {
          //const { message } = payload;
          socket.emit('mockChatMessage', payload);
        } else if (type === wsSendUserId) {
          socket.emit('mockChatHistory', payload);
        }
      }

      next(action);
    };
  };
};

export default socketMiddleware;

/* import { io, Socket } from 'socket.io-client';

export class WebSocketManager {
  private socket: Socket | null = null;

  constructor(private wsActions: any) {}

  startConnection(url: string) {
    this.socket = io(url);

    this.attachEventListeners();
  }

  closeConnection() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(message: any) {
    if (this.socket) {
      this.socket.emit('mockChatMessage', message);
    }
  }

  private attachEventListeners() {
    if (!this.socket) return;

    const { onOpen, onError, onClose, onMessage, wsRegisterUser } = this.wsActions;

    this.socket.on('connect', () => {
      console.log('Socket.IO Connected');
      localStorage.setItem(onOpen, JSON.stringify({ status: 'connected' }));
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO Connection Error', error);
      localStorage.setItem(onError, JSON.stringify(error));
    });

    this.socket.on('messageMockClient', (data) => {
      console.log('Socket.IO Message', data);
      localStorage.setItem(onMessage, JSON.stringify(data)); // Убедитесь, что data в формате JSON
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket.IO Disconnected', reason);
      localStorage.setItem(onClose, JSON.stringify({ reason }));
    });

    this.socket.on('register', (data) => {
      console.log('Socket.IO на рутовом фронтенде к чатам подключился пользователь - ', data);
      localStorage.setItem(wsRegisterUser, data);
    });
  }
}

// Пример использования
export const wsActions = {
  wsStart: 'WS_START',
  onOpen: 'WS_OPEN',
  onError: 'WS_ERROR',
  onClose: 'WS_CLOSE',
  onMessage: 'WS_MESSAGE',
  wsSend: 'WS_SEND',
  wsRegisterUser: 'register',
}; */
