import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertProjectSchema, insertGoalSchema, insertAreaSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Task routes
  app.get("/api/tasks", async (_req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const result = insertTaskSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid task data", details: result.error });
      }
      const task = await storage.createTask(result.data);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const task = await storage.updateTask(id, req.body);
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTask(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // Project routes
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const result = insertProjectSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid project data", details: result.error });
      }
      const project = await storage.createProject(result.data);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.updateProject(id, req.body);
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProject(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Goal routes
  app.get("/api/goals", async (_req, res) => {
    try {
      const goals = await storage.getGoals();
      res.json(goals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch goals" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const result = insertGoalSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid goal data", details: result.error });
      }
      const goal = await storage.createGoal(result.data);
      res.status(201).json(goal);
    } catch (error) {
      res.status(500).json({ error: "Failed to create goal" });
    }
  });

  app.patch("/api/goals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const goal = await storage.updateGoal(id, req.body);
      res.json(goal);
    } catch (error) {
      res.status(500).json({ error: "Failed to update goal" });
    }
  });

  app.delete("/api/goals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGoal(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete goal" });
    }
  });

  // Area routes
  app.get("/api/areas", async (_req, res) => {
    try {
      const areas = await storage.getAreas();
      res.json(areas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch areas" });
    }
  });

  app.post("/api/areas", async (req, res) => {
    try {
      const result = insertAreaSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid area data", details: result.error });
      }
      const area = await storage.createArea(result.data);
      res.status(201).json(area);
    } catch (error) {
      res.status(500).json({ error: "Failed to create area" });
    }
  });

  app.patch("/api/areas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const area = await storage.updateArea(id, req.body);
      res.json(area);
    } catch (error) {
      res.status(500).json({ error: "Failed to update area" });
    }
  });

  app.delete("/api/areas/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteArea(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete area" });
    }
  });

  // AI Chat endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Simple pattern matching for GTD commands
      let aiResponse = "I understand your request. ";
      let action = null;

      // Task creation patterns
      if (message.toLowerCase().includes('add task') || message.toLowerCase().includes('create task')) {
        const taskMatch = message.match(/add task:?\s*(.*?)\.?$/i) || message.match(/create task:?\s*(.*?)\.?$/i);
        if (taskMatch) {
          const taskText = taskMatch[1].trim();
          // Determine category based on keywords
          let category = 'quick_work'; // default
          if (message.toLowerCase().includes('personal')) category = 'quick_personal';
          else if (message.toLowerCase().includes('home')) category = 'home';
          else if (message.toLowerCase().includes('important') || message.toLowerCase().includes('focus')) category = 'high_focus';
          
          try {
            const task = await storage.createTask({
              text: taskText,
              category,
              completed: false
            });
            action = { type: 'task_created', data: task };
            aiResponse += `I've created a new task: "${taskText}" in your ${category.replace('_', ' ')} category.`;
          } catch (error) {
            aiResponse += "I had trouble creating that task. Please try again.";
          }
        }
      }
      // Project creation patterns
      else if (message.toLowerCase().includes('add project') || message.toLowerCase().includes('create project')) {
        const projectMatch = message.match(/(?:add|create) project:?\s*(.*?)\.?$/i);
        if (projectMatch) {
          const projectTitle = projectMatch[1].trim();
          try {
            const project = await storage.createProject({
              title: projectTitle,
              status: 'active',
              notes: `Created via AI assistant`
            });
            action = { type: 'project_created', data: project };
            aiResponse += `I've created a new project: "${projectTitle}" for you.`;
          } catch (error) {
            aiResponse += "I had trouble creating that project. Please try again.";
          }
        }
      }
      // Goal creation patterns
      else if (message.toLowerCase().includes('add goal') || message.toLowerCase().includes('create goal')) {
        const goalMatch = message.match(/(?:add|create) goal:?\s*(.*?)\.?$/i);
        if (goalMatch) {
          const goalText = goalMatch[1].trim();
          let timeframe = '1_2_year'; // default
          if (message.toLowerCase().includes('vision') || message.toLowerCase().includes('long term')) timeframe = 'vision';
          else if (message.toLowerCase().includes('3') || message.toLowerCase().includes('5')) timeframe = '3_5_year';
          
          try {
            const goal = await storage.createGoal({
              text: goalText,
              timeframe
            });
            action = { type: 'goal_created', data: goal };
            aiResponse += `I've created a new ${timeframe.replace('_', '-')} goal: "${goalText}".`;
          } catch (error) {
            aiResponse += "I had trouble creating that goal. Please try again.";
          }
        }
      }
      else {
        aiResponse += "I can help you add tasks, projects, and goals. Try saying something like 'add task: research camping options' or 'create project for home improvement'.";
      }

      res.json({
        message: aiResponse,
        action: action
      });
    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({ error: "Failed to process AI request" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
