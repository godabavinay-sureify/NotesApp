import React from 'react'
import { Card } from 'react-bootstrap'

import { formatDate } from '../../utils/formatDate'
import { Note as NoteModel } from '../../models/note'
import styles from './note.module.css'

interface NoteProps {
    note: NoteModel,
    className?: string
}

const Note = ({ note, className }: NoteProps) => {
    const {
        title,
        description,
        createdAt,
        updatedAt
    } = note;

    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = "Updated: " + formatDate(updatedAt);
    } else {
        createdUpdatedText = "Created: " + formatDate(createdAt);
    }

    return (
        <Card className={`${styles.noteCard} ${className}`}>
            <Card.Body className={styles.cardBody}>
                <Card.Title>
                    {title}
                </Card.Title>
                <Card.Text className={styles.cardText}>
                    {description}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    )
}

export default Note