import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { randomUUID } from "crypto";
import { saveContact, getContacts } from "./src/lib/db.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: true }));
app.use(express.json());

let isRunning = false;
let tasks = [
  {
    id: randomUUID(),
    taskName: "Batch_A",
    priority: "High",
    executionTime: 120,
    deadline: 240,
    cpuRequirement: 45,
    memoryRequirement: 120,
    status: "waiting",
    assignedProcessor: null,
    remainingTime: 120,
  },
  {
    id: randomUUID(),
    taskName: "Batch_B",
    priority: "Medium",
    executionTime: 220,
    deadline: 360,
    cpuRequirement: 35,
    memoryRequirement: 160,
    status: "waiting",
    assignedProcessor: null,
    remainingTime: 220,
  },
];

let processors = [
  {
    id: "proc-1",
    processorName: "Node Alpha",
    totalCapacity: 100,
    availableCapacity: 100,
    frequency: 3.5,
    voltage: 1.2,
    temperature: 42,
    utilization: 0,
  },
  {
    id: "proc-2",
    processorName: "Node Beta",
    totalCapacity: 100,
    availableCapacity: 100,
    frequency: 3.4,
    voltage: 1.15,
    temperature: 40,
    utilization: 0,
  },
];

const getAnalytics = () => {
  const runningTasks = tasks.filter((task) => task.status === "running").length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const totalTasks = tasks.length;
  const energySaved = Math.round(tasks.reduce((sum, task) => sum + (task.cpuRequirement * 0.18), 0) * 10) / 10;
  const throughput = Math.round(tasks.filter((task) => task.status === "completed").length * 12);
  const cpuUtilization = Math.round(processors.reduce((sum, p) => sum + p.utilization, 0) / processors.length);

  return {
    totalTasks,
    runningTasks,
    completedTasks,
    activeProcessors: processors.filter((p) => p.active !== false).length,
    energySaved,
    throughput,
    cpuUtilization,
  };
};

const getPerformanceData = () => [
  { algorithm: "Greedy", energy: 85, throughput: 70, efficiency: 78 },
  { algorithm: "Optimization", energy: 45, throughput: 95, efficiency: 92 },
];

// Simulate allocation for comparison between Greedy and a simple Optimization (best-fit decreasing)
const simulateAllocation = (tasksInput, processorsInput, mode = "greedy") => {
  // Clone inputs
  const tasksCopy = tasksInput.map(t => ({ ...t }));
  const procs = processorsInput.map(p => ({ ...p, available: (p.totalCapacity ?? 100) - (p.utilization ?? 0) }));

  // helper to compute simple energy metric
  const computeEnergy = (assignments) => {
    // energy proportional to CPU allocated
    return Math.round(assignments.reduce((s, a) => s + (a.cpuRequirement || 0) * 0.18, 0) * 10) / 10;
  };

  // assignments: array of { taskId, processorId, cpuRequirement }
  const assignments = [];

  if (mode === "greedy") {
    // assign to first processor that has enough available capacity
    for (const task of tasksCopy) {
      const proc = procs.find(p => (p.available ?? 0) >= (task.cpuRequirement ?? 0));
      if (proc) {
        proc.available -= task.cpuRequirement ?? 0;
        assignments.push({ taskId: task.id, processorId: proc.id, cpuRequirement: task.cpuRequirement ?? 0 });
      }
    }
  } else if (mode === "bestfit") {
    // Best-fit decreasing: sort tasks by cpu desc then pick processor leaving smallest leftover >= 0
    const tasksSorted = tasksCopy.slice().sort((a, b) => (b.cpuRequirement ?? 0) - (a.cpuRequirement ?? 0));
    for (const task of tasksSorted) {
      let best = null;
      let bestLeft = Infinity;
      for (const p of procs) {
        const left = (p.available ?? 0) - (task.cpuRequirement ?? 0);
        if (left >= 0 && left < bestLeft) {
          bestLeft = left;
          best = p;
        }
      }
      if (best) {
        best.available -= task.cpuRequirement ?? 0;
        assignments.push({ taskId: task.id, processorId: best.id, cpuRequirement: task.cpuRequirement ?? 0 });
      }
    }
  }

  const energy = computeEnergy(assignments);
  const throughput = Math.round(assignments.length * 10); // arbitrary scale
  const utilizations = (processorsInput.length > 0)
    ? processorsInput.map(p => {
        const assigned = assignments.filter(a => a.processorId === p.id).reduce((s, a) => s + a.cpuRequirement, 0);
        const used = (p.utilization ?? 0) + assigned;
        return Math.min(100, Math.round(used));
      })
    : [];

  const avgUtil = utilizations.length ? Math.round(utilizations.reduce((s, v) => s + v, 0) / utilizations.length) : 0;
  const stdDev = utilizations.length
    ? Math.round(Math.sqrt(utilizations.reduce((s, v) => s + Math.pow(v - avgUtil, 2), 0) / utilizations.length))
    : 0;
  const efficiency = Math.max(0, Math.min(100, 100 - stdDev));

  return { energy, throughput, efficiency, assignments, utilizations };
};

