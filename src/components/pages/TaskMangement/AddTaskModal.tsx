import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface AddTaskModalProps {
  showModal: boolean;
  newTask: {
    title: string;
    description: string;
    link: string;
    taskDate: string;
    startTime: string;
    endTime: string;
  };
  addingTask: boolean;
  error: string | null;
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
  onClose,
  onSubmit,
  onTaskChange,
  onErrorClose
}) => {
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">Add New Daily Task</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-400 font-medium">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
            <button onClick={onErrorClose} className="text-red-400 hover:text-red-300">×</button>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => onTaskChange('title', e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => onTaskChange('description', e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300 resize-none"
              rows={3}
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Link <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              value={newTask.link}
              onChange={(e) => onTaskChange('link', e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
              placeholder="https://example.com/task"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={newTask.taskDate}
              onChange={(e) => onTaskChange('taskDate', e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
              min={getTodayDate()}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
              <input
                type="time"
                value={newTask.startTime}
                onChange={(e) => onTaskChange('startTime', e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
              <input
                type="time"
                value={newTask.endTime}
                onChange={(e) => onTaskChange('endTime', e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            disabled={addingTask}
            className="flex-1 bg-gray-700 text-white font-medium py-3 px-4 rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={addingTask}
            className="flex-1 bg-gradient-to-r from-[#00FFA9] to-[#00CC87] text-black font-semibold py-3 px-4 rounded-xl hover:scale-105 transition-all duration-300 disabled:hover:scale-100 disabled:opacity-50 flex items-center justify-center"
          >
            {addingTask ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Adding...
              </>
            ) : (
              'Add Task'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;