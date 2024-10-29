export default function MessagesPage() {
    const messageData = {
      lastMessage: "I've sent you the quote"
    };
  
    return (
      <div>
        <p>{messageData.lastMessage}</p>
      </div>
    );
  }