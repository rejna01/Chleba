import Styles from "./Notes.module.css";

export default function Notes({ notes, setNotes, editable }) {
  return (
    <>
      {notes && (
        <div className={Styles.notesModal}>
          <div className={Styles.notesHeader}>
            <h2>Notes</h2>
            {editable && (
              <button
                className={Styles.closeNotesButton}
                onClick={() => setNotes(false)}
              >
                X
              </button>
            )}
          </div>
          <textarea
            className={Styles.notesTextarea}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            readOnly={!editable}
          />
        </div>
      )}
    </>
  );
}
