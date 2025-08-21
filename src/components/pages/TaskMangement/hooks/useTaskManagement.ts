import { useState, useEffect } from 'react';
import { apiService, DailyTask, CreateTaskPayload } from '../../../../services/apiService';

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingTask, setAddingTask] = useState(false);

const fetchTasks = async () => {
  try {
    setLoading(true);
    setError(null);
    console.log('🔄 Fetching tasks...');
    const response = await apiService.getDailyTasks();
    
    console.log('📋 Full API response:', response);
    
    if (response.success && response.result) {
      // Access 'tasks' from 'result'
      const tasksArray = response.result.tasks || [];
      console.log('✅ Setting tasks:', tasksArray);
      setTasks(tasksArray);
    } else {
      console.error('❌ API returned error:', response.message);
      setError(response.message || 'Failed to fetch tasks');
      setTasks([]); // Set empty array on error
    }
  } catch (err) {
    console.error('❌ Network error:', err);
    setError('Network error occurred while fetching tasks');
    setTasks([]); // Set empty array on error
  } finally {
    setLoading(false);
  }
};


  const addTask = async (taskData: {
    title: string;
    description: string;
    link: string;
    taskDate: string;
    startTime: string;
    endTime: string;
  }) => {
    if (!taskData.title || !taskData.description || !taskData.link || !taskData.taskDate) {
      setError('Please fill in all required fields');
      return false;
    }

    try {
      setAddingTask(true);
      setError(null);

      const taskPayload: CreateTaskPayload = {
        tasks: [taskData]
      };

      const response = await apiService.addDailyTask(taskPayload);

      if (response.success) {
        await fetchTasks();
        return true;
      } else {
        setError(response.message || 'Failed to add task');
        return false;
      }
    } catch (err) {
      setError('Network error occurred while adding task');
      console.error('Error adding task:', err);
      return false;
    } finally {
      setAddingTask(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    addingTask,
    addTask,
    setError
  };
};