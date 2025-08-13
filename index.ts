import fs from 'fs';

interface Task {
  text: string;
  done: boolean;
  createdAt: string;
}

const filePath = './tasks.json';


function loadTasks(): Task[] {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Task[];
}


function saveTasks(tasks: Task[]): void {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}


function addTask(taskText: string): void {
  const tasks = loadTasks();
  tasks.push({ text: taskText, done: false, createdAt: new Date().toISOString() });
  saveTasks(tasks);
  console.log(`✅ Task added: "${taskText}"`);
}

function listTasks(): void {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log('📭 No tasks found.');
    return;
  }
  tasks.forEach((task, index) => {
    const status = task.done ? '[✔]' : '[ ]';
    console.log(`${index + 1}. ${status} ${task.text}`);
  });
}


function markDone(index: number): void {
  const tasks = loadTasks();
  const task = tasks[index - 1];
  if (task) {
    task.done = true;
    saveTasks(tasks);
    console.log(`✅ Task #${index} marked as done.`);
  } else {
    console.log(`❌ Task #${index} not found.`);
  }
}


function deleteTask(index: number): void {
  const tasks = loadTasks();
  const task = tasks[index - 1];
  if (task) {
    tasks.splice(index - 1, 1);
    saveTasks(tasks);
    console.log(`🗑 Task deleted: "${task.text}"`);
  } else {
    console.log(`❌ Task #${index} not found.`);
  }
}


const [, , command, ...args] = process.argv;

switch (command) {
  case 'add':
    addTask(args.join(' '));
    break;
  case 'list':
    listTasks();
    break;
  case 'done':
    markDone(parseInt(args[0], 10));
    break;
  case 'delete':
    deleteTask(parseInt(args[0], 10));
    break;
  default:
    console.log(`
📌 Usage:
  npm start -- add "Task name"   → Add new task
  npm start -- list              → List all tasks
  npm start -- done 2            → Mark task #2 as done
  npm start -- delete 3          → Delete task #3
    `);
}
