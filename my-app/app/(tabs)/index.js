import { GiftedChat } from 'react-native-gifted-chat';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Fetch messages from Firestore on initial render
    const unsubscribe = firebase.firestore()
      .collection('chats')
      .doc('chatId123')
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const fetchedMessages = snapshot.docs.map(doc => ({
          _id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().createdAt.toDate(),
          user: {
            _id: doc.data().senderId,
          },
        }));
        setMessages(fetchedMessages);
      });
    return unsubscribe;
  }, []);

  const onSend = (newMessages = []) => {
    const text = newMessages[0].text;
    const senderId = firebase.auth().currentUser.uid;
    firebase.firestore()
      .collection('chats')
      .doc('chatId123')  // Your chat ID here
      .collection('messages')
      .add({
        text,
        senderId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: firebase.auth().currentUser.uid,
      }}
    />
  );
};
