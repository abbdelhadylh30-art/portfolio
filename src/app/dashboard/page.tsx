'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Image as ImageIcon,
  Upload,
  X,
  User,
  FolderOpen,
  Briefcase,
  Star,
  BarChart3,
  GraduationCap,
  ExternalLink,
  LogOut,
  Menu,
  ChevronLeft,
  Plus,
  Save,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Link2,
  Eye,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ProfileData {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
  bio: string;
  heroSubtitle: string;
  quote: string;
  stat1Value: string;
  stat1Label: string;
  stat1Sub: string;
  stat2Value: string;
  stat2Label: string;
  stat2Sub: string;
  stat3Value: string;
  stat3Label: string;
  stat3Sub: string;
  stat4Value: string;
  stat4Label: string;
  stat4Sub: string;
}

/* ------------------------------------------------------------------ */
/*  Colors — Navy & Gold                                               */
/* ------------------------------------------------------------------ */

const c = {
  navy: '#0a1628',
  navyLight: '#0f2038',
  navyMid: '#162d50',
  gold: '#c8963e',
  goldLight: '#e8b85a',
  white: '#ffffff',
  gray400: '#8b95a8',
  gray600: '#5a6478',
  surface: '#111d33',
  inputBg: '#0d1a2e',
  border: 'rgba(200,150,62,0.15)',
  borderHover: 'rgba(200,150,62,0.35)',
};

/* ------------------------------------------------------------------ */
/*  Toast notification system (replaces native alert)                  */
/* ------------------------------------------------------------------ */

type ToastKind = 'success' | 'error' | 'info' | 'warning';
interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
  duration: number;
}

let toastIdCounter = 0;
const toastListeners = new Set<(toasts: Toast[]) => void>();
let currentToasts: Toast[] = [];

function notify(kind: ToastKind, message: string, duration = 4000) {
  const toast: Toast = { id: ++toastIdCounter, kind, message, duration };
  currentToasts = [...currentToasts, toast];
  toastListeners.forEach(l => l(currentToasts));
  // Auto-dismiss
  setTimeout(() => dismissToast(toast.id), duration);
}

function dismissToast(id: number) {
  currentToasts = currentToasts.filter(t => t.id !== id);
  toastListeners.forEach(l => l(currentToasts));
}

