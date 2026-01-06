import Styles from "./Notes.module.css";
import { useDrag } from "./useDrag";
import { useResize } from "./useResize";
import React, { useRef } from "react";

export default function Notes({ onClose, onOpen, allNotes, editable, note }) {
  const boxRef = useRef(null),
    handleDragRef = useRef(null), handleRef = useRef(null);
  useDrag(boxRef, handleDragRef);
  useResize(boxRef, handleRef);
  
  return (
    <div
      className={Styles.notesModal}
      ref={boxRef}
      style={{
        width: 200,
        height: 150,
        background: "#444",
        color: "white",
        position: "absolute",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <div className={Styles.notesHeader}>
        <h2 className={Styles.headerName}>{note.title}</h2>

        <button className={Styles.closeNotesButton} onClick={onClose}>
          X
        </button>
        <button className={Styles.closeNotesButton} ref={handleDragRef}>
          ⠿
        </button>
      </div>
      {note.title ? (
        <textarea
          className={Styles.notesTextarea}
          value={note.content}
          readOnly={!editable}
        />
      ) : (
        <>
          {allNotes.map((note) => (
            <div
              className={Styles.noteList}
              key={note.id}
              onClick={() => onOpen(note.id)}
            >
              {note.title}
            </div>
          ))}
          <div className={Styles.noteList}>+</div>
        </>
      )}
          <div
      ref={handleRef}
      style={{
        width: "20px",
        height: "20px",
        position: "absolute",
        right: "0",
        bottom: "0",
        cursor: "se-resize",
      }}
    >↘</div>
    </div>
  );
}
