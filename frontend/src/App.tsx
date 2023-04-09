import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";

import { Note as NoteModel } from './models/note';
import Note from './components/note/index';
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";
import AddEditNoteDialog from './components/addEditNoteDialog';
import * as NoteAPI from './Api/noteApi';

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const response = await NoteAPI.fetchNotes();
        setNotes(response.data);
      } catch (error) {
        console.error(error);
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

  return (
    <Container>
      <Button
        className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={() => setShowAddNoteDialog(true)}>
        Add new note
      </Button>
      <Row xs={1} md={2} xl={3} className="g-4">
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
