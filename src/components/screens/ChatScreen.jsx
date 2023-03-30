import BubbleList from "../messages/BubbleList";
import ChatForm from "../messages/ChatForm";

export default function ChatScreen() {
  return (
    <div className="w-full h-full ml-16">
      <BubbleList />
      <ChatForm />
    </div>
  )
}