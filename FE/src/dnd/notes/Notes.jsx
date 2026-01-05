import Styles from "./Notes.module.css";
import { useDrag } from "./useDrag";
import React, { useRef } from "react";

export default function Notes({ onClose, onOpen, allNotes, editable, note }) {
  const boxRef = useRef(null),
    handleRef = useRef(null);
  useDrag(boxRef, handleRef);
  console.log(note);
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
        <button className={Styles.closeNotesButton} ref={handleRef}>
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
    </div>
  );
}
