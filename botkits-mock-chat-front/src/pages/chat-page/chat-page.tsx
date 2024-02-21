import React, { FC, useState, useEffect } from 'react';
// Импортируйте WebSocketManager
import ChatDialogue from '../../components/chat/chat-dialogue/desktop-dialogue';
import stylesChatDesktop from './chat-page.module.scss';
import Dialogs from '../../components/chat/dialogs/dialogs';
import Information from '../../components/chat/Information/Information';
import { IMessage, IUser } from '../../utils/mockChatData';
import { useAppDispatch, useAppSelector } from '../../services/hooks/redux';
import { wsActions } from '../../services/actions/socket';
import { SET_CHAT_HISTORY_STATUS } from '../../services/actions/chat';

//chat-page.tsx
const ChatDesktop: FC = () => {
  const [isInfoVisible, setInfoVisible] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<IMessage[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser>({
    id: null,
    name: null,
    status: null,
    messages: [],
    lastMessageAt: null,
  });

  const { user, status, history, usersFrontConnected, historyIsHere } =
    useAppSelector((store: any) => ({
      user: store.chat.user,
      status: store.chat.status,
      history: store.chat.history,
      usersFrontConnected: store.chat.usersFrontConnected,
      historyIsHere: store.chat.historyIsHere,
    }));

  const dispatch = useAppDispatch();

  const handleClick = () => {
    setInfoVisible(!isInfoVisible);
  };

  useEffect(() => {
    dispatch({ type: wsActions.wsStart, payload: 'ws://localhost:3005' });
  }, []);

  useEffect(() => {
    if (status === 'success') {
      dispatch({ type: wsActions.wsSendUserId, payload: user.id });
    }
  }, [status]);

  useEffect(() => {
    if (historyIsHere) {
      console.log(history);
      dispatch({ type: SET_CHAT_HISTORY_STATUS, payload: false });
    }
  }, [historyIsHere]);

  return (
    <div className={stylesChatDesktop.layout}>
      <Dialogs
        setSelectedMessages={setSelectedMessages}
        setSelectedUser={setSelectedUser}
      />
      <ChatDialogue
        onSidebarClick={handleClick}
        isInfoVisible={isInfoVisible}
        selectedMessages={selectedMessages}
        selectedUser={selectedUser}
      />
      {isInfoVisible && <Information selectedUser={selectedUser} />}
    </div>
  );
};

export default ChatDesktop;
