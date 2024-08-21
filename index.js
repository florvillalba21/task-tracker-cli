import fs from "fs";

// Archivo JSON para almacenar tareas
const tasksFile = "tasks.json";

// Cargar tareas desde el archivo JSON
const loadTasks = () => {
  try {
    const dataBuffer = fs.readFileSync(tasksFile);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

// Guardar tareas en el archivo JSON
const saveTasks = (tasks) => {
  const dataJSON = JSON.stringify(tasks, null, 2);
  fs.writeFileSync(tasksFile, dataJSON);
};

// Generar un ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// funcion para agregar una nueva tarea
const addTask = (description) => {
  const tasks = loadTasks();
  const newTask = {
    id: generateId(),
    description,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  console.log("Task added:", newTask);
};

// funcion para listar todas las tareas
const listTasks = () => {
  const tasks = loadTasks();
  tasks.forEach((task) => {
    console.log(`${task.id} - ${task.description} [${task.status}]`);
  });
};

// funcion para actualizar una tarea
const updateTask = (id, newDescription, newStatus) => {
  const tasks = loadTasks();
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.description = newDescription || task.description;
    task.status = newStatus || task.status;
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log("Task updated:", task);
  } else {
    console.log("Task not found");
  }
};

// Procesar comandos de la CLI
const command = process.argv[2];
const args = process.argv.slice(3);

if (command === "add") {
  const description = args.join(" ");
  if (!description) {
    console.log("Please provide a description.");
  } else {
    addTask(description);
  }
} else if (command === "list") {
  listTasks();
} else if (command === "update") {
  const [id, ...rest] = args;
  const description = rest.join(" ");
  const status = args.includes("--status=")
    ? args.find((arg) => arg.includes("--status=")).split("=")[1]
    : null;
  if (!id) {
    console.log("Please provide an ID.");
  } else {
    updateTask(id, description, status);
  }
} else {
  console.log("Unknown command");
}
