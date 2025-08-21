import React from 'react';
import { Twitter, MessageSquare, Share, ExternalLink, Edit, Calendar, Clock } from 'lucide-react';
import { DailyTask } from '../../../services/apiService';

interface TaskCardProps {
  task: DailyTask;
  onEdit: (task: DailyTask) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const getTaskIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('twitter') || titleLower.includes('tweet')) return Twitter;
    if (titleLower.includes('telegram') || titleLower.includes('chat')) return MessageSquare;
    if (titleLower.includes('share') || titleLower.includes('refer')) return Share;
    return ExternalLink;
  };

  const isTaskActive = () => {
    if (!task.taskDate || !task.startTime || !task.endTime) return false;
    
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentTime = now.toTimeString().split(' ')[0].slice(0, 5); // HH:MM
    
    // Check if task is for today
    if (task.taskDate !== currentDate) {
      return task.taskDate > currentDate; // Future task
    }
    
    // If task is for today, check if we're within the time range
    const startTime = task.startTime.slice(0, 5); // Get HH:MM from HH:MM:SS
    const endTime = task.endTime.slice(0, 5); // Get HH:MM from HH:MM:SS
    return currentTime >= startTime && currentTime <= endTime;
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // Convert HH:MM:SS to HH:MM AM/PM format
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${period}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const Icon = getTaskIcon(task.title);
  const active = isTaskActive();

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            active ? 'bg-gradient-to-r from-[#00FFA9] to-[#00CC87]' : 'bg-gray-600'
          }`}>
            <Icon className={`w-6 h-6   'text-gray-400'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white line-clamp-1">{task.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{task.description}</p>
          </div>
        </div>
        <div className="flex space-x-2 opacity-100 group-hover:opacity-100 transition-opacity flex-shrink-0">
  <button 
    onClick={handleEdit}
    className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
    title="Edit task"
  >
    <Edit className="w-4 h-4" />
  </button>
</div>

      </div>

      <div className="space-y-3">
        {/* Task Date */}
        {task.taskDate && (
          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Date: {formatDate(task.taskDate)}</span>
          </div>
        )}

        {/* Start and End Time */}
        {task.startTime && task.endTime && (
          <div className="flex items-center text-sm text-gray-400">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Time: {formatTime(task.startTime)} - {formatTime(task.endTime)}</span>
          </div>
        )}

        {/* Active Status Badge */}
        

        {/* Task Link */}
        {task.link && (
          <a
            href={task.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-[#00FFA9] hover:text-[#00CC87] transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">View Task</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default TaskCard;