import React from 'react';
import TaskCard from './TaskCard';

const TaskGrid = ({ tasks, onStatusChange, onDelete }) => {
  const columns = [
    { id: 'To Do', title: 'To Do' },
    { id: 'In Progress', InProgress: 'In Progress', title: 'In Progress' },
    { id: 'Completed', title: 'Completed' },
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="task-board">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        return (
          <div className="task-column" key={column.id}>
            <div className="column-header">
              <span className="column-title">
                {column.title}
              </span>
              <span className="column-count">{columnTasks.length}</span>
            </div>

            {columnTasks.length === 0 ? (
              <div className="empty-state">No tasks here</div>
            ) : (
              columnTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TaskGrid;