// Endpoint to compare greedy vs optimization heuristics (best-fit)
app.get('/algorithms/compare', (req, res) => {
  try {
    const greedy = simulateAllocation(tasks, processors, 'greedy');
    const opt = simulateAllocation(tasks, processors, 'bestfit');
    res.json({ data: [ { algorithm: 'Greedy', ...greedy }, { algorithm: 'Optimization', ...opt } ] });
  } catch (err) {
    console.error('Failed to run algorithm comparison', err);
    res.status(500).json({ error: 'comparison_failed' });
  }
});

const emitUpdate = (event, payload) => {
  io.emit(event, payload);
};

const emitNotification = ({ title, message, level }) => {
  const notification = {
    id: randomUUID(),
    title,
    message,
    level,
    timestamp: new Date().toISOString(),
  };
  io.emit("notification", notification);
  logEvent({ type: "notification", payload: notification });
  return notification;
};

// Simple simulation log buffer (keeps most recent 200 events)
const simulationLogs = [];
const pushLog = (entry) => {
  const item = { id: randomUUID(), timestamp: new Date().toISOString(), ...entry };
  simulationLogs.unshift(item);
  if (simulationLogs.length > 200) simulationLogs.pop();
  io.emit("simulation_log", item);
};

const logEvent = (entry) => pushLog(entry);

const assignTasks = () => {
  if (!isRunning) return;

  const availableProcessor = processors.find((p) => p.utilization < 100);
  const waitingTask = tasks.find((task) => task.status === "waiting");
  if (availableProcessor && waitingTask) {
    waitingTask.status = "running";
    waitingTask.assignedProcessor = availableProcessor.id;
    availableProcessor.utilization = Math.min(100, availableProcessor.utilization + waitingTask.cpuRequirement);
    emitUpdate("allocation_created", { taskId: waitingTask.id, processorId: availableProcessor.id });
    emitUpdate("task_updated", waitingTask);
    emitUpdate("processor_updated", availableProcessor);
    emitUpdate("analytics_updated", { data: getAnalytics() });
    emitNotification({
      title: "Task dispatched",
      message: `${waitingTask.taskName} is now running on ${availableProcessor.processorName || availableProcessor.id}.`,
      level: "success",
    });
  }
};

let assignIntervalMs = 2000;
let progressIntervalMs = 3000;
let assignTimer = null;
let progressTimer = null;

const startAssignTimer = () => {
  if (assignTimer) clearInterval(assignTimer);
  assignTimer = setInterval(() => {
    if (isRunning) assignTasks();
  }, assignIntervalMs);
};

const startProgressTimer = () => {
  if (progressTimer) clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if (isRunning) runProgressTick();
  }, progressIntervalMs);
};

const runProgressTick = () => {
  tasks.forEach((task) => {
    if (task.status === "running") {
      task.remainingTime = Math.max(0, task.remainingTime - 5);
      if (task.remainingTime === 0) {
        task.status = "completed";
        const processor = processors.find((p) => p.id === task.assignedProcessor);
        if (processor) {
          processor.utilization = Math.max(0, processor.utilization - task.cpuRequirement);
          emitUpdate("processor_updated", processor);
        }
        emitUpdate("task_updated", task);
        emitUpdate("analytics_updated", { data: getAnalytics() });
        emitNotification({
          title: "Task completed",
          message: `${task.taskName} has finished execution.`,
          level: "success",
        });
        logEvent({ type: "task_completed", task });
      }
    }
  });
};

startAssignTimer();
startProgressTimer();

app.get("/analytics/dashboard", (req, res) => {
  res.json({ data: getAnalytics() });
});

app.get("/analytics/performance", (req, res) => {
  res.json({ data: getPerformanceData() });
});

