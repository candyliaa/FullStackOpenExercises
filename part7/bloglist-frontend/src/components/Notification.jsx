import { useNotification } from "../context/NotificationContext";

const Notification = () => {
  const [message] = useNotification();

  if (!message) return null;

  if (message.includes("error")) {
    return <div className="error">{message}</div>;
  }

  return <div className="added">{message}</div>;
};

export default Notification;
