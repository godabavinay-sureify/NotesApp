import { Form, Modal, Button } from "react-bootstrap"
import { useForm } from "react-hook-form"

import { Note } from "../../models/note"
import { CreateNoteBody as CreateNoteInput } from "../../Api/noteApi"
import * as NotesAPI from "../../Api/noteApi"


interface DialogProps {
    noteToEdit?: Note,
    onDismiss: () => void,
    onNoteSaved: (note: Note) => void
}

const AddEditNoteDialog = ({ noteToEdit, onDismiss, onNoteSaved }: DialogProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateNoteInput>({
        defaultValues: {
            title: noteToEdit?.title || "",
            description: noteToEdit?.description || "",
        }
    });

    const onSubmit = async (input: CreateNoteInput) => {
        try {
            let noteResponse;
            if (noteToEdit) {
                noteResponse = await NotesAPI.updateNote(noteToEdit._id, input);
            } else {
                noteResponse = await NotesAPI.createNote(input);
            }
            onNoteSaved(noteResponse.data);
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {noteToEdit ? "Edit note" : "Add note"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Title"
                            isInvalid={!!errors.title}
                            {...register("title", { required: "Required" })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Description"
                            rows={5}
                            {...register("description")}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    form="addEditNoteForm"
                    disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddEditNoteDialog