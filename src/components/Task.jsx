import React, { useState } from 'react';
import '../styles/Task.css';
import Modal from './Modal'; 

const Task = ({ task, onDragStart, onDragEnd, openEditForm }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const openTaskDetails = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', '');
    setDragging(true);
    onDragStart(task);
  };

  const handleDragEnd = () => {
    setDragging(false);
    onDragEnd();
  };

  return (
    <div
      className={`task-card ${task.priority} ${dragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={openTaskDetails}
    >
      <div className="task-header">
        <span className="task-title">{task.title}</span>
        <span className="task-time">{task.spentTime}h</span>
      </div>
      <div className="task-details">
        <div className="task-priority">Priority: {task.priority}</div>
      </div>
      <div className="task-details2">
        <div className="task-assignee">Assignee: {task.assignee}</div>
      </div>

      {modalOpen && <Modal modalTask={task} closeModal={closeModal} />}
      
      <button onClick={(e) => { e.stopPropagation(); openEditForm(task); }} className='edit'>Edit Task</button>
    </div>
  );
};

export default Task;
