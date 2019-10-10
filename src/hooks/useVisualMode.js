import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // transition to show new mode
  function transition(mode, replace = false) {
    if (replace) {
      setHistory(prev => ([...prev.slice(0, -1), mode]));
      setMode(mode);
    } else {
      setHistory(prev => ([...prev, mode]));
      setMode(mode);
    }
  }

  // pressing 'back' button
  function back() {
    if (history.length > 1) {
      setHistory(prev => ([...prev.slice(0, -1)]))
      setMode(history[history.length - 2]);
    }
  }

  return { mode, transition, back };
}
