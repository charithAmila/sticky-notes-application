const STORAGE_KEY = "notes";

export const getAllNotes = (): Note[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const createNote = (note: Note): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...getAllNotes(), note]));
};

export const updateNote = (updated: Note): void => {
  const notes = getAllNotes().map((n) => (n.id === updated.id ? updated : n));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const deleteNote = (id: number): void => {
  const notes = getAllNotes().filter((n) => n.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};
