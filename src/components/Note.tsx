import { useEffect, useRef, useState } from "react";

import "./note.css";

type Props = {
  note: Note;
  editNote: (text: string, id: number) => void;
  onResizeMove: (id: number, width: number, height: number) => void;
  onResize: (id: number, width: number, height: number) => void;
  onDragEnd: (id: number, x: number, y: number) => void;
  draggingNoteId: number | null;
  updateDraggingNoteId: (id: number | null) => void;
  removeNote: (id: number) => void;
  setIsOverlapping: (isOverlapping: boolean) => void;
};

export default function Note({
  note,
  editNote,
  onResizeMove,
  onResize,
  draggingNoteId,
  updateDraggingNoteId,
  removeNote,
  setIsOverlapping,
  ...rest
}: Props) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [text, setText] = useState("");

  useEffect(() => {
    setText(note.text);
  }, []);

  const handleChange = (e: React.FormEvent<HTMLParagraphElement>) => {
    const text = e.currentTarget.innerText;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      editNote(text, note.id); // use captured value
    }, 500);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = note.width;
    const startHeight = note.height;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(150, startWidth + (e.clientX - startX));
      const newHeight = Math.max(100, startHeight + (e.clientY - startY));
      onResizeMove(note.id, newWidth, newHeight);
    };

    const onMouseUp = (e: MouseEvent) => {
      const newWidth = Math.max(150, startWidth + (e.clientX - startX));
      const newHeight = Math.max(100, startHeight + (e.clientY - startY));
      onResize(note.id, newWidth, newHeight);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const isOverTrash = (x: number, y: number) => {
    const trashZone = {
      x: window.innerWidth - 210,
      y: window.innerHeight - 210,
      width: 200,
      height: 200,
    };
    return !(
      x > trashZone.x + trashZone.width ||
      x + note.width < trashZone.x ||
      y > trashZone.y + trashZone.height ||
      y + note.height < trashZone.y
    );
  };

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    updateDraggingNoteId(note.id);
    e.dataTransfer.setData("noteId", note.id.toString());
    const rect = e.currentTarget.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onDragCapture = (e: React.DragEvent<HTMLDivElement>) => {
    const newX = e.clientX - dragOffsetRef.current.x;
    const newY = e.clientY - dragOffsetRef.current.y;
    setIsOverlapping(isOverTrash(newX, newY));
  };

  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    updateDraggingNoteId(null);

    const newX = e.clientX - dragOffsetRef.current.x;
    const newY = e.clientY - dragOffsetRef.current.y;

    const overlapping = isOverTrash(newX, newY);
    setIsOverlapping(overlapping);

    if (overlapping) {
      removeNote(note.id);
      setIsOverlapping(false);
    }

    rest.onDragEnd(note.id, newX, newY);
  };

  return (
    <div
      className={`note ${draggingNoteId === note.id ? "is-dragging" : ""} `}
      draggable={true}
      style={{
        width: note.width,
        height: note.height,
        top: note.y,
        left: note.x,
        backgroundColor: note.color,
      }}
      onDragStart={onDragStart}
      onDragCapture={onDragCapture}
      onDragEnd={onDragEnd}
    >
      <p
        onInput={handleChange}
        contentEditable={draggingNoteId !== note.id}
        className="note-editor"
        style={{
          whiteSpace: "pre-wrap",
          cursor: "text",
        }}
        suppressContentEditableWarning={true}
      >
        {text}
      </p>

      <div className="resize-handle" onMouseDown={handleResizeStart} />
    </div>
  );
}
