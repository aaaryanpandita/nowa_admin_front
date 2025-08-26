import React from 'react';
import { Loader2, AlertCircle, X } from 'lucide-react';

interface AddTaskModalProps {
  showModal: boolean;
  newTask: {
    id?: string | number;
    title: string;
    description: string;
    link: string;
    taskDate: string;
    startTime: string;
    endTime: string;
  };
  addingTask: boolean;
  error: string | null;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onTaskChange: (field: string, value: string) => void;
  onErrorClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  showModal,
  newTask,
  addingTask,
  error,
  isEditing,
  onClose,
  onSubmit,
  onTaskChange,
  onErrorClose
}) => {
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Task' : 'Add New Daily Task'}
          </h2>
          <button
            onClick={onClose}
            disabled={addingTask}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Error Message */}
    
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => onTaskChange('title', e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
              placeholder="Enter task title"
              required
              disabled={addingTask}
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => onTaskChange('description', e.target.value)}
              rows={3}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300 resize-none"
              placeholder="Enter task description"
              required
              disabled={addingTask}
            />
          </div>

          {/* Task Link */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Link <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              value={newTask.link}
              onChange={(e) => onTaskChange('link', e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
              placeholder="https://example.com"
              required
              disabled={addingTask}
            />
          </div>

          {/* Task Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Date
            </label>
            <input
              type="date"
              value={newTask.taskDate}
              onChange={(e) => onTaskChange('taskDate', e.target.value)}
              min={getTodayDate()}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
              disabled={addingTask}
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={newTask.startTime}
                onChange={(e) => onTaskChange('startTime', e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
                disabled={addingTask}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={newTask.endTime}
                onChange={(e) => onTaskChange('endTime', e.target.value)}
                min={newTask.startTime}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
                disabled={addingTask}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={addingTask}
              className="flex-1 bg-gray-700 text-white font-medium py-3 px-4 rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addingTask || !newTask.title.trim() || !newTask.description.trim()|| !newTask.link.trim()}
              className="flex-1 bg-gradient-to-r from-[#00FFA9] to-[#00CC87] text-black font-semibold py-3 px-4 rounded-xl hover:scale-105 transition-all duration-300 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {addingTask ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {isEditing ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditing ? 'Update Task' : 'Add Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;