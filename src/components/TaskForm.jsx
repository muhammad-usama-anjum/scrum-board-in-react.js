import React, { useEffect, useRef, useState } from 'react';
import '../styles/TaskForm.css';

const TaskForm = ({ task, setTask, closeForm, submitTask, editing }) => {
  const formRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const scrollToTop = () => {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    scrollToTop();
  }, [editing]);

  const validateForm = () => {
    const errors = {};
    const today = new Date().toISOString().split('T')[0];

    if (task.dueDate && task.dueDate < today) {
      errors.dueDate = 'Due date cannot be in the past.';
    }
    if (task.spentTime < 0) {
      errors.spentTime = 'Spent time cannot be less than 0.';
    }

    setErrors(errors);
    setShowPopup(Object.keys(errors).length > 0);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      submitTask();
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="task-form-overlay">
      <div className="task-form" ref={formRef}>
        <h2>{editing ? 'Edit Task' : 'Add New Task'}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="task-title">Title:</label>
          <input type="text" id="task-title" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} required />
          
          <label htmlFor="task-description">Description:</label>
          <textarea id="task-description" value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })}></textarea>
          
          <label htmlFor="task-assignee">Assignee:</label>
          <input type="text" id="task-assignee" value={task.assignee} onChange={(e) => setTask({ ...task, assignee: e.target.value })} />
          
          <label htmlFor="task-due-date">Due Date:</label>
          <input type="date" id="task-due-date" min={today} value={task.dueDate} onChange={(e) => setTask({ ...task, dueDate: e.target.value })} />
          
          <label htmlFor="task-status">Status:</label>
          <select id="task-status" value={task.status} onChange={(e) => setTask({ ...task, status: e.target.value })}>
            <option value="Todo">To Do</option>
            <option value="Open">Open</option>
            <option value="New task">New Task</option>
            <option value="In progress">In Progress</option>
            <option value="Feedback needed">Feedback needed</option>
            <option value="Ready for testing">Ready for testing</option>
            <option value="QA in progress">QA in progress</option>
            <option value="Done">Done</option>
          </select>
          
          <label htmlFor="task-spent-time">Spent Time (hours):</label>
          <input
            type="number"
            id="task-spent-time"
            value={task.spentTime}
            onChange={(e) => {
              const newSpentTime = e.target.value;
              setTask({ ...task, spentTime: newSpentTime });
              if (newSpentTime < 0) {
                setErrors({ spentTime: 'Spent time cannot be less than 0.' });
                setShowPopup(true);
              } else {
                setErrors({});
                setShowPopup(false);
              }
            }}
            min="0"
          />
          
          <label htmlFor="task-priority">Priority:</label>
          <select id="task-priority" value={task.priority} onChange={(e) => setTask({ ...task, priority: e.target.value })}>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
          
          <div className="form-buttons">
            <button type="submit">{editing ? 'Save Changes' : 'Add Task'}</button>
            <button type="button" onClick={closeForm}>Cancel</button>
          </div>
        </form>
      </div>

      {showPopup && (
        <div className="error-popup">
          <div className="error-popup-content">
            <h3>Validation Errors</h3>
            <ul>
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskForm;
