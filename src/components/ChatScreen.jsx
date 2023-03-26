import BubbleList from "./BubbleList";
import ChatForm from "./ChatForm";

export default function ChatScreen() {
  return (
    <div className="w-full h-full ml-16">
      <BubbleList />
      <ChatForm />
    </div>
  )
}