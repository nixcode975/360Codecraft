import type { ProjectFile } from '../contexts/AppContext';

function getFileComplexity(files: ProjectFile[]): number {
  let complexity = 0;
  for (const file of files) {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const sizeMB = file.size / (1024 * 1024);
    if (['pdf', 'docx', 'doc', 'txt', 'md'].includes(ext)) {
      complexity += 2 + Math.min(sizeMB * 0.5, 2);
    } else if (['py', 'js', 'ts', 'cpp', 'c', 'java', 'ipynb'].includes(ext)) {
      complexity += 3 + Math.min(sizeMB, 3);
    } else if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)) {
      complexity += 1.5;
    } else if (['mp4', 'avi', 'mov', 'webm'].includes(ext)) {
      complexity += 4 + Math.min(sizeMB * 0.2, 3);
    } else if (['zip', 'tar', 'gz', 'rar'].includes(ext)) {
      complexity += 3 + Math.min(sizeMB * 0.3, 2);
    } else {
      complexity += 1.5;
    }
  }
  return complexity;
}

function getFieldMultiplier(field: string): number {
  const m: Record<string, number> = {
    'Artificial Intelligence': 1.3, 'Machine Learning': 1.3,
    'Computer Science': 1.1, 'Electrical Engineering': 1.2,
    'Physics': 1.2, 'Mathematics': 1.25, 'Psychology': 1.0,
    'Data Science': 1.15, 'Robotics': 1.3, 'Web Development': 1.0,
    'Cybersecurity': 1.2, 'Chemistry': 1.1, 'Biology': 1.0,
    'Mechanical Engineering': 1.15,
  };
  return m[field] || 1.0;
}

export function evaluateCS1(field: string, experienceYears: number, files: ProjectFile[]): number {
  if (files.length === 0) return 1;
  const rawComplexity = getFileComplexity(files);
  const adjustedComplexity = rawComplexity * getFieldMultiplier(field);
  const expectedComplexity = 3 + experienceYears * 2.5;
  const ratio = adjustedComplexity / Math.max(expectedComplexity, 1);

  let cs1: number;
  if (ratio >= 2.0) cs1 = 9 + Math.min((ratio - 2) * 0.5, 1);
  else if (ratio >= 1.5) cs1 = 7.5 + (ratio - 1.5) * 3;
  else if (ratio >= 1.0) cs1 = 5.5 + (ratio - 1.0) * 4;
  else if (ratio >= 0.7) cs1 = 3.5 + (ratio - 0.7) * 6.67;
  else if (ratio >= 0.4) cs1 = 2 + (ratio - 0.4) * 5;
  else cs1 = 1 + ratio * 2.5;

  cs1 += (Math.random() - 0.5) * 0.8;
  return Math.round(Math.max(1, Math.min(10, cs1)) * 10) / 10;
}
