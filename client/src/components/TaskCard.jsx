import React from 'react';

const TaskCard = ({ task, onStatusChange, onDelete }) => {
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Low':
        return 'badge-priority-low';
      case 'Medium':
        return 'badge-priority-medium';
      case 'High':
        return 'badge-priority-high';
      default:
        return 'badge-priority-medium';
    }
  };

  return (
    <div className="task-card">
      <div className="task-card-title">{task.title}</div>
      {task.description && (
        <div className="task-card-desc">{task.description}</div>
      )}
      
      <div className="task-card-meta">
        <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
          {task.priority}
        </span>

        <div className="task-actions">
          <select
            className="task-status-select"
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <button 
            className="btn-icon btn-icon-danger" 
            onClick={() => onDelete(task._id)}
            title="Delete Task"
          >
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
