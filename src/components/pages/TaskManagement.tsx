import React, { useState } from 'react';
import { Plus, Twitter, MessageSquare, Share, ToggleLeft, ToggleRight, Edit, Trash2 } from 'lucide-react';

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Follow Twitter Account',
      description: 'Follow our official Twitter account @CryptoAdmin',
      reward: 2.5,
      icon: Twitter,
      active: true,
      completions: 1247
    },
    {
      id: 2,
      title: 'Join Telegram Group',
      description: 'Join our Telegram community and stay updated',
      reward: 3.0,
      icon: MessageSquare,
      active: true,
      completions: 956
    },
    {
      id: 3,
      title: 'Share Referral Link',
      description: 'Share your referral link on social media',
      reward: 5.0,
      icon: Share,
      active: false,
      completions: 432
    }
  ]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    reward: '',
    type: 'twitter'
  });

  const toggleTaskStatus = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, active: !task.active } : task
    ));
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.description && newTask.reward) {
      const iconMap = {
        twitter: Twitter,
        telegram: MessageSquare,
        share: Share
      };

      const task = {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        reward: parseFloat(newTask.reward),
        icon: iconMap[newTask.type as keyof typeof iconMap] || Twitter,
        active: true,
        completions: 0
      };

      setTasks([...tasks, task]);
      setNewTask({ title: '', description: '', reward: '', type: 'twitter' });
      setShowAddTask(false);
    }
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="space-y-6">
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

      {/* Task List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const Icon = task.icon;
          return (
            <div key={task.id} className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    task.active ? 'bg-gradient-to-r from-[#00FFA9] to-[#00CC87]' : 'bg-gray-600'
                  }`}>
                    <Icon className={`w-6 h-6 ${task.active ? 'text-black' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                    <p className="text-sm text-gray-400">{task.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Reward:</span>
                  <span className="text-lg font-bold text-[#00FFA9]">${task.reward}</span>
                </div>
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    task.active ? 'text-green-400' : 'text-gray-400'
                  }`}
                >
                  {task.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  <span className="text-sm font-medium">{task.active ? 'Active' : 'Inactive'}</span>
                </button>
              </div>

              <div className="pt-4 border-t border-gray-700/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Completions</span>
                  <span className="text-white font-medium">{task.completions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-white mb-4">Add New Task</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300 resize-none"
                  rows={3}
                  placeholder="Enter task description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Reward (USD)</label>
                <input
                  type="number"
                  value={newTask.reward}
                  onChange={(e) => setNewTask({ ...newTask, reward: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Task Type</label>
                <select
                  value={newTask.type}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#00FFA9] focus:ring-2 focus:ring-[#00FFA9]/25 transition-all duration-300"
                >
                  <option value="twitter">Twitter Task</option>
                  <option value="telegram">Telegram Task</option>
                  <option value="share">Share Task</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddTask(false)}
                className="flex-1 bg-gray-700 text-white font-medium py-3 px-4 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="flex-1 bg-gradient-to-r from-[#00FFA9] to-[#00CC87] text-black font-semibold py-3 px-4 rounded-xl hover:scale-105 transition-all duration-300"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;