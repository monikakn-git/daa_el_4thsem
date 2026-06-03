const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { randomUUID } = require('crypto');
const { saveContact, getContacts } = require('./src/lib/db');

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
  }
};

const advanceSimulation = () => {
  if (!isRunning) return;

  let stateChanged = false;
  tasks.forEach((task) => {
    if (task.status === "running") {
      task.remainingTime = Math.max(0, task.remainingTime - 10);
      if (task.remainingTime === 0) {
        task.status = "completed";
        task.assignedProcessor = null;
        stateChanged = true;
      }
    }
  });

  if (stateChanged) {
    tasks.forEach((task) => {
      if (task.status === "completed" && task.assignedProcessor) {
        const processor = processors.find((p) => p.id === task.assignedProcessor);
        if (processor) {
          processor.utilization = Math.max(0, processor.utilization - task.cpuRequirement);
          emitUpdate("processor_updated", processor);
        }
      }
    });
    emitUpdate("analytics_updated", { data: getAnalytics() });
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
  res.json({ data: newTask });
});

app.post("/simulation/start", (req, res) => {
  isRunning = true;
  emitUpdate("analytics_updated", { data: getAnalytics() });
  res.json({ data: { started: true } });
});

app.post("/simulation/pause", (req, res) => {
  isRunning = false;
  res.json({ data: { paused: true } });
});

app.post("/simulation/reset", (req, res) => {
  isRunning = false;
  tasks = [];
  processors = processors.map((processor) => ({ ...processor, utilization: 0 }));
  emitUpdate("analytics_updated", { data: getAnalytics() });
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
  res.json({ data: processor });
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
