import { createContext, useContext, useReducer, useMemo } from 'react';
import { generateMockTasks } from '../data/mockData';
import { determineWorkflow } from '../utils/validation';

const TaskContext = createContext(null);

function buildInitialState() {
  const rawTasks = generateMockTasks(30);

  const tasks = rawTasks.map((task) => {
    const { workflow, reasons } = determineWorkflow(task, rawTasks);
    return { ...task, workflow, workflowReasons: reasons };
  });

  const processed = tasks.map((task) => {
    if (task.workflow === 'auto') {
      return { ...task, status: 'Complete', notes: 'Auto-completed by system — all routing checks passed' };
    }
    return task;
  });

  return {
    tasks: processed,
    selectedTaskId: null,
    view: 'lead',
    teamFilter: 'All',
    internalLog: [],
  };
}

const initialState = buildInitialState();

function taskReducer(state, action) {
  switch (action.type) {
    case 'ASSIGN_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, assignedTo: action.agentId } : t
        ),
      };

    case 'SET_STATUS':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, status: action.status } : t
        ),
      };

    case 'REJECT_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? {
                ...t,
                status: 'Rejected',
                rejectionReason: action.reason,
                showOnMyQuestrade: action.showOnMyQuestrade ?? t.showOnMyQuestrade,
              }
            : t
        ),
      };

    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, status: 'Complete' } : t
        ),
      };

    case 'SELECT_TASK':
      return { ...state, selectedTaskId: action.taskId };

    case 'SET_VIEW':
      return { ...state, view: action.view };

    case 'SET_TEAM_FILTER':
      return { ...state, teamFilter: action.team };

    case 'UPDATE_TASK_FIELD':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, [action.field]: action.value } : t
        ),
      };

    case 'ADD_COMMENT':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? { ...t, comments: [...(t.comments || []), { text: action.text, visibleToClient: action.visibleToClient, timestamp: new Date().toISOString() }] }
            : t
        ),
      };

    case 'LOG_ENTRY':
      return {
        ...state,
        internalLog: [
          ...state.internalLog,
          {
            timestamp: new Date().toISOString(),
            taskId: action.taskId,
            message: action.message,
            sheet: action.sheet,
          },
        ],
      };

    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
}