app.get("/tasks", (req, res) => {
  res.json({ data: tasks });
});

app.get("/processors", (req, res) => {
  res.json({ data: processors });
});

app.post("/tasks", (req, res) => {
  const { taskName, priority, executionTime, deadline, cpuRequirement, memoryRequirement } = req.body;
  const newTask = {
    id: randomUUID(),
    taskName: taskName || `Task_${Math.floor(Math.random() * 10000)}`,
    priority: priority || "Medium",
    executionTime: executionTime || 100,
    deadline: deadline || (executionTime || 100) * 2,
    cpuRequirement: cpuRequirement || 25,
    memoryRequirement: memoryRequirement || 100,
    status: "waiting",
    assignedProcessor: null,
    remainingTime: executionTime || 100,
  };
  tasks.unshift(newTask);
  emitUpdate("task_created", newTask);
  emitUpdate("analytics_updated", { data: getAnalytics() });
  emitNotification({
    title: "New task queued",
    message: `${newTask.taskName} has been added to the scheduler queue.`,
    level: "info",
  });
  res.json({ data: newTask });
});

// Manual allocation and cancellation endpoints
app.post("/tasks/allocate", (req, res) => {
  const { taskId, processorId } = req.body;
  const task = tasks.find((t) => t.id === taskId);
  const processor = processors.find((p) => p.id === processorId);
  if (!task || !processor) return res.status(404).json({ error: "Task or processor not found" });
  if (task.status !== "waiting") return res.status(400).json({ error: "Task not in waiting state" });

  task.status = "running";
  task.assignedProcessor = processorId;
  processor.utilization = Math.min(100, (processor.utilization || 0) + task.cpuRequirement);
  emitUpdate("allocation_created", { taskId: task.id, processorId: processor.id });
  emitUpdate("task_updated", task);
  emitUpdate("processor_updated", processor);
  emitUpdate("analytics_updated", { data: getAnalytics() });
  emitNotification({ title: "Task manually allocated", message: `${task.taskName} -> ${processor.processorName}`, level: "info" });
  logEvent({ type: "manual_allocation", taskId: task.id, processorId: processor.id });
  res.json({ data: { task, processor } });
});

app.post("/tasks/cancel", (req, res) => {
  const { taskId } = req.body;
  const idx = tasks.findIndex((t) => t.id === taskId);
  if (idx === -1) return res.status(404).json({ error: "Task not found" });
  const [removed] = tasks.splice(idx, 1);
  emitUpdate("task_deleted", { id: taskId });
  emitUpdate("analytics_updated", { data: getAnalytics() });
  emitNotification({ title: "Task cancelled", message: `${removed.taskName} removed from queue.`, level: "warning" });
  logEvent({ type: "task_cancelled", task: removed });
  res.json({ data: removed });
});

// Simulation control: step once or change speed
app.post("/simulation/step", (req, res) => {
  // Run one assign pass and one progress tick
  assignTasks();
  runProgressTick();
  emitUpdate("analytics_updated", { data: getAnalytics() });
  res.json({ data: { stepped: true } });
});

app.post("/simulation/speed", (req, res) => {
  const { speed } = req.body; // multiplier, e.g., 2 = twice as fast
  const factor = Number(speed) || 1;
  assignIntervalMs = Math.max(200, Math.round(2000 / factor));
  progressIntervalMs = Math.max(200, Math.round(3000 / factor));
  startAssignTimer();
  startProgressTimer();
  logEvent({ type: "simulation_speed", speed: factor });
  res.json({ data: { assignIntervalMs, progressIntervalMs } });
});

app.get("/simulation/logs", (req, res) => {
  res.json({ data: simulationLogs });
});

app.post("/simulation/logs/clear", (req, res) => {
  simulationLogs.length = 0;
  res.json({ data: { cleared: true } });
});

app.post("/simulation/start", (req, res) => {
  isRunning = true;
  emitUpdate("analytics_updated", { data: getAnalytics() });
  emitNotification({
    title: "Simulation started",
    message: "The scheduler is now processing tasks.",
    level: "info",
  });
  res.json({ data: { started: true } });
});

app.post("/simulation/pause", (req, res) => {
  isRunning = false;
  emitNotification({
    title: "Simulation paused",
    message: "Task processing has been paused.",
    level: "warning",
  });
  res.json({ data: { paused: true } });
});

