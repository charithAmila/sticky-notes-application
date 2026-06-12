import { useEffect, useState } from "react";
import Note from "./components/Note";
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from "./services/NoteService";
import TrashZone from "./components/TrashZone";
import { randomHexColor } from "./utils/randomHexColor";

import "./App.css";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draggingNoteId, setDraggingNoteId] = useState<number | null>(null);
  const [isOverlapping, setIsOverlapping] = useState<boolean>(false);

  useEffect(() => {
    const notes = getAllNotes();
    setNotes(notes);
  }, []);

  const addNote = () => {
    const newNote: Note = {
      text: "Text...",
      id: Math.random(),
      x: Math.random() * 300 + 50, // random position on board
      y: Math.random() * 200 + 50,
      width: 400,
      height: 400,
      color: randomHexColor(),
    };
    setNotes([...notes, newNote]);
    createNote(newNote);
  };

  const editNote = (text: string, id: number) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const updated = { ...n, text };
        updateNote(updated);
        return updated;
      }),
    );
  };

  const resizeNote = (id: number, width: number, height: number) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const updated = { ...n, width, height };
        updateNote(updated);
        return updated;
      }),
    );
  };

  const onDragEnd = (id: number, x: number, y: number) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const updated = { ...n, x, y };
        updateNote(updated);
        return updated;
      }),
    );
  };

  const removeNote = (id: number) => {
    setNotes((prev) =>
      prev.filter((n) => {
        return n.id !== id;
      }),
    );

    deleteNote(id);
  };

  return (
    <div className="board">
      <div className="tool-bar">
        <button className="btn-add-new" onClick={addNote}>
          Add New
        </button>
      </div>
      {notes.length ? (
        <div className="notes">
          {notes.map((note) => {
            return (
              <Note
                key={note.id}
                note={note}
                editNote={editNote}
                onResize={resizeNote}
                onResizeMove={resizeNote}
                onDragEnd={onDragEnd}
                draggingNoteId={draggingNoteId}
                updateDraggingNoteId={(id: number | null) =>
                  setDraggingNoteId(id)
                }
                removeNote={removeNote}
                setIsOverlapping={setIsOverlapping}
              />
            );
          })}
          <TrashZone removeNote={removeNote} isHovering={isOverlapping} />
        </div>
      ) : (
        <div className="empty-note-wrapper">
          <button className="btn-add-new" onClick={addNote}>
            Create your First Note
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
