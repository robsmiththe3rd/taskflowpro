import { type User, type InsertUser, type Task, type InsertTask, type Project, type InsertProject, type Area, type InsertArea, type Goal, type InsertGoal } from "@shared/schema";
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
    const project: Project = { ...insertProject, id, createdAt: new Date() };
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
    return Array.from(this.areas.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createArea(insertArea: InsertArea): Promise<Area> {
    const id = randomUUID();
    const area: Area = { ...insertArea, id, createdAt: new Date() };
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

export const storage = new MemStorage();
