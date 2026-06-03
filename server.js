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
  return notification;
};

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

setInterval(() => {
  if (isRunning) {
    assignTasks();
  }
}, 2000);

setInterval(() => {
  if (isRunning) {
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
        }
      }
    });
  }
}, 3000);

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
