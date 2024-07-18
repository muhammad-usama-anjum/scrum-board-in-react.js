import React, { useState, useEffect, useRef } from 'react';
import TaskForm from './TaskForm';
import Column from './Column';
import ActionButtons from './ActionButtons';
import Modal from './Modal';
import '../styles/ScrumBoard.css';

const initialTaskState = {
  title: '',
  description: '',
  assignee: '',
  dueDate: '',
  status: 'todo',
  spentTime: 0,
  priority: 'normal'
};

const ScrumBoard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [task, setTask] = useState(initialTaskState);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTask, setEditedTask] = useState(initialTaskState);
  const [activeTask, setActiveTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTask, setModalTask] = useState(null);
  const [columns, setColumns] = useState([
    { title: "Backlog", tasks: [] },
    { title: "Open", tasks: [] },
    { title: "New Tasks", tasks: [] },
    { title: "In Progress", tasks: [] },
    { title: "Feedback Needed", tasks: [] },
    { title: "Ready for Testing", tasks: [] },
    { title: "QA in Progress", tasks: [] },
  ]);
  const [dragStartColumnIndex, setDragStartColumnIndex] = useState(null);
  const [dragStartTaskIndex, setDragStartTaskIndex] = useState(null);

  const fileInputRef = useRef();

  const filteredTasks = (tasks) => {
    if (!searchQuery) return tasks;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return tasks.filter(task => task.title.toLowerCase().includes(lowerCaseQuery));
  };

  const onDragStart = (task, columnIndex, taskIndex) => {
    setDragStartColumnIndex(columnIndex);
    setDragStartTaskIndex(taskIndex);
  };

  const onDragEnd = () => {
    setDragStartColumnIndex(null);
    setDragStartTaskIndex(null);
  };

  const onDrop = (dropColumnIndex) => {
    if (dragStartColumnIndex !== null && dragStartTaskIndex !== null) {
      const draggedTask = columns[dragStartColumnIndex].tasks.splice(dragStartTaskIndex, 1)[0];
      columns[dropColumnIndex].tasks.push(draggedTask);
      setColumns([...columns]);
      saveTasksToLocalStorage();
    }
  };

  const showAddTaskForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  const submitTask = () => {
    columns[0].tasks.push({ ...task });
    resetTaskForm();
    setShowForm(false);
    saveTasksToLocalStorage();
  };

  const openTaskDetails = (task) => setActiveTask(task);
  const openEditForm = (task) => {
    setEditedTask({ ...task });
    setEditingTask(task);
  };

  const submitEditedTask = () => {
    Object.assign(editingTask, editedTask);
    setEditingTask(null);
    setEditedTask(initialTaskState);
    saveTasksToLocalStorage();
  };

  const cancelEdit = () => setEditingTask(null);

  const resetTaskForm = () => setTask(initialTaskState);

  const saveTasksToLocalStorage = () => {
    localStorage.setItem('scrumBoardColumns', JSON.stringify(columns));
  };

  const loadTasksFromLocalStorage = () => {
    const data = localStorage.getItem('scrumBoardColumns');
    if (data) {
      try {
        setColumns(JSON.parse(data));
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  };

  useEffect(() => {
    loadTasksFromLocalStorage();
  }, []);

  const exportTasks = () => {
    const data = JSON.stringify(columns);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const importTasks = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setColumns(data);
        saveTasksToLocalStorage();
      } catch (error) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalTask(null);
  };

  return (
    <div className="scrum-board">
      <h1>AGILE SCRUM BOARD</h1>
      <ActionButtons 
        showAddTaskForm={showAddTaskForm} 
        exportTasks={exportTasks} 
        triggerFileInput={triggerFileInput} 
        fileInputRef={fileInputRef} 
        importTasks={importTasks} 
      />

<div className="columns-container">
        {columns.map((column, index) => (
          <div key={index} className="column-container">
            {column.title === "Backlog" && (
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            <Column
              column={column}
              index={index}
              filteredTasks={filteredTasks}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(index)}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              openTaskDetails={openTaskDetails}
              openEditForm={openEditForm}
              activeTask={activeTask}
            />
          </div>
        ))}
      </div>

      
      {showForm && (
        <TaskForm
          task={task}
          setTask={setTask}
          closeForm={closeForm}
          submitTask={submitTask}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editedTask}
          setTask={setEditedTask}
          closeForm={cancelEdit}
          submitTask={submitEditedTask}
          editing
        />
      )}

      {showModal && modalTask && (
        <Modal 
          modalTask={modalTask}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default ScrumBoard;
