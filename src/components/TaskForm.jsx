import React, { useEffect, useRef } from 'react';
import '../styles/TaskForm.css';

const TaskForm = ({ task, setTask, closeForm, submitTask, editing }) => {
  const formRef = useRef(null);

  useEffect(() => {
    const scrollToTop = () => {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    scrollToTop();
  }, [editing]);

  return (
    <div className="task-form-overlay">
      <div className="task-form" ref={formRef}>
        <h2>{editing ? 'Edit Task' : 'Add New Task'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); submitTask(); }}>
          <label htmlFor="task-title">Title:</label>
          <input type="text" id="task-title" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} required />
          <label htmlFor="task-description">Description:</label>
          <textarea id="task-description" value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })}></textarea>
          <label htmlFor="task-assignee">Assignee:</label>
          <input type="text" id="task-assignee" value={task.assignee} onChange={(e) => setTask({ ...task, assignee: e.target.value })} />
          <label htmlFor="task-due-date">Due Date:</label>
          <input type="date" id="task-due-date" value={task.dueDate} onChange={(e) => setTask({ ...task, dueDate: e.target.value })} />
          <label htmlFor="task-status">Status:</label>
          <select id="task-status" value={task.status} onChange={(e) => setTask({ ...task, status: e.target.value })}>
            <option value="todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <label htmlFor="task-spent-time">Spent Time (hours):</label>
          <input type="number" id="task-spent-time" value={task.spentTime} onChange={(e) => setTask({ ...task, spentTime: e.target.value })} />
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
    </div>
  );
};

export default TaskForm;
