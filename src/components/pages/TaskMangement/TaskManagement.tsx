import React, { useState } from 'react';
import { Plus, Loader2, AlertCircle, Calendar } from 'lucide-react';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import { useTaskManagement } from './hooks/useTaskManagement';
import { DailyTask } from '../../../services/apiService';

const TaskManagement: React.FC = () => {
  const { tasks, loading, error, addingTask, addTask, updateTask, setError } = useTaskManagement();

  const [showAddTask, setShowAddTask] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTask, setNewTask] = useState({
    id: undefined as string | number | undefined,
    title: '',
    description: '',
    link: '',
    taskDate: '',
    startTime: '09:00',
    endTime: '23:59'
  });

  const resetForm = () => {
    setNewTask({
      id: undefined,
      title: '',
      description: '',
      link: '',
      taskDate: '',
      startTime: '09:00',
      endTime: '23:59'
    });
    setIsEditing(false);
  };

  // Helper function to validate time
  const validateTimeRange = (startTime: string, endTime: string): boolean => {
    if (!startTime || !endTime) return true; // Skip validation if either time is empty
    
    // Convert time strings to minutes for comparison
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    return endTotalMinutes > startTotalMinutes;
  };

  const handleTaskChange = (field: string, value: string) => {
    setNewTask((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Clear any existing time validation error when user changes time
      if ((field === 'startTime' || field === 'endTime') && error && error.includes('End time must be greater than start time')) {
        setError(null);
      }
      
      return updated;
    });
  };

  const handleAddTask = async () => {
    // Basic validation
    if (!newTask.title.trim() || !newTask.description.trim()) {
      setError('Task title and description are required');
      return;
    }

    // Time validation
    if (!validateTimeRange(newTask.startTime, newTask.endTime)) {
      setError('End time must be greater than start time');
      return;
    }

    const success = isEditing ? await updateTask(newTask) : await addTask(newTask);
    if (success) {
      resetForm();
      setShowAddTask(false);
    }
  };

  const handleEditTask = (task: DailyTask) => {
    setNewTask({
      id: task.id,
      title: task.title,
      description: task.description,
      link: task.link,
      taskDate: task.taskDate || '',
      startTime: task.startTime || '09:00',
      endTime: task.endTime || '23:59'
    });
    setIsEditing(true);
    setShowAddTask(true);
  };

  const handleCloseModal = () => {
    setShowAddTask(false);
    setError(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading tasks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Task Management</h1>
          <p className="text-gray-400 mt-2">Create and manage daily tasks for users</p>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-[#00FFA9] to-[#00CC87] text-black font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-[#00FFA9]/25"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-400 font-medium">Error</p>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">×</button>
        </div>
      )}

      {/* Task List */}
      {!Array.isArray(tasks) || tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No tasks found</h3>
          <p className="text-gray-500">Create your first daily task to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <TaskCard 
              key={task.id || index} 
              task={task} 
              onEdit={handleEditTask}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Task Modal */}
      <AddTaskModal
        showModal={showAddTask}
        newTask={newTask}
        addingTask={addingTask}
        error={error}
        isEditing={isEditing}
        onClose={handleCloseModal}
        onSubmit={handleAddTask}
        onTaskChange={handleTaskChange}
        onErrorClose={() => setError(null)}
      />
    </div>
  );
};

export default TaskManagement;