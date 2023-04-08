import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";

import NotesModel from "../models/notes";

interface CreateNoteBody {
	title: string;
	description?: string;
}

interface NoteBody {
	title?: string;
	description?: string;
}

interface NoteParams {
	noteId: string;
}

export const createNote: RequestHandler<
	NoteParams,
	unknown,
	CreateNoteBody,
	unknown
> = async (req, res, next) => {
	try {
		const title = req.body.title;
		const description = req.body.description;

		if (!title) {
			throw createHttpError(400, "Invalid body. Title is required");
		}

		const newNote = await NotesModel.create({
			title: title,
			description: description,
		});

		res.status(201).json(newNote);
	} catch (error) {
		next(error);
	}
};

export const deleteNote: RequestHandler<
	NoteParams,
	unknown,
	NoteBody,
	unknown
> = async (req, res, next) => {
	try {
		const noteId = req.params.noteId;

		if (!mongoose.isValidObjectId(noteId)) {
			throw createHttpError(400, "Invalid note Id.");
		}

		const note = await NotesModel.findById(noteId).exec();

		if (!note) {
			throw createHttpError(404, "Not found note with given Id.");
		}

		await note.deleteOne();

		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
};

export const getNote: RequestHandler<
	NoteParams,
	unknown,
	NoteBody,
	unknown
> = async (req, res, next) => {
	try {
		const noteId = req.params.noteId;

		if (!mongoose.isValidObjectId(noteId)) {
			throw createHttpError(400, "Invalid note Id.");
		}

		const note = await NotesModel.findById(noteId).exec();

		if (!note) {
			throw createHttpError(404, "Not found note with given Id.");
		}

		res.status(200).json(note);
	} catch (error) {
		next(error);
	}
};

export const getNotes: RequestHandler<
	NoteParams,
	unknown,
	NoteBody,
	unknown
> = async (_, res, next) => {
	try {
		const notes = await NotesModel.find().exec();
		res.status(200).json(notes);
	} catch (error) {
		next(error);
	}
};

export const updateNote: RequestHandler<
	NoteParams,
	unknown,
	NoteBody,
	unknown
> = async (req, res, next) => {
	try {
		const newTitle = req.body.title;
		const newDescription = req.body.description;

		const noteId = req.params.noteId;

		if (!mongoose.isValidObjectId(noteId)) {
			throw createHttpError(400, "Invalid note Id.");
		}

		const note = await NotesModel.findById(noteId).exec();

		if (!note) {
			throw createHttpError(404, "Not found note with given Id.");
		}

		if (newTitle) {
			note.title = newTitle;
		}

		if (newDescription) {
			note.description = newDescription;
		}

		const updatedNote = await note.save();

		res.status(200).json(updatedNote);
	} catch (error) {
		next(error);
	}
};
