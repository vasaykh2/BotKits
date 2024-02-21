import { FC } from 'react';
import stylesSendButton from './send-button.module.scss';
import ArrowIcon from '../../../components/icons/Arrow/ArrowIcon';
import { useAppDispatch, useAppSelector } from '../../../services/hooks/redux';
import { wsActions } from '../../../services/actions/socket';

const SendButton: FC<any> = ({ value, selectedUser }): JSX.Element => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((store: any) => ({
    user: store.chat.user,
  }));

  const handleButtonClick = () => {
    const dataMessage = {
      participants: [user.id, `${selectedUser.id}`],
      sender: user.name, // Идентификатор отправителя
      message: value, // Текст сообщения
      time: new Date().toISOString(), // Временная метка сообщения
      status: 'sent', // Статус сообщения
      avatar: '',
    };
    dispatch({type: wsActions.wsSend, payload: dataMessage });
  };

  return (
    <div className={stylesSendButton.button} onClick={handleButtonClick}>
      <ArrowIcon />
    </div>
  );
};

export default SendButton;
