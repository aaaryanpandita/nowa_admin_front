import { useState, useEffect } from 'react';
import { apiService, DailyTask, CreateTaskPayload } from '../../../../services/apiService';

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingTask, setAddingTask] = useState(false);
   const [deletingTask, setDeletingTask] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
     
      const response = await apiService.getDailyTasks();
      
     
      
      if (response.success && response.result) {
        const tasksArray = response.result.tasks || [];
        
        setTasks(tasksArray);
      } else {
        console.error('❌ API returned error:', response.message);
        setError(response.message || 'Failed to fetch tasks');
        setTasks([]);
      }
    } catch (err) {
      console.error('❌ Network error:', err);
      setError('Network error occurred while fetching tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

   const deleteTask = async (taskId: string | number) => {
    try {
      setDeletingTask(true);
      setError(null);

      const response = await apiService.deleteDailyTask(taskId);

      if (response.success) {
        await fetchTasks(); // Refresh the tasks list
        return true;
      } else {
        console.error('❌ Delete task failed:', response.message);
        setError(response.message || 'Failed to delete task');
        return false;
      }
    } catch (err) {
      console.error('❌ Delete task error:', err);
      setError('Network error occurred while deleting task');
      return false;
    } finally {
      setDeletingTask(false);
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
    // Validate required fields
    if (!taskData.title.trim()) {
      setError('Task title is required');
      return false;
    }
    
    if (!taskData.description.trim()) {
      setError('Task description is required');
      return false;
    }
    
    if (!taskData.taskDate) {
      setError('Task date is required');
      return false;
    }

    try {
      setAddingTask(true);
      setError(null);

      // Create clean payload for adding (no id field)
      const cleanTask: DailyTask = {
        title: taskData.title.trim(),
        description: taskData.description.trim(),
        link: taskData.link.trim(),
        taskDate: taskData.taskDate,
        startTime: taskData.startTime,
        endTime: taskData.endTime
      };

      const taskPayload: CreateTaskPayload = {
        tasks: [cleanTask]
      };

  
      const response = await apiService.addDailyTask(taskPayload);

      if (response.success) {
        
        await fetchTasks();
        return true;
      } else {
        console.error('❌ Add task failed:', response.message);
        setError(response.message || 'Failed to add task');
        return false;
      }
    } catch (err) {
      console.error('❌ Add task error:', err);
      setError('Network error occurred while adding task');
      return false;
    } finally {
      setAddingTask(false);
    }
  };

  const updateTask = async (taskData: {
    id: string | number | undefined;
    title: string;
    description: string;
    link: string;
    taskDate: string;
    startTime: string;
    endTime: string;
  }) => {
    // Validate required fields
    if (!taskData.id) {
      setError('Task ID is required for update');
      return false;
    }
    
    if (!taskData.title.trim()) {
      setError('Task title is required');
      return false;
    }
    
    if (!taskData.description.trim()) {
      setError('Task description is required');
      return false;
    }
    
    if (!taskData.taskDate) {
      setError('Task date is required');
      return false;
    }

    try {
      setAddingTask(true);
      setError(null);

      // Create clean payload for updating (include id)
      const cleanTask: DailyTask = {
        id: taskData.id,
        title: taskData.title.trim(),
        description: taskData.description.trim(),
        link: taskData.link.trim(),
        taskDate: taskData.taskDate,
        startTime: taskData.startTime,
        endTime: taskData.endTime
      };

      const taskPayload: CreateTaskPayload = {
        tasks: [cleanTask]
      };

      

      const response = await apiService.addDailyTask(taskPayload);

      if (response.success) {
       
        await fetchTasks();
        return true;
      } else {
        console.error('❌ Update task failed:', response.message);
        setError(response.message || 'Failed to update task');
        return false;
      }
    } catch (err) {
      console.error('❌ Update task error:', err);
      setError('Network error occurred while updating task');
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
    deletingTask,
    deleteTask,
    updateTask,
    setError
  };
};