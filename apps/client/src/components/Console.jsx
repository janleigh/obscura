import { useEffect, useRef, useState } from "react";
import "../styles/index.css";

const STORAGE_KEY = "obscura_console_history_v1";

const Console = ({ className = "", onSubmit }) => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [navIndex, setNavIndex] = useState(-1);
  const [cursorVisible, setCursorVisible] = useState(true); 
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch (err) {
      // ign
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (err) {
      // ignore
    }
  }, [history]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history, input]);

  const push = (text) => {
    const entry = { id: Date.now(), text, ts: new Date().toISOString() };
    setHistory((h) => [...h, entry]);
    if (onSubmit) onSubmit(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim() !== "") {
        push(input.trim());
        setInput("");
        setNavIndex(-1);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      setNavIndex((i) => {
        const next = i === -1 ? history.length - 1 : Math.max(0, i - 1);
        setInput(history[next].text);
        return next;
      });
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setNavIndex((i) => {
        if (i === -1) return -1;
        const next = i >= history.length - 1 ? -1 : i + 1;
        setInput(next === -1 ? "" : history[next].text);
        return next;
      });
      return;
    }
  };

  const handleClear = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    setInput("");
    setNavIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className={`w-full h-full font-mono ${className}`}>
      <div
        ref={containerRef}
        className="h-[70vh] overflow-y-auto bg-black p-4 text-sm text-green-400 console scrollbar-thin"
        onClick={() => inputRef.current?.focus()}
        style={{ 
          cursor: 'text',
          minHeight: '300px',
          maxHeight: '80vh'
        }}
      >
        {history.map((h) => (
          <div key={h.id} className="whitespace-pre-wrap break-words">
              <span className="select-none">&gt; </span>
            {h.text}
          </div>
        ))}

        <div className="whitespace-pre-wrap break-words">
          <span className="select-none">&gt; </span>
          {input}
          <span 
            className={`inline-block w-2 h-4 -mb-1 bg-green-400 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="absolute opacity-0 w-0 h-0 outline-none"
          autoFocus
        />
      </div>
    </div>
  );
};

export default Console;
