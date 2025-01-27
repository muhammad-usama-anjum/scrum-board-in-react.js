import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid'; 
import TaskForm from './TaskForm';
import Column from './Column';
import ActionButtons from './ActionButtons';
import Modal from './Modal';
import '../styles/ScrumBoard.css';

const initialTaskState = {
  id: '',
  title: '',
  description: '',
  assignee: '',
  dueDate: '',
  status: 'Backlog',
  spentTime: 0,
  priority: 'normal'
};

const ScrumBoard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [task, setTask] = useState({ ...initialTaskState, id: uuidv4() });
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
      draggedTask.status = columns[dropColumnIndex].title;
      columns[dropColumnIndex].tasks.push(draggedTask);
      setColumns([...columns]);
      saveTasksToLocalStorage([...columns]);
    }
  };

  const showAddTaskForm = () => {
    setTask({ ...initialTaskState, id: uuidv4() });
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const submitTask = () => {
    columns[0].tasks.unshift({ ...task });
    resetTaskForm();
    setShowForm(false);
    setColumns([...columns]);
    saveTasksToLocalStorage([...columns]);
  };

  const openTaskDetails = (task) => setActiveTask(task);
  const openEditForm = (task) => {
    setEditedTask({ ...task });
    setEditingTask(task);
  };

  const submitEditedTask = () => {
    let taskUpdated = false;

    const updatedColumns = columns.map(column => {
      const taskIndex = column.tasks.findIndex(t => t.id === editingTask.id);

      if (taskIndex !== -1) {
        column.tasks[taskIndex] = { ...editedTask };
        taskUpdated = true;
      }

      return column;
    });

    if (taskUpdated) {
      setColumns(updatedColumns); 
      setEditingTask(null); 
      setEditedTask(initialTaskState); 
      saveTasksToLocalStorage(updatedColumns); 
    } else {
      console.error("Task not found in any column.");
    }
  };

  const cancelEdit = () => setEditingTask(null);

  const resetTaskForm = () => setTask({ ...initialTaskState, id: uuidv4() });

  const saveTasksToLocalStorage = (columnsToSave) => {
    localStorage.setItem('scrumBoardColumns', JSON.stringify(columnsToSave));
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
        const newData = JSON.parse(e.target.result);
  
        setColumns((prevColumns) => {
          const existingTaskMap = new Map();
          prevColumns.forEach(column => {
            column.tasks.forEach(task => {
              existingTaskMap.set(task.id, task);
            });
          });
  
          const updatedColumns = prevColumns.map(column => {
            const newColumn = newData.find(col => col.title === column.title);
            if (newColumn) {
              const updatedTasks = column.tasks.map(task => {
                const newTask = newColumn.tasks.find(t => t.id === task.id);
                return newTask ? { ...task, ...newTask } : task;
              });
              const newTasks = newColumn.tasks.filter(task => !existingTaskMap.has(task.id));
              return { ...column, tasks: [...updatedTasks, ...newTasks] };
            }
            return column;
          });
  
          newData.forEach(newColumn => {
            if (!updatedColumns.find(col => col.title === newColumn.title)) {
              const uniqueTasks = newColumn.tasks.filter(task => !existingTaskMap.has(task.id));
              if (uniqueTasks.length > 0) {
                updatedColumns.push({ ...newColumn, tasks: uniqueTasks });
              }
            }
          });
  
          saveTasksToLocalStorage(updatedColumns);
          return updatedColumns;
        });
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
      <h3>NOTE: Only .JSON file that downloaded from this board can be imported or the file with similar column structure and data can be imported</h3>

      <div className="columns-container">
        {columns.map((column, index) => (
          <div key={index} className="column-container">
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
              showSearchBar={column.title === "Backlog"}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
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
