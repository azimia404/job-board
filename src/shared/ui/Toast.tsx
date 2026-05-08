import { useCallback, useState } from "react";

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  const show = useCallback((msg: string, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  }, []);

  return { message, show };
}
export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return <div className="toast">{message}</div>;
}
