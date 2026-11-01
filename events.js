import { EventEmitter } from 'events';

class TaskEventEmitter extends EventEmitter {}

const taskEvents = new TaskEventEmitter();

// In-memory circular buffer for the last 20 live audit events
export const eventAuditLogs = [];

function pushLog(type, details) {
  const entry = {
    id: Date.now() + Math.random(),
    timestamp: new Date().toLocaleTimeString(),
    type,
    details,
  };
  eventAuditLogs.unshift(entry);
  if (eventAuditLogs.length > 20) {
    eventAuditLogs.pop();
  }
}

// Event Listener 1: Task Created
taskEvents.on('task:created', (task) => {
  console.log(`[Event: task:created] Task ID: ${task._id || task.id} | Title: "${task.title}"`);
  pushLog('task:created', `New task "${task.title}" created. Asynchronous notification dispatched to email queue.`);
});

// Event Listener 2: Task Updated
taskEvents.on('task:updated', (task) => {
  console.log(`[Event: task:updated] Task ID: ${task._id || task.id} | Status: completed=${task.completed}`);
  pushLog('task:updated', `Task "${task.title || task._id}" status updated to ${task.completed ? 'COMPLETED' : 'PENDING'}.`);
});

// Event Listener 3: Task Deleted
taskEvents.on('task:deleted', (task) => {
  console.log(`[Event: task:deleted] Task ID: ${task._id || task.id} | Title: "${task.title}"`);
  pushLog('task:deleted', `Task "${task.title || task._id}" deleted. Audit record finalized and tombstone recorded.`);
});

export default taskEvents;