function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    const listener = (t: Toast[]) => setToasts([...t]);
    toastListeners.add(listener);
    return () => { toastListeners.delete(listener); };
  }, []);

  const iconFor = (kind: ToastKind) => {
    switch (kind) {
      case 'success': return <CheckCircle2 size={18} color="#22c55e" />;
      case 'error':   return <AlertCircle size={18} color="#ef4444" />;
      case 'warning': return <AlertTriangle size={18} color="#f59e0b" />;
      case 'info':    return <Info size={18} color={c.gold} />;
    }
  };

  const borderColorFor = (kind: ToastKind) => {
    switch (kind) {
      case 'success': return 'rgba(34,197,94,0.35)';
      case 'error':   return 'rgba(239,68,68,0.35)';
      case 'warning': return 'rgba(245,158,11,0.35)';
      case 'info':    return c.borderHover;
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, zIndex: 200,
      display: 'flex', flexDirection: 'column', gap: 8,
      pointerEvents: 'none', maxWidth: 'calc(100vw - 32px)',
    }}>
      {toasts.map(t => (
        <div
          key={t.id}
          style={{
            background: c.navyLight,
            border: `1px solid ${borderColorFor(t.kind)}`,
            borderRadius: 10, padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
            color: c.white, fontSize: '0.85rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            pointerEvents: 'auto',
            minWidth: 280, maxWidth: 420,
            animation: 'toast-in 0.2s ease-out',
          }}
        >
          {iconFor(t.kind)}
          <span style={{ flex: 1, lineHeight: 1.4 }}>{t.message}</span>
          <button
            onClick={() => dismissToast(t.id)}
            style={{ background: 'none', border: 'none', color: c.gray400, cursor: 'pointer', padding: 0 }}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Auth                                                               */
/* ------------------------------------------------------------------ */

let authToken = '';

async function api(endpoint: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = isFormData
    ? { ...(options.headers as Record<string, string>) }
    : { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(endpoint, { ...options, headers });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

/* ------------------------------------------------------------------ */
/*  Image Upload Component                                             */
/* ------------------------------------------------------------------ */

function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [preview, setPreview] = useState(value || '');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Pre-validate size on client side to avoid wasted uploads
    if (file.size > 2 * 1024 * 1024) {
      setUploadError(`File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max 2MB.`);
      return;
    }
    setUploadError(null);

    // Show local preview immediately for responsiveness
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await api('/api/upload', {
        method: 'POST',
        body: formData,
      });
      onChange(result.imageUrl);
      setPreview(result.imageUrl);
      setUploadError(null);
    } catch (err: any) {
      setUploadError('Upload failed: ' + (err?.message || 'unknown error'));
      // Fall back to keeping the local preview only if user wants to proceed with URL
    }
    setUploading(false);
  };

  return (
    <div>
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          width: '100%', height: 160, borderRadius: 12,
          border: `2px dashed ${c.border}`, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: c.inputBg, overflow: 'hidden', position: 'relative',
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = c.borderHover)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = c.border)}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(10,22,40,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0'}
            >
              <span style={{ color: c.white, fontSize: '0.85rem', fontWeight: 500 }}>
                {uploading ? 'Uploading...' : 'Click to change'}
              </span>
            </div>
          </>
        ) : (
          <>
            <Upload size={24} style={{ color: c.gold, marginBottom: 8 }} />
            <span style={{ fontSize: '0.85rem', color: c.gray400 }}>
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </span>
            <span style={{ fontSize: '0.72rem', color: c.gray600, marginTop: 4 }}>
              JPEG, PNG, GIF, WebP, SVG — Max 2MB
            </span>
          </>
        )}
      </div>
      {uploadError && (
        <div style={{
          marginTop: 8, padding: '8px 12px', borderRadius: 6,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          color: '#ef4444', fontSize: '0.78rem',
        }}>
          {uploadError}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        onChange={handleUpload}
        style={{ display: 'none' }}
      />
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <input
          value={value || ''}
          onChange={e => { onChange(e.target.value); setPreview(e.target.value); }}
          placeholder="Or paste an image URL (e.g. /logos/foo.png)"
          style={{
            flex: 1, padding: '8px 12px', borderRadius: 8,
            background: c.inputBg, border: `1px solid ${c.border}`,
            color: c.white, fontSize: '0.82rem', outline: 'none',
          }}
        />
        {(value || preview) && (
          <button
            type="button"
            onClick={() => { onChange(''); setPreview(''); setUploadError(null); }}
            style={{
              padding: '0 12px', background: 'transparent',
              border: `1px solid rgba(239,68,68,0.4)`, borderRadius: 8,
              color: '#ef4444', fontSize: '0.78rem', cursor: 'pointer',
              whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4,
            }}
            title="Remove image"
          >
            <X size={12} /> Remove
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard Page                                                     */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('profile');
  const [loginError, setLoginError] = useState('');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dashboard_token');
    if (saved) {
      authToken = saved;
      fetch('/api/profile', { headers: { Authorization: `Bearer ${saved}` } })
        .then(r => { if (r.ok) setIsLoggedIn(true); else { authToken = ''; localStorage.removeItem('dashboard_token'); } })
        .catch(() => { authToken = ''; localStorage.removeItem('dashboard_token'); });
    }
  }, []);

  const handleLogin = async () => {
    try {
      const data = await api('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      authToken = data.token;
      localStorage.setItem('dashboard_token', authToken);
      setIsLoggedIn(true);
      setLoginError('');
    } catch {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    authToken = '';
    localStorage.removeItem('dashboard_token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: c.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{
          background: c.navyLight, border: `1px solid ${c.border}`,
          borderRadius: 20, padding: '2.5rem', width: '100%', maxWidth: 420,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'rgba(200,150,62,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: c.gold,
            }}>
              <User size={24} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: c.white, marginBottom: 2 }}>
                Dashboard <span style={{ color: c.gold }}>Panel</span>
              </h1>
              <p style={{ color: c.gray400, fontSize: '0.8rem' }}>Sign in to manage your portfolio</p>
            </div>
          </div>
          {loginError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{loginError}</p>}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: c.gray400, marginBottom: 6 }}>Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                background: c.inputBg, border: `1px solid ${c.border}`,
                color: c.white, fontSize: '0.9rem', outline: 'none',
              }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: c.gray400, marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                background: c.inputBg, border: `1px solid ${c.border}`,
                color: c.white, fontSize: '0.9rem', outline: 'none',
              }}
            />
          </div>
          <button onClick={handleLogin} style={{
            width: '100%', padding: '10px 0', background: c.gold, color: c.navy,
            borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Save size={16} /> Sign In
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'projects', label: 'Projects', icon: <FolderOpen size={18} /> },
    { id: 'experiences', label: 'Experience', icon: <Briefcase size={18} /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Star size={18} /> },
    { id: 'skills', label: 'Skills', icon: <BarChart3 size={18} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={18} /> },
  ];

  const handleNavClick = (id: string) => {
    setCurrentPage(id);
    setSidebarOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: c.navy, display: 'flex' }}>
      {/* Mobile top bar */}
      <div className="dashboard-mobile-topbar" style={{
        display: 'none',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 90,
        background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${c.border}`,
        padding: '0 1rem', height: 56,
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: c.white }}>
          MM<span style={{ color: c.gold }}>.</span> Dashboard
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', color: c.white,
            padding: 4,
          }}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar overlay for mobile (closes sidebar on tap outside) */}
      {sidebarOpen && (
        <div
          className="dashboard-sidebar-overlay"
          style={{
            display: 'none',  // overridden by media query below
            position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.7)', zIndex: 89,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — applies .open class so the mobile CSS transform works */}
      <div className={`dashboard-sidebar${sidebarOpen ? ' open' : ''}`} style={{
        width: 256, background: c.navyLight, borderRight: `1px solid ${c.border}`,
        padding: '1.5rem', display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, overflowY: 'auto',
        zIndex: 91,
        transition: 'transform 0.3s ease',
      }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.2rem', fontWeight: 800, color: c.white, marginBottom: 4, padding: '0 0.5rem' }}>
          MM<span style={{ color: c.gold }}>.</span> Dashboard
        </div>
        <div style={{ fontSize: '0.72rem', color: c.gray600, marginBottom: '2rem', padding: '0 0.5rem' }}>Portfolio Admin Panel</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
                fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 10,
                transition: 'all 0.2s', border: 'none', cursor: 'pointer',
                background: currentPage === item.id ? c.gold : 'transparent',
                color: currentPage === item.id ? c.navy : c.gray400,
                fontWeight: currentPage === item.id ? 600 : 400,
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: `1px solid ${c.border}`, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a href="/" target="_blank" style={{
            width: '100%', padding: '10px 12px', borderRadius: 8,
            fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 10,
            color: c.gray400, textDecoration: 'none', transition: 'all 0.2s',
          }}>
            <ExternalLink size={18} /> View Portfolio
          </a>
          <button onClick={handleLogout} style={{
            width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
            fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 10,
            color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer',
          }}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main" style={{ marginLeft: 256, flex: 1, padding: '2rem' }}>
        <div style={{
          background: c.navyLight, border: `1px solid ${c.border}`,
          borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.gold, animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '0.82rem', color: c.gray400 }}>Connected to Portfolio API — Changes appear instantly on the live site</span>
        </div>
        <ContentArea page={currentPage} />
      </div>

      {/* Toast notifications — always mounted so notify() works from anywhere */}
      <ToastContainer />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @media (max-width: 768px) {
          .dashboard-mobile-topbar {
            display: flex !important;
          }
          .dashboard-main {
            margin-left: 0 !important;
            padding: 5rem 1rem 2rem !important;
          }
          .dashboard-sidebar {
            transform: translateX(-100%);
          }
          .dashboard-sidebar.open {
            transform: translateX(0);
          }
          .dashboard-sidebar-overlay {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Content Area                                                       */
/* ------------------------------------------------------------------ */

function ContentArea({ page }: { page: string }) {
  switch (page) {
    case 'profile': return <ProfileEditor />;
    case 'projects': return <ItemList entity="projects" title="Projects" subtitle="Manage your portfolio projects" titleKey="title" subtitleKey="category" descKey="description" tagsKey="tags" hasImage />;
    case 'experiences': return <ItemList entity="experiences" title="Experience" subtitle="Manage your work experience" titleKey="role" subtitleKey="company" descKey="description" tagsKey="highlights" />;
    case 'campaigns': return <ItemList entity="campaigns" title="Campaigns" subtitle="Manage your campaign concepts" titleKey="title" subtitleKey="subtitle" descKey="description" tagsKey="tags" hasImage />;
    case 'skills': return <ItemList entity="skills" title="Skills" subtitle="Manage your skill categories" titleKey="name" tagsKey="skills" />;
    case 'education': return <ItemList entity="education" title="Education" subtitle="Manage your education entries" titleKey="degree" subtitleKey="institution" descKey="details" />;
    default: return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Profile Editor                                                     */
/* ------------------------------------------------------------------ */

function ProfileEditor() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api('/api/profile').then(setProfile);
  }, []);

  if (!profile) return <div style={{ textAlign: 'center', color: c.gray400, padding: '3rem' }}>Loading...</div>;

  const fields: { key: keyof ProfileData; label: string; type?: string }[] = [
    { key: 'name', label: 'Full Name' },
    { key: 'title', label: 'Title' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'heroSubtitle', label: 'Hero Subtitle' },
    { key: 'quote', label: 'Quote' },
    { key: 'bio', label: 'Bio', type: 'textarea' },
    { key: 'stat1Value', label: 'Stat 1 Value' },
    { key: 'stat1Label', label: 'Stat 1 Label' },
    { key: 'stat1Sub', label: 'Stat 1 Sub' },
    { key: 'stat2Value', label: 'Stat 2 Value' },
    { key: 'stat2Label', label: 'Stat 2 Label' },
    { key: 'stat2Sub', label: 'Stat 2 Sub' },
    { key: 'stat3Value', label: 'Stat 3 Value' },
    { key: 'stat3Label', label: 'Stat 3 Label' },
    { key: 'stat3Sub', label: 'Stat 3 Sub' },
    { key: 'stat4Value', label: 'Stat 4 Value' },
    { key: 'stat4Label', label: 'Stat 4 Label' },
    { key: 'stat4Sub', label: 'Stat 4 Sub' },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await api('/api/dashboard/profile', { method: 'PUT', body: JSON.stringify(profile) });
      notify('success', 'Profile updated — changes are live on your portfolio.');
    } catch (e: any) {
      notify('error', 'Could not save profile: ' + e.message);
    }
    setSaving(false);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.75rem', fontWeight: 700, color: c.white }}>Profile Settings</h2>
        <p style={{ color: c.gray400, fontSize: '0.85rem', marginTop: 4 }}>Update your personal information and hero section</p>
      </div>
      <div style={{ background: c.navyLight, border: `1px solid ${c.border}`, borderRadius: 16, padding: '1.5rem' }}>
        {fields.map(f => (
          <div key={f.key} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: c.gray400, marginBottom: 6 }}>{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                value={profile[f.key] || ''}
                onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  background: c.inputBg, border: `1px solid ${c.border}`,
                  color: c.white, fontSize: '0.85rem', outline: 'none',
                  minHeight: 80, resize: 'vertical',
                }}
              />
            ) : (
              <input
                value={profile[f.key] || ''}
                onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 8,
                  background: c.inputBg, border: `1px solid ${c.border}`,
                  color: c.white, fontSize: '0.85rem', outline: 'none',
                }}
              />
            )}
          </div>
        ))}
        <button onClick={handleSave} disabled={saving} style={{
          marginTop: '1rem', padding: '10px 24px', background: c.gold, color: c.navy,
          borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
          opacity: saving ? 0.5 : 1,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Item List                                                          */
/* ------------------------------------------------------------------ */

function ItemList({ entity, title, subtitle, titleKey, subtitleKey, descKey, tagsKey, hasImage }: {
  entity: string;
  title: string;
  subtitle: string;
  titleKey: string;
  subtitleKey?: string;
  descKey?: string;
  tagsKey?: string;
  hasImage?: boolean;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [initialFormData, setInitialFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await api(`/api/dashboard/${entity}`);
        if (!cancelled) setItems(data);
      } catch { /* ignore */ }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [entity]);

  const fetchItems = useCallback(() => {
    api(`/api/dashboard/${entity}`)
      .then(setItems)
      .catch(() => {});
  }, [entity]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    // For projects, require the user to type the project name to confirm
    if (entity === 'projects' && deleteConfirmText !== pendingDelete.name) {
      notify('error', `Type "${pendingDelete.name}" exactly to confirm deletion.`);
      return;
    }
    try {
      await api(`/api/dashboard/${entity}`, { method: 'DELETE', body: JSON.stringify({ id: pendingDelete.id }) });
      notify('success', `Deleted "${pendingDelete.name}".`);
      setPendingDelete(null);
      setDeleteConfirmText('');
      fetchItems();
    } catch (e: any) {
      notify('error', 'Could not delete: ' + e.message);
    }
  };

  const isFormDirty = () => {
    const keys = new Set([...Object.keys(formData), ...Object.keys(initialFormData)]);
    for (const k of keys) {
      if (String(formData[k] ?? '') !== String(initialFormData[k] ?? '')) return true;
    }
    return false;
  };

  const closeForm = () => {
    if (isFormDirty()) {
      if (!window.confirm('Discard your changes?')) return;
    }
    setShowForm(false);
    setEditItem(null);
    setFormData({});
    setInitialFormData({});
  };

  // Escape key to close modal
  useEffect(() => {
    if (!showForm && !pendingDelete) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (pendingDelete) {
          setPendingDelete(null);
          setDeleteConfirmText('');
        } else {
          closeForm();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm, pendingDelete, formData, initialFormData]);

  const handleSave = async () => {
    // Client-side validation for required fields
    if (entity === 'projects') {
      if (!formData.title || !String(formData.title).trim()) {
        notify('error', 'Title is required.');
        return;
      }
      if (!formData.description || !String(formData.description).trim()) {
        notify('warning', 'Short Description is recommended — it appears on project cards.');
      }
    }
    // Warn if user is changing the slug of an existing project (breaks URLs)
    if (editItem && entity === 'projects' && formData.slug && editItem.slug && formData.slug !== editItem.slug) {
      const ok = window.confirm(
        `Changing the slug from "${editItem.slug}" to "${formData.slug}" will break any existing links to /projects/${editItem.slug}. Continue?`
      );
      if (!ok) return;
    }
    setSaving(true);
    try {
      if (editItem) {
        await api(`/api/dashboard/${entity}`, { method: 'PUT', body: JSON.stringify({ ...formData, id: editItem.id }) });
        notify('success', `Updated "${formData.title || formData.name || formData.role || 'item'}".`);
        setHighlightId(editItem.id);
      } else {
        const created = await api(`/api/dashboard/${entity}`, { method: 'POST', body: JSON.stringify(formData) });
        notify('success', `Created "${created.title || created.name || created.role || 'new item'}".`);
        setHighlightId(created.id);
      }
      setShowForm(false);
      setEditItem(null);
      setFormData({});
      setInitialFormData({});
      fetchItems();
      // Clear highlight after a few seconds
      setTimeout(() => setHighlightId(null), 4000);
    } catch (e: any) {
      notify('error', 'Could not save: ' + e.message);
    }
    setSaving(false);
  };

  const openAdd = () => {
    setEditItem(null);
    // Sensible defaults for new items so required fields aren't blank
    const defaults: Record<string, any> = {
      featured: true,
      order: items.length > 0 ? Math.max(...items.map((i: any) => i.order || 0)) + 1 : 1,
    };
    setFormData(defaults);
    setInitialFormData(defaults);
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    // Coerce boolean fields from DB string/boolean to actual boolean for the checkbox
    const data = { ...item, featured: item.featured === true || item.featured === 'true' };
    setFormData(data);
    setInitialFormData(data);
    setShowForm(true);
  };

  const entityFields: Record<string, { key: string; label: string; type: string; options?: string[]; hint?: string; group?: string; required?: boolean; maxLength?: number; showCount?: boolean }[]> = {
    projects: [
      { key: 'title', label: 'Title', type: 'text', group: 'Basic', required: true, maxLength: 200, showCount: true },
      { key: 'slug', label: 'Slug (URL)', type: 'slug', group: 'Basic', hint: 'Auto-generated from title. Used in /projects/[slug] URL. Changing this on an existing project will break old links.', maxLength: 120 },
      { key: 'category', label: 'Category', type: 'select', options: ['Brand Audit', 'Campaign', 'Campaign Concept', 'Case Study', 'Digital', 'Research'], group: 'Basic' },
      { key: 'imageUrl', label: 'Project Image / Logo', type: 'image', group: 'Basic' },
      { key: 'description', label: 'Short Description (card summary)', type: 'textarea', group: 'Basic', required: true, maxLength: 400, showCount: true, hint: 'Shown on the project card. Keep it under 200 characters for best layout.' },
      { key: 'tags', label: 'Tags (comma-separated)', type: 'text', group: 'Basic', maxLength: 200 },
      { key: 'featured', label: 'Featured (show on home page)', type: 'boolean', group: 'Basic', hint: 'Featured projects are highlighted on the landing page.' },
      { key: 'order', label: 'Order', type: 'number', group: 'Basic', hint: 'Lower numbers appear first.' },

      { key: 'client', label: 'Client', type: 'text', group: 'Detail Page', maxLength: 120 },
      { key: 'timeline', label: 'Timeline', type: 'text', group: 'Detail Page', maxLength: 80 },
      { key: 'role', label: 'Role', type: 'text', group: 'Detail Page', maxLength: 80 },
      { key: 'overview', label: 'Overview — The Engagement', type: 'long-text', group: 'Detail Page', hint: '2–4 paragraphs. Use blank lines to separate paragraphs. Single line breaks are preserved.', maxLength: 4000, showCount: true },
      { key: 'challenge', label: 'Challenge — The Problem', type: 'long-text', group: 'Detail Page', hint: '2–4 paragraphs. Use blank lines to separate paragraphs.', maxLength: 4000, showCount: true },
      { key: 'approach', label: 'Approach — The Method', type: 'long-text', group: 'Detail Page', hint: '2–4 paragraphs. Use blank lines to separate paragraphs.', maxLength: 4000, showCount: true },
      { key: 'outcome', label: 'Outcome — The Result', type: 'long-text', group: 'Detail Page', hint: '2–4 paragraphs. Use blank lines to separate paragraphs.', maxLength: 4000, showCount: true },
      { key: 'keyTakeaways', label: 'Key Takeaways (one per line)', type: 'long-text', group: 'Detail Page', hint: 'Each line becomes a numbered bullet on the detail page.', maxLength: 2000, showCount: true },
      { key: 'galleryImages', label: 'Gallery Images (one URL per line)', type: 'long-text', group: 'Detail Page', hint: 'Image URLs (one per line). Shown in a grid on the detail page.', maxLength: 2000 },
    ],
    experiences: [
      { key: 'role', label: 'Role', type: 'text', required: true, maxLength: 120 },
      { key: 'company', label: 'Company', type: 'text', maxLength: 120 },
      { key: 'period', label: 'Period', type: 'text', maxLength: 60 },
      { key: 'description', label: 'Description', type: 'textarea', maxLength: 1000, showCount: true },
      { key: 'highlights', label: 'Highlights (comma-separated)', type: 'text', maxLength: 300 },
      { key: 'order', label: 'Order', type: 'number' },
    ],
    campaigns: [
      { key: 'title', label: 'Title', type: 'text', required: true, maxLength: 120 },
      { key: 'subtitle', label: 'Subtitle', type: 'text', maxLength: 120 },
      { key: 'imageUrl', label: 'Campaign Image', type: 'image' },
      { key: 'description', label: 'Description', type: 'textarea', maxLength: 1000, showCount: true },
      { key: 'projectId', label: 'Project ID', type: 'text', maxLength: 80 },
      { key: 'tags', label: 'Tags (comma-separated)', type: 'text', maxLength: 200 },
      { key: 'details', label: 'Details (JSON)', type: 'textarea', maxLength: 4000 },
      { key: 'order', label: 'Order', type: 'number' },
    ],
    skills: [
      { key: 'name', label: 'Category Name', type: 'text', required: true, maxLength: 80 },
      { key: 'skills', label: 'Skills (JSON array)', type: 'textarea', maxLength: 2000 },
      { key: 'order', label: 'Order', type: 'number' },
    ],
    education: [
      { key: 'degree', label: 'Degree', type: 'text', required: true, maxLength: 120 },
      { key: 'institution', label: 'Institution', type: 'text', maxLength: 120 },
      { key: 'year', label: 'Year', type: 'text', maxLength: 30 },
      { key: 'details', label: 'Details', type: 'textarea', maxLength: 1000, showCount: true },
      { key: 'order', label: 'Order', type: 'number' },
    ],
  };

  const fields = entityFields[entity] || [];

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    background: c.inputBg, border: `1px solid ${c.border}`,
    color: c.white, fontSize: '0.85rem', outline: 'none',
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.75rem', fontWeight: 700, color: c.white }}>{title}</h2>
          <p style={{ color: c.gray400, fontSize: '0.85rem', marginTop: 4 }}>{subtitle}</p>
        </div>
        <button onClick={openAdd} style={{
          padding: '10px 20px', background: c.gold, color: c.navy,
          borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Plus size={16} /> Add New
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: c.gray400, padding: '3rem' }}>Loading...</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', color: c.gray400, padding: '3rem' }}>No items yet. Add your first one!</div>
      ) : (
        items.map(item => {
          const isHighlighted = highlightId === item.id;
          return (
            <div key={item.id} style={{
              background: c.navyLight,
              border: `1px solid ${isHighlighted ? c.gold : c.border}`,
              borderRadius: 12, padding: '1.25rem', marginBottom: '0.75rem',
              transition: 'border-color 0.2s, box-shadow 0.3s',
              boxShadow: isHighlighted ? '0 0 0 4px rgba(200,150,62,0.18)' : 'none',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = c.borderHover}
              onMouseLeave={e => e.currentTarget.style.borderColor = isHighlighted ? c.gold : c.border}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                  {hasImage && item.imageUrl && (
                    <div style={{
                      width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                      border: `1px solid ${c.border}`,
                      background: String(item.imageUrl).endsWith('.png') ? '#0d1f3c' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <img src={item.imageUrl} alt="" style={{
                        width: '100%', height: '100%',
                        objectFit: String(item.imageUrl).endsWith('.png') ? 'contain' : 'cover',
                        padding: String(item.imageUrl).endsWith('.png') ? 4 : 0,
                      }} />
                    </div>
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: c.white, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{item[titleKey] || 'Untitled'}</span>
                      {entity === 'projects' && item.slug && (
                        <a
                          href={`/projects/${item.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 3,
                            color: c.gold, fontSize: '0.7rem', textDecoration: 'none',
                            padding: '2px 6px', borderRadius: 4,
                            border: `1px solid ${c.border}`,
                          }}
                          title={`Open /projects/${item.slug} in new tab`}
                        >
                          <Link2 size={10} /> /{item.slug}
                        </a>
                      )}
                    </div>
                    {subtitleKey && item[subtitleKey] && <div style={{ color: c.gray400, fontSize: '0.82rem', marginTop: 2 }}>{item[subtitleKey]}</div>}
                    <div style={{ color: c.gray600, fontSize: '0.72rem', marginTop: 2, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span>Order: {item.order || 0}</span>
                      {entity === 'projects' && (
                        <span style={{ color: item.featured ? c.gold : c.gray600 }}>
                          {item.featured ? '★ Featured' : '○ Not featured'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => openEdit(item)} style={{
                    padding: '6px 12px', fontSize: '0.75rem', background: c.inputBg,
                    border: `1px solid ${c.border}`, borderRadius: 6, color: c.white, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => { setPendingDelete({ id: item.id, name: item[titleKey] || 'this item' }); setDeleteConfirmText(''); }} style={{
                    padding: '6px 12px', fontSize: '0.75rem',
                    border: '1px solid rgba(239,68,68,0.4)', borderRadius: 6,
                    color: '#ef4444', background: 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
              {descKey && item[descKey] && (
                <p style={{ color: c.gray400, fontSize: '0.82rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', margin: 0 }}>{item[descKey]}</p>
              )}
              {tagsKey && item[tagsKey] && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {String(item[tagsKey]).split(',').map((t: string, i: number) => (
                    <span key={i} style={{
                      padding: '3px 8px', background: 'rgba(200,150,62,0.1)', color: c.gold,
                      borderRadius: 6, fontSize: '0.7rem', fontWeight: 500,
                    }}>{t.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Delete confirmation modal (replaces native confirm()) */}
      {pendingDelete && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
            padding: '1rem',
          }}
          onClick={() => { setPendingDelete(null); setDeleteConfirmText(''); }}
        >
          <div
            style={{
              background: c.navyLight, border: `1px solid rgba(239,68,68,0.3)`,
              borderRadius: 16, padding: '1.75rem', width: '100%', maxWidth: 440,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: 'rgba(239,68,68,0.12)', color: '#ef4444',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Trash2 size={18} />
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.1rem', fontWeight: 600, color: c.white, margin: 0 }}>
                Delete {entity === 'projects' ? 'project' : 'item'}?
              </h3>
            </div>
            <p style={{ color: c.gray400, fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>
              You are about to delete <span style={{ color: c.white, fontWeight: 600 }}>“{pendingDelete.name}”</span>.
              This cannot be undone.
              {entity === 'projects' && (
                <> The page <code style={{ color: c.gold, fontSize: '0.78rem' }}>/projects/[slug]</code> will immediately return 404, and any external links pointing to it will break.</>
              )}
            </p>
            {entity === 'projects' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: c.gray400, marginBottom: 6 }}>
                  Type the project title to confirm:
                </label>
                <input
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  placeholder={pendingDelete.name}
                  autoFocus
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    background: c.inputBg, border: `1px solid ${c.border}`,
                    color: c.white, fontSize: '0.85rem', outline: 'none',
                  }}
                />
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setPendingDelete(null); setDeleteConfirmText(''); }}
                style={{
                  padding: '9px 18px', background: c.inputBg, border: `1px solid ${c.border}`,
                  borderRadius: 8, color: c.white, fontSize: '0.85rem', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={entity === 'projects' && deleteConfirmText !== pendingDelete.name}
                style={{
                  padding: '9px 18px', background: '#ef4444', color: c.white,
                  borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  opacity: entity === 'projects' && deleteConfirmText !== pendingDelete.name ? 0.4 : 1,
                }}
              >
                <Trash2 size={14} /> Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal — sticky header + scrollable body + sticky footer */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
          padding: '1rem',
        }} onClick={closeForm}>
          <div
            style={{
              background: c.navyLight, border: `1px solid ${c.border}`,
              borderRadius: 20, width: '100%', maxWidth: 580,
              maxHeight: '92vh', display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Sticky header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              borderBottom: `1px solid ${c.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.2rem', fontWeight: 600, color: c.white, margin: 0 }}>
                  {editItem ? 'Edit Item' : 'Add New Item'}
                </h3>
                {isFormDirty() && (
                  <div style={{ fontSize: '0.72rem', color: c.gold, marginTop: 2 }}>
                    ● Unsaved changes (press Esc to discard)
                  </div>
                )}
              </div>
              <button onClick={closeForm} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: c.gray400,
                padding: 4,
              }} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <div style={{ padding: '1.25rem 1.75rem', overflowY: 'auto', flex: 1 }}>
              {/* Group fields by `group` property, render section headers when present */}
              {(() => {
                let lastGroup: string | undefined = undefined;
                return fields.map(f => {
                  const showGroupHeader = f.group && f.group !== lastGroup;
                  lastGroup = f.group;
                  const value = formData[f.key];
                  const charCount = typeof value === 'string' ? value.length : 0;
                  const overLimit = f.maxLength && charCount > f.maxLength;
                  return (
                    <React.Fragment key={f.key}>
                      {showGroupHeader && (
                        <div style={{
                          margin: '1.5rem 0 0.75rem',
                          padding: '0.5rem 0 0.4rem',
                          borderBottom: `1px solid ${c.border}`,
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                          <div style={{ width: 4, height: 14, background: c.gold, borderRadius: 2 }} />
                          <div style={{
                            fontSize: '0.72rem', fontWeight: 700, color: c.gold,
                            letterSpacing: '0.12em', textTransform: 'uppercase',
                          }}>{f.group}</div>
                        </div>
                      )}
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <label style={{ fontSize: '0.82rem', fontWeight: 500, color: c.gray400 }}>
                            {f.label}
                            {f.required && <span style={{ color: '#ef4444', marginLeft: 4 }}>*</span>}
                          </label>
                          {f.showCount && f.maxLength && (
                            <span style={{
                              fontSize: '0.7rem',
                              color: overLimit ? '#ef4444' : (charCount > f.maxLength * 0.8 ? c.gold : c.gray600),
                              fontVariantNumeric: 'tabular-nums',
                            }}>
                              {charCount} / {f.maxLength}
                            </span>
                          )}
                        </div>
                        {f.hint && (
                          <div style={{ fontSize: '0.72rem', color: c.gray600, marginBottom: 6, lineHeight: 1.4 }}>{f.hint}</div>
                        )}
                        {f.type === 'textarea' ? (
                          <textarea
                            value={formData[f.key] || ''}
                            onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                            maxLength={f.maxLength}
                            style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                          />
                        ) : f.type === 'long-text' ? (
                          <textarea
                            value={formData[f.key] || ''}
                            onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                            maxLength={f.maxLength}
                            style={{ ...inputStyle, minHeight: 160, resize: 'vertical', fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}
                          />
                        ) : f.type === 'slug' ? (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <input
                              value={formData[f.key] || ''}
                              onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                              placeholder="auto-generated from title on save"
                              maxLength={f.maxLength}
                              style={{ ...inputStyle, flex: 1 }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const t = (formData.title || '').toLowerCase()
                                  .replace(/[^a-z0-9\s-]/g, '')
                                  .replace(/\s+/g, '-')
                                  .replace(/-+/g, '-')
                                  .replace(/^-|-$/g, '');
                                if (!t) {
                                  notify('warning', 'Type a title first, then click Generate.');
                                  return;
                                }
                                setFormData({ ...formData, [f.key]: t });
                              }}
                              style={{
                                padding: '0 14px', background: c.inputBg,
                                border: `1px solid ${c.border}`, borderRadius: 8,
                                color: c.gold, fontSize: '0.78rem', cursor: 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Generate
                            </button>
                          </div>
                        ) : f.type === 'image' ? (
                          <ImageUpload
                            value={formData[f.key] || ''}
                            onChange={url => setFormData({ ...formData, [f.key]: url })}
                          />
                        ) : f.type === 'select' ? (
                          <select
                            value={formData[f.key] || ''}
                            onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                            style={inputStyle}
                          >
                            <option value="">Select...</option>
                            {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : f.type === 'number' ? (
                          <input
                            type="number"
                            value={formData[f.key] || 0}
                            onChange={e => setFormData({ ...formData, [f.key]: parseInt(e.target.value) || 0 })}
                            style={inputStyle}
                          />
                        ) : f.type === 'boolean' ? (
                          <label
                            style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '10px 14px', borderRadius: 8,
                              background: c.inputBg, border: `1px solid ${c.border}`,
                              cursor: 'pointer', userSelect: 'none',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={formData[f.key] === true || formData[f.key] === 'true'}
                              onChange={e => setFormData({ ...formData, [f.key]: e.target.checked })}
                              style={{ width: 18, height: 18, accentColor: c.gold, cursor: 'pointer' }}
                            />
                            <span style={{ color: c.white, fontSize: '0.85rem' }}>
                              {formData[f.key] === true || formData[f.key] === 'true' ? 'Yes — featured' : 'No — not featured'}
                            </span>
                          </label>
                        ) : (
                          <input
                            value={formData[f.key] || ''}
                            onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                            maxLength={f.maxLength}
                            style={inputStyle}
                          />
                        )}
                      </div>
                    </React.Fragment>
                  );
                });
              })()}
            </div>

            {/* Sticky footer with Save / Cancel */}
            <div style={{
              padding: '1rem 1.75rem',
              borderTop: `1px solid ${c.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              flexShrink: 0,
              background: c.navyLight,
            }}>
              <div style={{ fontSize: '0.72rem', color: c.gray600 }}>
                {editItem ? 'Editing existing item' : 'Creating new item'}
                {isFormDirty() ? ' • unsaved changes' : ''}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={closeForm} style={{
                  padding: '10px 18px', background: c.inputBg, border: `1px solid ${c.border}`,
                  borderRadius: 8, color: c.white, fontSize: '0.85rem', cursor: 'pointer',
                }}>
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: '10px 20px', background: c.gold, color: c.navy,
                    borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8,
                    opacity: saving ? 0.6 : 1,
                  }}>
                    <Save size={16} /> {saving ? 'Saving...' : 'Save'}
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
