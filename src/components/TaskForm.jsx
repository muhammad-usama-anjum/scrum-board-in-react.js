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
    if (task.spentTime === '' || task.spentTime == null) {
      errors.spentTime = 'Spent time is required.';
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
          <textarea id="task-description" required value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })}></textarea>
          
          <label htmlFor="task-assignee">Assignee:</label>
          <input type="text" id="task-assignee" value={task.assignee} onChange={(e) => setTask({ ...task, assignee: e.target.value })} required/>
          
          <label htmlFor="task-due-date">Due Date:</label>
          <input type="date" id="task-due-date" min={today} value={task.dueDate} onChange={(e) => setTask({ ...task, dueDate: e.target.value })} required />

          
          <label htmlFor="task-spent-time">Spent Time (hours):</label>
          <input
  type="number"
  id="task-spent-time"
  value={task.spentTime}
  onChange={(e) => {
    const newSpentTime = e.target.value;
    
    const cleanSpentTime = newSpentTime.replace(/^0+(?!$)/, '');

   
    const floatSpentTime = parseFloat(cleanSpentTime);
    if (!isNaN(floatSpentTime) && floatSpentTime > 0) {
      setTask({ ...task, spentTime: floatSpentTime });
    } else {

      setTask({ ...task, spentTime: '' });
    }
  }}
  min="0"
  step="0.01" 
/>


          
<label htmlFor="task-priority">Priority:</label>
<div className="priority-options">
  <label>
    <input
      type="radio"
      name="priority"
      value="low"
      checked={task.priority === 'low'}
      onChange={(e) => setTask({ ...task, priority: e.target.value })}
    />
    Low
  </label>
  <label>
    <input
      type="radio"
      name="priority"
      value="normal"
      checked={task.priority === 'normal'}
      onChange={(e) => setTask({ ...task, priority: e.target.value })}
    />
    Normal
  </label>
  <label>
    <input
      type="radio"
      name="priority"
      value="high"
      checked={task.priority === 'high'}
      onChange={(e) => setTask({ ...task, priority: e.target.value })}
    />
    High
  </label>
</div>

          
          <div className="form-buttons">
          <button type="button" onClick={closeForm}>Cancel</button>
            <button type="submit">{editing ? 'Save Changes' : 'Add Task'}</button>
            
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
