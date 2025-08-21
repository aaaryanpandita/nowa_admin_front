import React from 'react';
import { Twitter, MessageSquare, Share, ExternalLink, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { DailyTask } from '../../../services/apiService';

interface TaskCardProps {
  task: DailyTask;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getTaskIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('twitter') || titleLower.includes('tweet')) return Twitter;
    if (titleLower.includes('telegram') || titleLower.includes('chat')) return MessageSquare;
    if (titleLower.includes('share') || titleLower.includes('refer')) return Share;
    return ExternalLink;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  const formatTime = (timeString: string | undefined) => {
    // Handle undefined timeString
    if (!timeString) return 'N/A';
    
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', minute: '2-digit', hour12: true 
    });
  };

  const isTaskActive = () => {
    // Since API doesn't return startTime/endTime, we'll consider all tasks as active
    // You might want to implement different logic based on createdAt/updatedAt
    // For now, let's make tasks active if they were created today
    if (!task.createdAt) return false;
    
    const now = new Date();
    const taskCreated = new Date(task.createdAt);
    
    // Check if task was created today (simple active logic)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    taskCreated.setHours(0, 0, 0, 0);
    
    return taskCreated.getTime() >= today.getTime();
  };

  const Icon = getTaskIcon(task.title);
  const active = isTaskActive();

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            active ? 'bg-gradient-to-r from-[#00FFA9] to-[#00CC87]' : 'bg-gray-600'
          }`}>
            <Icon className={`w-6 h-6 ${active ? 'text-black' : 'text-gray-400'}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white line-clamp-1">{task.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{task.description}</p>
          </div>
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
       

        {/* Since API doesn't return startTime/endTime, we'll show creation time instead */}
        {task.createdAt && (
          <div className="flex items-center text-sm text-gray-400">
            <Clock className="w-4 h-4 mr-2" />
            <span>Created: {new Date(task.createdAt).toLocaleTimeString('en-US', { 
              hour: 'numeric', minute: '2-digit', hour12: true 
            })}</span>
          </div>
        )}

        {task.link && (
          <a
            href={task.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-[#00FFA9] hover:text-[#00CC87] transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="truncate">View Task</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default TaskCard;