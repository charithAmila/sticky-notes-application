import "./trash-zone.css";

type Props = {
  removeNote: (id: number) => void;
  isHovering: boolean;
};

export default function TrashZone({ removeNote, isHovering }: Props) {
  return (
    <div
      className="trash-zone"
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();

        const noteId = e.dataTransfer.getData("noteId");

        if (noteId) {
          removeNote(Number(noteId));
        }
      }}
      style={{
        // Animations when hovering
        backgroundColor: isHovering ? "rgba(255, 0, 0, 0.2)" : "transparent",
        transform: isHovering ? "scale(1.1)" : "scale(1)",
        borderColor: isHovering ? "#ff0000" : "#ff6666",
        borderWidth: isHovering ? "4px" : "2px",
      }}
    >
      Trash Zone
    </div>
  );
}
