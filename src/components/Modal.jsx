import React from 'react';
import '../styles/Modal.css';

const Modal = ({ modalTask, closeModal }) => {
  return (
    <div className="task-modal-overlay" onClick={closeModal}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{modalTask.title}</h2>
        <p><strong>Description:</strong> {modalTask.description}</p>
        <p><strong>Assignee:</strong> {modalTask.assignee}</p>
        <p><strong>Due Date:</strong> {modalTask.dueDate}</p>
        <p><strong>Status:</strong> {modalTask.status}</p>
        <p><strong>Spent Time:</strong> {modalTask.spentTime} hours</p>
        <p><strong>Priority:</strong> {modalTask.priority}</p>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