app.post("/simulation/reset", (req, res) => {
  isRunning = false;
  tasks = [];
  processors = processors.map((processor) => ({ ...processor, utilization: 0 }));
  emitUpdate("analytics_updated", { data: getAnalytics() });
  emitNotification({
    title: "Simulation reset",
    message: "The task and processor state has been cleared.",
    level: "warning",
  });
  res.json({ data: { reset: true } });
});

app.post("/dvfs/update", (req, res) => {
  const { processorId, voltage, frequency } = req.body;
  const processor = processors.find((p) => p.id === processorId);
  if (!processor) return res.status(404).json({ error: "Processor not found" });
  processor.voltage = voltage ?? processor.voltage;
  processor.frequency = frequency ?? processor.frequency;
  processor.temperature = Math.max(30, Math.min(95, processor.temperature + (Math.random() - 0.5) * 2));
  emitUpdate("dvfs_updated", { processor, powerConsumption: processor.voltage * processor.voltage * processor.frequency * 5 });
  emitUpdate("processor_updated", processor);
  emitUpdate("analytics_updated", { data: getAnalytics() });
  emitNotification({
    title: "DVFS updated",
    message: `${processor.processorName || processor.id} adjusted to ${processor.voltage.toFixed(2)} V and ${processor.frequency.toFixed(1)} GHz.`,
    level: "info",
  });
  res.json({ data: processor });
});

app.post("/dvfs/optimize", (req, res) => {
  const { processorId } = req.body;
  const processor = processors.find((p) => p.id === processorId);
  if (!processor) return res.status(404).json({ error: "Processor not found" });

  const loadRatio = Math.min(1, Math.max(0, (processor.utilization ?? 0) / 100));
  const targetFrequency = loadRatio >= 0.8
    ? Math.min(5.0, processor.frequency + 0.4)
    : loadRatio <= 0.3
      ? Math.max(1.2, processor.frequency - 0.5)
      : 2.2 + loadRatio * 2.0;
  const targetVoltage = loadRatio >= 0.8
    ? Math.min(1.5, processor.voltage + 0.05)
    : loadRatio <= 0.3
      ? Math.max(0.85, processor.voltage - 0.05)
      : 1.0 + loadRatio * 0.12;

  processor.frequency = Number(targetFrequency.toFixed(2));
  processor.voltage = Number(targetVoltage.toFixed(2));
  processor.temperature = Math.max(30, Math.min(95, 30 + processor.frequency * 6 + loadRatio * 10));

  const powerConsumption = processor.voltage * processor.voltage * processor.frequency * 5;
  emitUpdate("dvfs_updated", { processor, powerConsumption });
  emitUpdate("processor_updated", processor);
  emitUpdate("analytics_updated", { data: getAnalytics() });
  emitNotification({
    title: "DVFS auto-optimized",
    message: `${processor.processorName || processor.id} tuned to ${processor.voltage.toFixed(2)} V and ${processor.frequency.toFixed(1)} GHz based on current load.`, 
    level: "success",
  });

  res.json({ data: { processor, recommended: { voltage: processor.voltage, frequency: processor.frequency, temperature: processor.temperature, powerConsumption } } });
});

app.post("/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  const newContact = {
    id: randomUUID(),
    name: name || "",
    email: email || "",
    subject: subject || "",
    message: message || "",
    receivedAt: new Date().toISOString(),
  };
  saveContact(newContact);
  // Emit an event so the frontend can react in real-time
  emitUpdate("contact_received", newContact);
  res.json({ data: newContact });
});

app.get("/contacts", (req, res) => {
  res.json({ data: getContacts() });
});

app.post("/processors", (req, res) => {
  const { processorName, totalCapacity, availableCapacity, frequency, voltage, temperature, utilization } = req.body;
  const newProcessor = {
    id: randomUUID(),
    processorName: processorName || `Node_${processors.length + 1}`,
    totalCapacity: totalCapacity ?? 100,
    availableCapacity: availableCapacity ?? 100,
    frequency: frequency ?? 3.5,
    voltage: voltage ?? 1.2,
    temperature: temperature ?? 40,
    utilization: utilization ?? 0,
  };
  processors.push(newProcessor);
  emitUpdate("processor_updated", newProcessor);
  emitUpdate("analytics_updated", { data: getAnalytics() });
  res.json({ data: newProcessor });
});

io.on("connection", (socket) => {
  socket.emit("analytics_updated", { data: getAnalytics() });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Mock backend listening on http://localhost:${PORT}`);
});
