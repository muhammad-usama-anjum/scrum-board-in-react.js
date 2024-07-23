import React from 'react';
import '../styles/ActionButtons.css';

const ActionButtons = ({ showAddTaskForm, exportTasks, triggerFileInput, fileInputRef, importTasks }) => {
  return (
    <div className="action-buttons">
  <div className="left-buttons">
    <button onClick={showAddTaskForm}>Add Task</button>
  </div>
  <div className="right-buttons">
    <button onClick={exportTasks}>Export Tasks</button>
    <button onClick={triggerFileInput}>Import Tasks</button>
    <input
      type="file"
      accept="application/json"
      ref={fileInputRef}
      onChange={importTasks}
      style={{ display: 'none' }}
    />
  </div>
</div>

  );
};

export default ActionButtons;
