import React from 'react';
import '../styles/ActionButtons.css';

const ActionButtons = ({ showAddTaskForm, exportTasks, triggerFileInput, fileInputRef, importTasks }) => {
  return (
    <div className="action-buttons">
      <button onClick={showAddTaskForm}>Add Task</button>
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
  );
};

export default ActionButtons;
