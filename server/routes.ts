import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertProjectSchema, insertGoalSchema, insertAreaSchema } from "@shared/schema";
import { processGTDCommand } from "./openai";

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

  // Get tasks for a specific project
  app.get("/api/projects/:id/tasks", async (req, res) => {
    try {
      const { id } = req.params;
      const tasks = await storage.getTasksByProject(id);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to get project tasks" });
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

  // IMPORTANT: Specific routes must come before parameterized routes
  app.patch("/api/areas/reorder", async (req, res) => {
    try {
      console.log('Received reorder request:', req.body);
      const { areaOrders } = req.body;
      if (!Array.isArray(areaOrders)) {
        console.error('areaOrders is not an array:', areaOrders);
        return res.status(400).json({ error: "areaOrders must be an array" });
      }
      
      // Validate each area order object
      for (const item of areaOrders) {
        if (!item.id || typeof item.order !== 'number') {
          console.error('Invalid area order item:', item);
          return res.status(400).json({ error: "Each area order must have id and order (number)" });
        }
      }
      
      console.log('Calling storage.reorderAreas with:', areaOrders);
      await storage.reorderAreas(areaOrders);
      console.log('Successfully reordered areas');
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error in reorder areas route:', error);
      res.status(500).json({ error: "Failed to reorder areas", details: error.message });
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

      // Use OpenAI to process the GTD command
      const { response: aiResponse, actions } = await processGTDCommand(message);
      const actionResults = [];

      // Execute all actions
      let createdProjectId: string | null = null;
      
      for (const action of actions) {
        if (action.type === 'task' && action.data) {
          try {
            // Validate that task has non-empty text
            const taskText = action.data.text?.trim();
            if (!taskText) {
              console.warn('Skipping task creation: empty text field');
              continue;
            }
            
            const task = await storage.createTask({
              text: taskText,
              category: action.data.category || 'quick_work',
              completed: false,
              projectId: action.data.projectId || createdProjectId || null
            });
            actionResults.push({ type: 'task_created', data: task });
          } catch (error) {
            console.error('Task creation error:', error);
          }
        } else if (action.type === 'project' && action.data) {
          try {
            // Validate that project has non-empty title
            const projectTitle = action.data.title?.trim();
            if (!projectTitle) {
              console.warn('Skipping project creation: empty title field');
              continue;
            }
            
            const project = await storage.createProject({
              title: projectTitle,
              status: action.data.status || 'active',
              notes: action.data.notes || 'Created via AI assistant',
              areaId: action.data.areaId || null
            });
            createdProjectId = project.id; // Track the project ID for subsequent tasks
            actionResults.push({ type: 'project_created', data: project });
          } catch (error) {
            console.error('Project creation error:', error);
          }
        } else if (action.type === 'goal' && action.data) {
          try {
            // Validate that goal has non-empty text
            const goalText = action.data.text?.trim();
            if (!goalText) {
              console.warn('Skipping goal creation: empty text field');
              continue;
            }
            
            const goal = await storage.createGoal({
              text: goalText,
              timeframe: action.data.timeframe || '1_2_year'
            });
            actionResults.push({ type: 'goal_created', data: goal });
          } catch (error) {
            console.error('Goal creation error:', error);
          }
        }
      }

      res.json({
        message: aiResponse,
        actions: actionResults
      });
    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({ error: "Failed to process AI request" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
