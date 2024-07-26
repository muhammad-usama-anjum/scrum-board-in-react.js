import React from 'react';
import Task from './Task';
import '../styles/Column.css';

const Column = ({ 
  column, 
  index, 
  filteredTasks, 
  onDragOver, 
  onDrop, 
  onDragStart, 
  onDragEnd, 
  openTaskDetails, 
  openEditForm,
  showSearchBar,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="column" onDragOver={onDragOver} onDrop={onDrop}>
      <h2>{column.title} ({ column.tasks.length })</h2>
      {showSearchBar && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}
      <div className="tasks">
        {filteredTasks(column.tasks).map((task, taskIndex) => (
          <Task
            key={taskIndex}
            task={task}
            onDragStart={(e) => onDragStart(task, index, taskIndex)}
            onDragEnd={onDragEnd}
            openTaskDetails={openTaskDetails}
            openEditForm={openEditForm}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
