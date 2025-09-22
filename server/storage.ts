import { type User, type InsertUser, type Task, type InsertTask, type Project, type InsertProject, type Area, type InsertArea, type Goal, type InsertGoal, gtdTasks, gtdProjects, gtdAreas, gtdGoals, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { randomUUID } from "crypto";

// GTD Storage Interface
export interface IStorage {
  // Tasks
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  
  // Projects
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  
  // Areas
  getAreas(): Promise<Area[]>;
  createArea(area: InsertArea): Promise<Area>;
  updateArea(id: string, updates: Partial<Area>): Promise<Area>;
  deleteArea(id: string): Promise<void>;
  reorderAreas(areaOrders: { id: string; order: number }[]): Promise<void>;
  
  // Goals
  getGoals(): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, updates: Partial<Goal>): Promise<Goal>;
  deleteGoal(id: string): Promise<void>;
  
  // Legacy user methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tasks: Map<string, Task>;
  private projects: Map<string, Project>;
  private areas: Map<string, Area>;
  private goals: Map<string, Goal>;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.projects = new Map();
    this.areas = new Map();
    this.goals = new Map();
    
    // Initialize with sample data from the original HTML
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample tasks from the original design
    const sampleTasks: Task[] = [
      {
        id: randomUUID(),
        text: "Look at Bryan's stuff, learn the repositories, finish spreadsheet",
        category: "high_focus",
        completed: false,
        completedAt: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        text: "Get to help tickets",
        category: "high_focus",
        completed: false,
        completedAt: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        text: "Review Gabby's SOP edits",
        category: "high_focus",
        completed: false,
        completedAt: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        text: "Talk with Gabby about the SOPs - Completed Tues 9/16 1:30pm",
        category: "quick_work",
        completed: true,
        completedAt: new Date('2024-09-16T13:30:00'),
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        text: "Sign up for Visible phone plans for you and wife",
        category: "quick_personal",
        completed: false,
        completedAt: null,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        text: "Research GTD communities to join",
        category: "quick_personal",
        completed: false,
        completedAt: null,
        createdAt: new Date(),
      },
    ];
    
    sampleTasks.forEach(task => this.tasks.set(task.id, task));
    
    // Sample goals
    const sampleGoals: Goal[] = [
      {
        id: randomUUID(),
        text: "Bobby established in Virginia and leading a happy, not all internal, life",
        timeframe: "1_2_year",
        createdAt: new Date(),
      }
    ];
    
    sampleGoals.forEach(goal => this.goals.set(goal.id, goal));
    
    // Sample areas
    const sampleAreas: Area[] = [
      {
        id: randomUUID(),
        title: "Career & Leadership",
        description: "Building expertise and influence in transforming work culture",
        order: 1,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Personal Development", 
        description: "Continuous learning and growth in productivity and leadership",
        order: 2,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Health & Fitness",
        description: "Physical and mental wellbeing initiatives",
        order: 3,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        title: "Family & Relationships",
        description: "Nurturing connections and building meaningful relationships",
        order: 4,
        createdAt: new Date(),
      }
    ];
    
    sampleAreas.forEach(area => this.areas.set(area.id, area));
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = { 
      ...insertTask, 
      id, 
      createdAt: new Date(),
      completed: insertTask.completed ?? false,
      completedAt: insertTask.completed ? new Date() : null,
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const existing = this.tasks.get(id);
    if (!existing) throw new Error('Task not found');
    
    const updated: Task = { 
      ...existing, 
      ...updates, 
      completedAt: updates.completed === true ? new Date() : (updates.completed === false ? null : existing.completedAt)
    };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: string): Promise<void> {
    this.tasks.delete(id);
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: new Date(), 
      notes: insertProject.notes ?? null,
      areaId: insertProject.areaId ?? null
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) throw new Error('Project not found');
    const updated: Project = { ...existing, ...updates };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    this.projects.delete(id);
  }

  // Area methods
  async getAreas(): Promise<Area[]> {
    return Array.from(this.areas.values()).sort((a, b) => a.order - b.order);
  }

  async createArea(insertArea: InsertArea): Promise<Area> {
    const id = randomUUID();
    // Get the highest order value and increment by 1
    const maxOrder = Math.max(0, ...Array.from(this.areas.values()).map(a => a.order));
    const area: Area = { 
      ...insertArea, 
      id, 
      order: insertArea.order ?? maxOrder + 1,
      createdAt: new Date(), 
      description: insertArea.description ?? null 
    };
    this.areas.set(id, area);
    return area;
  }

  async updateArea(id: string, updates: Partial<Area>): Promise<Area> {
    const existing = this.areas.get(id);
    if (!existing) throw new Error('Area not found');
    const updated: Area = { ...existing, ...updates };
    this.areas.set(id, updated);
    return updated;
  }

  async deleteArea(id: string): Promise<void> {
    this.areas.delete(id);
  }

  async reorderAreas(areaOrders: { id: string; order: number }[]): Promise<void> {
    // Update the order for each area in memory
    for (const { id, order } of areaOrders) {
      const area = this.areas.get(id);
      if (area) {
        this.areas.set(id, { ...area, order });
      }
    }
  }

  // Goal methods
  async getGoals(): Promise<Goal[]> {
    return Array.from(this.goals.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const goal: Goal = { ...insertGoal, id, createdAt: new Date() };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
    const existing = this.goals.get(id);
    if (!existing) throw new Error('Goal not found');
    const updated: Goal = { ...existing, ...updates };
    this.goals.set(id, updated);
    return updated;
  }

  async deleteGoal(id: string): Promise<void> {
    this.goals.delete(id);
  }

  // Legacy user methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  // Task methods
  async getTasks(): Promise<Task[]> {
    return await db.select().from(gtdTasks).orderBy(gtdTasks.createdAt);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(gtdTasks).values(insertTask).returning();
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const [task] = await db
      .update(gtdTasks)
      .set({
        ...updates,
        completedAt: updates.completed === true ? new Date() : (updates.completed === false ? null : undefined)
      })
      .where(eq(gtdTasks.id, id))
      .returning();
    if (!task) throw new Error('Task not found');
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(gtdTasks).where(eq(gtdTasks.id, id));
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return await db.select().from(gtdProjects).orderBy(gtdProjects.createdAt);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(gtdProjects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const [project] = await db
      .update(gtdProjects)
      .set(updates)
      .where(eq(gtdProjects.id, id))
      .returning();
    if (!project) throw new Error('Project not found');
    return project;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(gtdProjects).where(eq(gtdProjects.id, id));
  }

  // Area methods
  async getAreas(): Promise<Area[]> {
    return await db.select().from(gtdAreas).orderBy(gtdAreas.order);
  }

  async createArea(insertArea: InsertArea): Promise<Area> {
    // If no order is specified, get the highest order and increment
    let areaData = insertArea;
    if (insertArea.order === undefined || insertArea.order === null) {
      const areas = await db.select().from(gtdAreas).orderBy(gtdAreas.order);
      const maxOrder = areas.length > 0 ? Math.max(...areas.map(a => a.order)) : 0;
      areaData = { ...insertArea, order: maxOrder + 1 };
    }
    
    const [area] = await db.insert(gtdAreas).values(areaData).returning();
    return area;
  }

  async updateArea(id: string, updates: Partial<Area>): Promise<Area> {
    const [area] = await db
      .update(gtdAreas)
      .set(updates)
      .where(eq(gtdAreas.id, id))
      .returning();
    if (!area) throw new Error('Area not found');
    return area;
  }

  async deleteArea(id: string): Promise<void> {
    await db.delete(gtdAreas).where(eq(gtdAreas.id, id));
  }

  async reorderAreas(areaOrders: { id: string; order: number }[]): Promise<void> {
    // Update all areas with their new order values in a transaction
    for (const { id, order } of areaOrders) {
      await db.update(gtdAreas)
        .set({ order })
        .where(eq(gtdAreas.id, id));
    }
  }

  // Goal methods
  async getGoals(): Promise<Goal[]> {
    return await db.select().from(gtdGoals).orderBy(gtdGoals.createdAt);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const [goal] = await db.insert(gtdGoals).values(insertGoal).returning();
    return goal;
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
    const [goal] = await db
      .update(gtdGoals)
      .set(updates)
      .where(eq(gtdGoals.id, id))
      .returning();
    if (!goal) throw new Error('Goal not found');
    return goal;
  }

  async deleteGoal(id: string): Promise<void> {
    await db.delete(gtdGoals).where(eq(gtdGoals.id, id));
  }

  // Legacy user methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
