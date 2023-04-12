import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";

import { Note as NoteModel } from './models/note';
import Note from './components/note/index';
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";
import AddEditNoteDialog from './components/addEditNoteDialog';
import * as NoteAPI from './Api/noteApi';

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setNotesLoading(true);
        setShowNotesLoadingError(false);

        const response = await NoteAPI.fetchNotes();

        setNotes(response.data);
      } catch (error) {
        setShowNotesLoadingError(true);
        console.error(error);
      } finally {
        setNotesLoading(false);
      }
    }

    loadNotes();
  }, [])

  const deleteNote = async (noteId: string) => {
    try {
      await NoteAPI.deleteNote(noteId);
      setNotes(notes.filter(existingNote => existingNote._id !== noteId));
    } catch (error) {
      console.error(error);
    }
  }

  const notesGrid = <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
    {notes.map(note => (
      <Col key={note._id}>
        <Note
          note={note}
          className={styles.note}
          onNoteClicked={setNoteToEdit}
          onDeleteNoteClicked={deleteNote}
        />
      </Col>
    ))}
  </Row>

  return (
    <Container className={styles.notesPage}>
      <Button
        className={`mb-4 mt-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={() => setShowAddNoteDialog(true)}>
        <FaPlus />
        Add new note
      </Button>

      {notesLoading && <Spinner animation='border' variant='primary' />}
      {showNotesLoadingError && <p>Something went wrong!</p>}
      {!notesLoading && !showNotesLoadingError &&
        <>
          {notes.length > 0
            ? notesGrid
            : <p>Notes notes found.</p>
          }
        </>
      }

      {showAddNoteDialog &&
        <AddEditNoteDialog
          onDismiss={() => setShowAddNoteDialog(false)}
          onNoteSaved={(newNote) => {
            setShowAddNoteDialog(false);
            setNotes([...notes, newNote])
          }}
        />
      }
      {noteToEdit &&
        <AddEditNoteDialog
          noteToEdit={noteToEdit}
          onDismiss={() => setNoteToEdit(null)}
          onNoteSaved={(updatedNote) => {
            setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote));
            setNoteToEdit(null);
          }}
        />
      }
    </Container>
  );
}

export default App;
