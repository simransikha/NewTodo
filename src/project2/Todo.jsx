import { useEffect, useState } from "react";
import "./style.css"; // Assuming you have a CSS file for styling
import { MdDeleteForever, MdCheck, MdPlayArrow, MdPause, MdMenuBook, MdClose, MdSchedule, MdCheckCircle, MdCalendarToday, MdAdd } from "react-icons/md";

export const Todo = () => {
  const [inputValue, setInputValue] = useState({
    id: "",
    content: "",
    checked: false
  });
  const [task, setTask] = useState([]);
  const [time, setTime] = useState("");
  const [revisions, setRevisions] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [newScheduledTask, setNewScheduledTask] = useState("");

  const handleInputChange = (value) => {
    // Handle the input change logic here
    // Update the inputValue state with the new value
    setInputValue({
      id: Date.now() + Math.random(), // Unique ID for each task
      content: value,
      checked: false, // Default checked state
    })
  }

  //add to local storage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const storedRevisions = JSON.parse(localStorage.getItem("revisions")) || [];
    const storedScheduledTasks = JSON.parse(localStorage.getItem("scheduledTasks")) || [];
    setTask(storedTasks);
    setRevisions(storedRevisions);
    setScheduledTasks(storedScheduledTasks);
  }
  , []);


  const handleSubmit = (e) => {
    const { content } = inputValue;
    e.preventDefault();
    // Handle the form submission logic here
    if (!content || content.trim() === "") {
      return;
    }

    // Log the new task to the console and update the task state
    // This is where you would typically send the task to a server or update the state
    // For now, we'll just log it and update the state
    
    const isTodo = task.find((item) => item.content === content);
    if (isTodo) {   
        alert("Task already exists");
        return;
        }
    
    const newTask = {
      id: Date.now() + Math.random(),
      content: content.trim(),
      checked: false,
      isTimerRunning: false,
      startTime: null,
      totalTime: 0, // in seconds
      elapsedTime: 0, // current session time
      dateCreated: new Date().toISOString()
    };
    
    setInputValue({ id: "", content: "", checked: false }); // Reset input value after submission
    // Log the new task to the console

    console.log("New task added:", newTask);
    const updatedTasks = [...task, newTask];
    setTask(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    // Clear the input field after submission
  };

useEffect(() => {   

  const getTimeandDate = () => {
    const date = new Date();
    const formatDate = date.toLocaleDateString();
    const formatTime = date.toLocaleTimeString();   

    return `${formatDate} - ${formatTime}`;
  };    

    setInterval(() => {
        setTime(getTimeandDate());
      }, 1000);

     

    }, []);

    // Timer update effect
    useEffect(() => {
        const interval = setInterval(() => {
            setTask(currentTasks => 
                currentTasks.map(taskItem => {
                    if (taskItem.isTimerRunning && taskItem.startTime) {
                        const currentTime = Date.now();
                        const elapsedTime = Math.floor((currentTime - taskItem.startTime) / 1000);
                        return { ...taskItem, elapsedTime };
                    }
                    return taskItem;
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleDelete = (item) => {
        // Handle the delete logic here
        console.log("Task deleted:", item);
        // Update the task state to remove the deleted item
        // This is where you would typically send a delete request to a server
        // For now, we'll just filter it out from the state
        // Filter out the item from the task array
        // and update the state
        const updatedTask = task.filter((taskItem) => taskItem.id !== item.id);
        console.log("Updated task list:", updatedTask);
        setTask(updatedTask);
        localStorage.setItem("tasks", JSON.stringify(updatedTask));
    };

    const handleAdd = (item) => {
      
      const updatedTask = task.map((taskItem) => {
            if (taskItem.id === item.id) {
                return { ...taskItem, checked: !taskItem.checked };
            }
            else {
            return taskItem;
        }
        });
    
        setTask(updatedTask);
        localStorage.setItem("tasks", JSON.stringify(updatedTask));
    }

    const handleStartTimer = (item) => {
        const updatedTask = task.map((taskItem) => {
            if (taskItem.id === item.id && !taskItem.isTimerRunning) {
                return { 
                    ...taskItem, 
                    isTimerRunning: true,
                    startTime: Date.now()
                };
            }
            return taskItem;
        });
        setTask(updatedTask);
        localStorage.setItem("tasks", JSON.stringify(updatedTask));
    };

    const handleStopTimer = (item) => {
        const updatedTask = task.map((taskItem) => {
            if (taskItem.id === item.id && taskItem.isTimerRunning) {
                const currentTime = Date.now();
                const sessionTime = Math.floor((currentTime - taskItem.startTime) / 1000);
                return { 
                    ...taskItem, 
                    isTimerRunning: false,
                    startTime: null,
                    totalTime: taskItem.totalTime + sessionTime,
                    elapsedTime: 0
                };
            }
            return taskItem;
        });
        setTask(updatedTask);
        localStorage.setItem("tasks", JSON.stringify(updatedTask));
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

    // Revision Functions
    const handleAddToRevision = (item) => {
        const revisionItem = {
            id: Date.now() + Math.random(),
            originalId: item.id,
            content: item.content,
            dateAdded: new Date().toISOString(),
            revisionDate: selectedDate || new Date().toISOString().split('T')[0],
            isCompleted: false,
            completedDate: null
        };

        const updatedRevisions = [...revisions, revisionItem];
        setRevisions(updatedRevisions);
        localStorage.setItem("revisions", JSON.stringify(updatedRevisions));
        
        // Reset selected date
        setSelectedDate("");
        
        alert("Task added to revision list!");
    };

    const handleCompleteRevision = (revisionItem) => {
        const updatedRevisions = revisions.map(item => {
            if (item.id === revisionItem.id) {
                return {
                    ...item,
                    isCompleted: !item.isCompleted,
                    completedDate: !item.isCompleted ? new Date().toISOString() : null
                };
            }
            return item;
        });
        
        setRevisions(updatedRevisions);
        localStorage.setItem("revisions", JSON.stringify(updatedRevisions));
    };

    const handleUpdateRevisionDate = (revisionItem, newDate) => {
        const updatedRevisions = revisions.map(item => {
            if (item.id === revisionItem.id) {
                return { ...item, revisionDate: newDate };
            }
            return item;
        });
        
        setRevisions(updatedRevisions);
        localStorage.setItem("revisions", JSON.stringify(updatedRevisions));
    };

    const handleDeleteRevision = (revisionItem) => {
        const updatedRevisions = revisions.filter(item => item.id !== revisionItem.id);
        setRevisions(updatedRevisions);
        localStorage.setItem("revisions", JSON.stringify(updatedRevisions));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Calendar and Scheduled Tasks Functions
    const addScheduledTask = () => {
        if (!newScheduledTask.trim()) return;

        const scheduledTask = {
            id: Date.now() + Math.random(),
            content: newScheduledTask.trim(),
            date: selectedCalendarDate,
            dateCreated: new Date().toISOString(),
            completed: false
        };

        const updatedScheduledTasks = [...scheduledTasks, scheduledTask];
        setScheduledTasks(updatedScheduledTasks);
        localStorage.setItem("scheduledTasks", JSON.stringify(updatedScheduledTasks));
        setNewScheduledTask("");
    };

    const getTasksForDate = (date) => {
        const tasksForDate = task.filter(t => t.dateCreated.split('T')[0] === date);
        const scheduledForDate = scheduledTasks.filter(t => t.date === date);
        return { tasks: tasksForDate, scheduled: scheduledForDate };
    };

    const toggleScheduledTask = (taskId) => {
        const updatedScheduledTasks = scheduledTasks.map(item => {
            if (item.id === taskId) {
                return { ...item, completed: !item.completed };
            }
            return item;
        });
        setScheduledTasks(updatedScheduledTasks);
        localStorage.setItem("scheduledTasks", JSON.stringify(updatedScheduledTasks));
    };

    const deleteScheduledTask = (taskId) => {
        const updatedScheduledTasks = scheduledTasks.filter(item => item.id !== taskId);
        setScheduledTasks(updatedScheduledTasks);
        localStorage.setItem("scheduledTasks", JSON.stringify(updatedScheduledTasks));
    };


  return (
    <div className="app-container">
      {/* Sidebar for Revisions */}
      <div className={`sidebar ${showSidebar ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-nav">
            <button 
              className={`nav-btn ${!showCalendar ? 'active' : ''}`}
              onClick={() => setShowCalendar(false)}
            >
              <MdMenuBook /> Revisions
            </button>
            <button 
              className={`nav-btn ${showCalendar ? 'active' : ''}`}
              onClick={() => setShowCalendar(true)}
            >
              <MdCalendarToday /> Calendar
            </button>
          </div>
          <button className="close-sidebar" onClick={() => setShowSidebar(false)}>
            <MdClose />
          </button>
        </div>
        
        <div className="sidebar-content">
          {!showCalendar ? (
            // Revision View
            <>
              {revisions.length === 0 ? (
                <p className="no-revisions">No revisions added yet</p>
              ) : (
                <ul className="revision-list">
                  {revisions.map((revision) => (
                    <li key={revision.id} className={`revision-item ${revision.isCompleted ? 'completed' : ''}`}>
                      <div className="revision-content">
                        <span className="revision-text">{revision.content}</span>
                        <div className="revision-dates">
                          <span className="added-date">Added: {formatDate(revision.dateAdded)}</span>
                          <div className="revision-date-container">
                            <span>Revise by: </span>
                            <input
                              type="date"
                              value={revision.revisionDate}
                              onChange={(e) => handleUpdateRevisionDate(revision, e.target.value)}
                              className="revision-date-input"
                            />
                          </div>
                        </div>
                        
                        {/* Completion Status Display */}
                        <div className={`revision-completion-status ${revision.isCompleted ? 'completed' : 'pending'}`}>
                          {revision.isCompleted ? (
                            <>
                              ✅ Completed on {formatDate(revision.completedDate)}
                            </>
                          ) : (
                            <>
                              📅 Pending Revision
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="revision-actions">
                        <button 
                          className={`revision-complete-btn ${revision.isCompleted ? 'completed' : ''}`}
                          onClick={() => handleCompleteRevision(revision)}
                          title={revision.isCompleted ? "Mark as pending" : "Mark as completed"}
                        >
                          <MdCheckCircle />
                        </button>
                        
                        <button 
                          className="revision-delete-btn"
                          onClick={() => handleDeleteRevision(revision)}
                          title="Delete revision"
                        >
                          <MdDeleteForever />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            // Calendar View
            <div className="calendar-view">
              <div className="calendar-header">
                <h3>Task Calendar</h3>
                <input
                  type="date"
                  value={selectedCalendarDate}
                  onChange={(e) => setSelectedCalendarDate(e.target.value)}
                  className="calendar-date-picker"
                />
              </div>
              
              <div className="add-scheduled-task">
                <input
                  type="text"
                  value={newScheduledTask}
                  onChange={(e) => setNewScheduledTask(e.target.value)}
                  placeholder="Add task for selected date..."
                  className="scheduled-task-input"
                />
                <button onClick={addScheduledTask} className="add-scheduled-btn">
                  <MdAdd />
                </button>
              </div>

              <div className="calendar-content">
                <div className="date-info">
                  <h4>Tasks for {formatDate(selectedCalendarDate)}</h4>
                </div>

                {(() => {
                  const dateData = getTasksForDate(selectedCalendarDate);
                  return (
                    <>
                      {/* Completed Tasks for this date */}
                      {dateData.tasks.length > 0 && (
                        <div className="calendar-section">
                          <h5>Completed Tasks:</h5>
                          <ul className="calendar-task-list">
                            {dateData.tasks.map(task => (
                              <li key={task.id} className="calendar-task-item">
                                <span className={task.checked ? 'task-completed' : 'task-pending'}>
                                  {task.content}
                                </span>
                                <div className="task-meta">
                                  {task.totalTime > 0 && (
                                    <span className="task-time">⏱️ {formatTime(task.totalTime)}</span>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Scheduled Tasks for this date */}
                      {dateData.scheduled.length > 0 && (
                        <div className="calendar-section">
                          <h5>Scheduled Tasks:</h5>
                          <ul className="calendar-task-list">
                            {dateData.scheduled.map(scheduledTask => (
                              <li key={scheduledTask.id} className="calendar-task-item scheduled">
                                <span className={scheduledTask.completed ? 'task-completed' : 'task-pending'}>
                                  {scheduledTask.content}
                                </span>
                                <div className="scheduled-actions">
                                  <button
                                    onClick={() => toggleScheduledTask(scheduledTask.id)}
                                    className="scheduled-toggle"
                                  >
                                    {scheduledTask.completed ? '✅' : '⭕'}
                                  </button>
                                  <button
                                    onClick={() => deleteScheduledTask(scheduledTask.id)}
                                    className="scheduled-delete"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {dateData.tasks.length === 0 && dateData.scheduled.length === 0 && (
                        <p className="no-tasks-date">No tasks for this date</p>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Todo Container */}
      <section className="todo-container">
        <header>
          <div className="header-content">
            <span>Todo List</span>
            <button className="revision-toggle" onClick={() => setShowSidebar(!showSidebar)}>
              <MdMenuBook />
              <span>Revisions ({revisions.length})</span>
            </button>
          </div>
        </header>
        
        <h2 className="timestamp">{time}</h2>
        
        <section className="form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Add a new task..."
              autoComplete="off"
              value={inputValue.content}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <button className="add-btn">
              <MdAdd />
              Add Task
            </button>
          </form>
        </section>
        
        <section className="task-list">
          <ul className="task-items">
            {task.map((item) => (
              <li key={item.id} className="task-item">
                <div className="task-main">
                  <span className={item.checked ? "checked" : "nochecked"}>{item.content}</span>
                </div>
                
                <div className="timer-section">
                  <div className="timer-display">
                    {item.isTimerRunning ? (
                      <span className="timer-running">
                        Running: {formatTime(item.elapsedTime)}
                      </span>
                    ) : (
                      <span className="timer-total">
                        Total: {formatTime(item.totalTime || 0)}
                      </span>
                    )}
                  </div>
                  
                  <div className="timer-controls">
                    {item.isTimerRunning ? (
                      <button className="timer-btn stop-btn" onClick={() => handleStopTimer(item)}>
                        <MdPause />
                      </button>
                    ) : (
                      <button className="timer-btn start-btn" onClick={() => handleStartTimer(item)}>
                        <MdPlayArrow />
                      </button>
                    )}
                  </div>
                </div>

                <div className="task-actions">
                  <div className="revision-section">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="revision-date-picker"
                      title="Select revision date"
                    />
                    <button 
                      className="revision-btn" 
                      onClick={() => handleAddToRevision(item)}
                      title="Add to revision list"
                    >
                      <MdMenuBook />
                    </button>
                  </div>
                  
                  <button className="delete-icon" onClick={() => handleDelete(item)}>
                    <MdDeleteForever />
                  </button>

                  <button className="add-icon" onClick={() => handleAdd(item)}>
                    <MdCheck />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
        
        <section>
          <button className="clear-btn" onClick={() => {
            setTask([]);
            localStorage.setItem("tasks", JSON.stringify([]));
          }}>
            Clear Task   
          </button>
        </section>
      </section>
    </div>
  );
};
