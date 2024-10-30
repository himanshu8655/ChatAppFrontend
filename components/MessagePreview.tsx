import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FilePreview from '@/components/file_preview';

enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

interface Message {
  id?: string;
  from: string;
  message: string;
  isFile: boolean;
  group: string;
  msgStatus: MessageStatus;
}

interface MessagePreviewProps {
  message: Message;
  userId: string;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({ message, userId }) => {
  const isSentByMe = message.from === userId;

  return (
    <View style={[styles.messageContainer, isSentByMe ? styles.myMessage : styles.otherMessage]}>
      <View style={styles.messageHeader}>
        <Text style={styles.fromText}>{isSentByMe ? "You:" : `~${message.from}`}</Text>
      </View>

      {message.isFile ? (
        <FilePreview from={message.from} message={message.message} fileUri={message.message} />
      ) : (
        <Text style={styles.messageText}>{message.message}</Text>
      )}
      
      <View style={styles.statusContainer}>
        <Icon
          name={
            message.msgStatus === MessageStatus.READ
              ? "done-all"
              : message.msgStatus === MessageStatus.DELIVERED
                ? "done"
                : "schedule"
          }
          size={14}
          color="#FFF"
        />
      </View>
    </View>
  );
};

const styles = {
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
    borderRadius: 10,
    padding: 10,
    minWidth: 100,
  },
  myMessage: {
    backgroundColor: '#0096c7',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#ff8fab',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#FFF',
    fontSize: 16,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  fromText: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
};

export default MessagePreview;
