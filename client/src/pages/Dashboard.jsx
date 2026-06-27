import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../services/axiosInstance';
import Navbar from '../components/Navbar';
import TaskGrid from '../components/TaskGrid';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskStatus, setTaskStatus] = useState('To Do');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to load tasks:', err.message);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle status update
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Optimistic update
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
      
      await axiosInstance.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task status:', err.message);
      // Revert on failure
      fetchTasks();
    }
  };

  // Handle delete task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      // Optimistic delete
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));
      
      await axiosInstance.delete(`/tasks/${taskId}`);
    } catch (err) {
      console.error('Failed to delete task:', err.message);
      // Revert on failure
      fetchTasks();
    }
  };

  // Handle create task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setFormError('Task title is required');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post('/tasks', {
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        priority: taskPriority,
        status: taskStatus,
      });

      setTasks((prevTasks) => [response.data, ...prevTasks]);
      
      // Reset form
      setTaskTitle('');
      setTaskDesc('');
      setTaskPriority('Medium');
      setTaskStatus('To Do');
      setIsCreateOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compute stats
  const totalCount = tasks.length;
  const todoCount = tasks.filter((t) => t.status === 'To Do').length;
  const progressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-content">
        {/* Metrics Row */}
        <section className="metrics-row">
          <div className="metric-card">
            <span className="metric-label">Total Tasks</span>
            <span className="metric-value">{totalCount}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">To Do</span>
            <span className="metric-value">{todoCount}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">In Progress</span>
            <span className="metric-value">{progressCount}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Completed</span>
            <span className="metric-value">{completedCount}</span>
          </div>
        </section>

        {/* Tasks Section Header */}
        <section className="tasks-header">
          <div className="tasks-title">
            <h3>Your Tasks</h3>
          </div>
          <button 
            className="btn btn-create-task"
            onClick={() => setIsCreateOpen(true)}
          >
            + New Task
          </button>
        </section>

        {/* Task Grid Board */}
        {loadingTasks ? (
          <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
            Loading tasks...
          </div>
        ) : (
          <TaskGrid 
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTask}
          />
        )}
      </main>

      {/* Task Creation Modal */}
      {isCreateOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Create Task</h4>
              <button className="modal-close" onClick={() => setIsCreateOpen(false)}>&times;</button>
            </div>

            {formError && <div className="alert alert-danger">{formError}</div>}

            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label" htmlFor="task-title">Title</label>
                <input
                  type="text"
                  id="task-title"
                  className="form-input"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="E.g., Finalize presentation slides"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-desc">Description</label>
                <textarea
                  id="task-desc"
                  className="form-input"
                  rows="3"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Enter details..."
                  disabled={isSubmitting}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  className="form-input"
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  className="form-input"
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
