import { useSelector } from 'react-redux';
import './ChatBubble.css';

export default function ChatBubble({ chatItem }) {
  const authState = useSelector((state) => state.auth);
  const userId = authState.currentUser._id;

  const isOnlyEmoji = (testString) => {
    return /^\p{Extended_Pictographic}+$/u.test(testString);
  };

  const textSize = isOnlyEmoji(chatItem.text)
    ? 'text-4xl sm:text-6xl'
    : 'text-base sm:text-lg';

  const formatDate = (isoString) => {
    if (isoString) {
      const dateParts = isoString.slice(0, 10).split('-');
      const dateString = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      const timeString = isoString.slice(11, 16);
      return `${dateString}, ${timeString}`;
    } else {
      return '';
    }
  };

  // useEffect(() => {
  // console.log('Rendering chat item for user: ', chatItem._id);
  // console.log('Current logged in user: ', userId);
  // }, [chatItem, userId])

  return (
    <div
      className={`relative max-w-5/6 border border-slate-500 rounded-md mb-4 px-4 py-2
    ${
      userId === chatItem._id
        ? 'bg-fuchsia-600 self-end text-white'
        : 'bg-yellow-600 self-start'
    }`}
    >
      <div
        className={`flex flex-col point-border ${
          userId === chatItem._id
            ? 'tri-right btm-right-in'
            : 'tri-left btm-left-in'
        }`}
      >
        <p className={`${textSize}`}>{chatItem.text}</p>
        <p className='text-xs mt-1'>{formatDate(chatItem.timeStamp)}</p>
      </div>
    </div>
  );
}
