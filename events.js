import { EventEmitter } from 'events';

class TaskEventEmitter extends EventEmitter {}

const taskEvents = new TaskEventEmitter();

// Event Listener 1: Task Created -> Async notification/audit log simulation
taskEvents.on('task:created', (task) => {
  console.log(`[Event: task:created] Task ID: ${task._id || task.id} | Title: "${task.title}"`);
  // Simulate asynchronous notification dispatch / background worker
  setTimeout(() => {
    console.log(`[Async Worker] Notification email queued for task: "${task.title}"`);
  }, 100);
});

// Event Listener 2: Task Updated -> Audit log
taskEvents.on('task:updated', (task) => {
  console.log(`[Event: task:updated] Task ID: ${task._id || task.id} | Status: completed=${task.completed}`);
});

// Event Listener 3: Task Deleted -> Cleanup / analytics event
taskEvents.on('task:deleted', (task) => {
  console.log(`[Event: task:deleted] Task ID: ${task._id || task.id} | Title: "${task.title}"`);
});

export default taskEvents;
