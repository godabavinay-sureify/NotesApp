import axiosInstance from "../utils/axios";

export interface CreateNoteBody {
	title: string;
	description?: string;
}

export interface NoteBody {
	title?: string;
	description?: string;
}

export const createNote = async (note: CreateNoteBody) => {
	return await axiosInstance.post("http://localhost:8080/api/notes", note);
};

export const deleteNote = async (noteId: string) => {
	return await axiosInstance.delete(`http://localhost:8080/api/notes/${noteId}`);
};

export const fetchNotes = async () => {
	return await axiosInstance.get("http://localhost:8080/api/notes");
};

export const updateNote = async (noteId: string, note: CreateNoteBody) => {
	return await axiosInstance.patch(
		`http://localhost:8080/api/notes/${noteId}`,
		note
	);
};
