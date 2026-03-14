import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import type { ProjectFile } from '../contexts/AppContext';
import { evaluateCS1 } from '../utils/evaluateCS1';

export default function ProjectUpload() {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentField, currentExperience, setCurrentFiles, setCurrentCS1 } = useApp();
  const navigate = useNavigate();

  if (!currentField) {
    navigate('/project/new');
    return null;
  }

  const addFiles = (fileList: FileList) => {
    const newFiles: ProjectFile[] = Array.from(fileList).map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    if (['pdf', 'docx', 'doc', 'txt', 'md'].includes(ext)) return '📄';
    if (['py', 'js', 'ts', 'cpp', 'c', 'java'].includes(ext)) return '💻';
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)) return '🖼️';
    if (['mp4', 'avi', 'mov', 'webm'].includes(ext)) return '🎬';
    if (['zip', 'tar', 'gz', 'rar'].includes(ext)) return '📦';
    return '📎';
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      setError('Please upload at least one file');
      return;
    }
    setCurrentFiles(files);
    const cs1 = evaluateCS1(currentField, currentExperience, files);
    setCurrentCS1(cs1);
    navigate('/project/analysis');
  };

  return (
    <div className="upload-container">
      <div className="step-indicator">
        <div className="step completed"><div className="step-dot">✓</div></div>
        <div className="step-connector completed"></div>
        <div className="step active"><div className="step-dot">2</div></div>
        <div className="step-connector"></div>
        <div className="step"><div className="step-dot">3</div></div>
        <div className="step-connector"></div>
        <div className="step"><div className="step-dot">4</div></div>
        <div className="step-connector"></div>
        <div className="step"><div className="step-dot">5</div></div>
      </div>

      <div className="glass-card-static" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          📤 Upload Project Files
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          Upload photos, videos, documentation, or code files for your project
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <span className="field-tag" style={{ color: 'var(--accent-cyan)' }}>📁 {currentField}</span>
          <span className="field-tag" style={{ color: 'var(--accent-amber)' }}>
            ⏱️ {currentExperience < 1 ? `${Math.round(currentExperience * 12)} months` : `${currentExperience} years`} exp
          </span>
        </div>

        <div
          className={`upload-zone ${dragOver ? 'dragover' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-icon">☁️</div>
          <h3>Drop files here or click to browse</h3>
          <p>Supports images, videos, documents, code files, archives</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={e => { if (e.target.files) addFiles(e.target.files); }}
            style={{ display: 'none' }}
          />
        </div>

        {files.length > 0 && (
          <div className="file-list">
            {files.map((file, i) => (
              <div key={i} className="file-item">
                <div className="file-info">
                  <span className="file-icon">{getFileIcon(file.name)}</span>
                  <div>
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{formatSize(file.size)}</div>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeFile(i)}>✕</button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', marginTop: '1rem' }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <button
            className="btn btn-primary btn-lg"
            style={{ flex: 1 }}
            onClick={handleSubmit}
          >
            Analyze Project →
          </button>
        </div>
      </div>
    </div>
  );
}
