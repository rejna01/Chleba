import { useEffect, useRef, useState } from "react";
import styles from "./Tools.module.css";

export default function Tools({ tools = [] }) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(56);
  const ref = useRef(null);
  const containerRef = useRef(null);

  // zavření při kliknutí mimo
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    if (open && containerRef.current) {
      const contentHeight = containerRef.current.scrollHeight;
      setHeight(contentHeight - 24);
    } else {
      setHeight(56); // výška kolečka
    }
  }, [open, tools.length]);
  return (
    <div ref={ref} className={styles.wrapper}>
      <div
        style={{
          height: height,
          overflow: "hidden",
        }}
        ref={containerRef}
        className={`${styles.container} ${open ? styles.open : ""}`}
        onClick={() => !open && setOpen(true)}
      >
        {!open && <span className={styles.hamburger}>☰</span>}

        {open && (
          <div className={styles.tools}>
            {tools.map((tool, index) => (
              <button
                key={index}
                className={styles.tool}
                onClick={() => {
                  tool.onClick();
                  setOpen(false);
                }}
              >
                {tool.icon && <span>{tool.icon}</span>}
                {tool.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
