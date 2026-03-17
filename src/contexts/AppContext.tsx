import { createContext, useContext, useState, type ReactNode } from 'react';

export interface ProjectFile {
  name: string;
  size: number;
  type: string;
}

export interface Project {
  id: string;
  field: string;
  experienceYears: number;
  files: ProjectFile[];
  cs1: number;
  cs2: number;
  average: number;
  badge: 'bronze' | 'silver' | 'gold' | 'platinum';
  status: 'completed' | 'failed';
  createdAt: string;
}

interface User {
  email: string;
}

interface AppState {
  user: User | null;
  projects: Project[];
  // Current project flow state
  currentField: string;
  currentExperience: number;
  currentFiles: ProjectFile[];
  currentCS1: number;
}

interface AppContextType extends AppState {
  login: (email: string) => void;
  signup: (email: string) => void;
  logout: () => void;
  setCurrentField: (field: string) => void;
  setCurrentExperience: (years: number) => void;
  setCurrentFiles: (files: ProjectFile[]) => void;
  setCurrentCS1: (score: number) => void;
  addProject: (project: Project) => void;
  resetCurrentFlow: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentField, setCurrentField] = useState('');
  const [currentExperience, setCurrentExperience] = useState(0);
  const [currentFiles, setCurrentFiles] = useState<ProjectFile[]>([]);
  const [currentCS1, setCurrentCS1] = useState(0);

  const login = (email: string) => setUser({ email });
  const signup = (email: string) => setUser({ email });
  const resetCurrentFlow = () => {
    setCurrentField('');
    setCurrentExperience(0);
    setCurrentFiles([]);
    setCurrentCS1(0);
  };

  const logout = () => {
    setUser(null);
    setProjects([]);
    resetCurrentFlow();
  };

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        projects,
        currentField,
        currentExperience,
        currentFiles,
        currentCS1,
        login,
        signup,
        logout,
        setCurrentField,
        setCurrentExperience,
        setCurrentFiles,
        setCurrentCS1,
        addProject,
        resetCurrentFlow,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
