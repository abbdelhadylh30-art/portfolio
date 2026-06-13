'use client';

import React, { useEffect, useState } from 'react';

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
/*  Auth                                                               */
/* ------------------------------------------------------------------ */

let authToken = '';

async function api(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
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
/*  Dashboard Page                                                     */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('profile');
  const [loginError, setLoginError] = useState('');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-10 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-2">Dashboard <span className="text-emerald-500">Panel</span></h1>
          <p className="text-gray-400 text-sm mb-6">Sign in to manage your portfolio content</p>
          {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#222222] border border-[#2a2a2a] rounded-lg text-white text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#222222] border border-[#2a2a2a] rounded-lg text-white text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <button onClick={handleLogin} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#111111] border-r border-[#2a2a2a] p-6 flex flex-col fixed top-0 left-0 bottom-0 overflow-y-auto">
        <div className="text-xl font-bold mb-2 px-2">M.A <span className="text-emerald-500">Dashboard</span></div>
        <div className="text-xs text-gray-600 mb-8 px-2">Portfolio Admin Panel</div>
        <div className="space-y-1">
          {[
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'projects', label: 'Projects', icon: '📁' },
            { id: 'experiences', label: 'Experience', icon: '💼' },
            { id: 'campaigns', label: 'Campaigns', icon: '⭐' },
            { id: 'skills', label: 'Skills', icon: '📊' },
            { id: 'education', label: 'Education', icon: '🎓' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2.5 transition-colors ${
                currentPage === item.id ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-[#2a2a2a] space-y-1">
          <a href="/" target="_blank" className="w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2.5 text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition-colors no-underline">
            🔗 View Portfolio
          </a>
          <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2.5 text-red-500 hover:bg-red-500/10 transition-colors">
            🚪 Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-gray-400">Connected to Portfolio API — Changes appear instantly on the live site</span>
        </div>
        <ContentArea page={currentPage} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Content Area                                                       */
/* ------------------------------------------------------------------ */

function ContentArea({ page }: { page: string }) {
  switch (page) {
    case 'profile': return <ProfileEditor />;
    case 'projects': return <ItemList entity="projects" title="Projects" subtitle="Manage your portfolio projects" titleKey="title" subtitleKey="category" descKey="description" tagsKey="tags" />;
    case 'experiences': return <ItemList entity="experiences" title="Experience" subtitle="Manage your work experience" titleKey="role" subtitleKey="company" descKey="description" tagsKey="highlights" />;
    case 'campaigns': return <ItemList entity="campaigns" title="Campaigns" subtitle="Manage your campaign concepts" titleKey="title" subtitleKey="subtitle" descKey="description" tagsKey="tags" />;
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

  if (!profile) return <div className="text-center text-gray-500 py-12">Loading...</div>;

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
      alert('Profile updated! Changes are live on your portfolio.');
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <p className="text-gray-400 text-sm mt-1">Update your personal information and hero section</p>
      </div>
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        {fields.map(f => (
          <div key={f.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-1.5">{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea
                value={profile[f.key] || ''}
                onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#222222] border border-[#2a2a2a] rounded-lg text-white text-sm outline-none focus:border-emerald-500 min-h-[80px] resize-y"
              />
            ) : (
              <input
                value={profile[f.key] || ''}
                onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#222222] border border-[#2a2a2a] rounded-lg text-white text-sm outline-none focus:border-emerald-500"
              />
            )}
          </div>
        ))}
        <button onClick={handleSave} disabled={saving} className="mt-4 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Item List                                                          */
/* ------------------------------------------------------------------ */

function ItemList({ entity, title, subtitle, titleKey, subtitleKey, descKey, tagsKey }: {
  entity: string;
  title: string;
  subtitle: string;
  titleKey: string;
  subtitleKey?: string;
  descKey?: string;
  tagsKey?: string;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchItems = () => {
    setLoading(true);
    api(`/api/dashboard/${entity}`)
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

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

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api(`/api/dashboard/${entity}`, { method: 'DELETE', body: JSON.stringify({ id }) });
      fetchItems();
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const handleSave = async () => {
    try {
      if (editItem) {
        await api(`/api/dashboard/${entity}`, { method: 'PUT', body: JSON.stringify({ ...formData, id: editItem.id }) });
      } else {
        await api(`/api/dashboard/${entity}`, { method: 'POST', body: JSON.stringify(formData) });
      }
      setShowForm(false);
      setEditItem(null);
      setFormData({});
      fetchItems();
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const openAdd = () => {
    setEditItem(null);
    setFormData({});
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const entityFields: Record<string, { key: string; label: string; type: string; options?: string[] }[]> = {
    projects: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'category', label: 'Category', type: 'select', options: ['Brand Audit', 'Campaign', 'Digital', 'Research'] },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'tags', label: 'Tags (comma-separated)', type: 'text' },
      { key: 'order', label: 'Order', type: 'number' },
    ],
    experiences: [
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'company', label: 'Company', type: 'text' },
      { key: 'period', label: 'Period', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'highlights', label: 'Highlights (comma-separated)', type: 'text' },
      { key: 'order', label: 'Order', type: 'number' },
    ],
    campaigns: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'tags', label: 'Tags (comma-separated)', type: 'text' },
      { key: 'details', label: 'Details (JSON)', type: 'textarea' },
      { key: 'order', label: 'Order', type: 'number' },
    ],
    skills: [
      { key: 'name', label: 'Category Name', type: 'text' },
      { key: 'skills', label: 'Skills (JSON array)', type: 'textarea' },
      { key: 'order', label: 'Order', type: 'number' },
    ],
    education: [
      { key: 'degree', label: 'Degree', type: 'text' },
      { key: 'institution', label: 'Institution', type: 'text' },
      { key: 'year', label: 'Year', type: 'text' },
      { key: 'details', label: 'Details', type: 'textarea' },
      { key: 'order', label: 'Order', type: 'number' },
    ],
  };

  const fields = entityFields[entity] || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
        </div>
        <button onClick={openAdd} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors text-sm">
          + Add New
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500 py-12">No items yet. Add your first one!</div>
      ) : (
        items.map(item => (
          <div key={item.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 mb-4 hover:border-[#333] transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-base font-semibold">{item[titleKey] || 'Untitled'}</div>
                {subtitleKey && item[subtitleKey] && <div className="text-gray-500 text-sm mt-1">{item[subtitleKey]}</div>}
                <div className="text-gray-600 text-xs mt-1">Order: {item.order || 0}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="px-3 py-1.5 text-xs bg-[#222222] border border-[#2a2a2a] rounded-lg text-white hover:border-emerald-500 transition-colors">Edit</button>
                <button onClick={() => handleDelete(item.id, item[titleKey])} className="px-3 py-1.5 text-xs border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">Delete</button>
              </div>
            </div>
            {descKey && item[descKey] && (
              <p className="text-gray-400 text-sm line-clamp-3">{item[descKey]}</p>
            )}
            {tagsKey && item[tagsKey] && (
              <div className="flex gap-2 flex-wrap mt-3">
                {String(item[tagsKey]).split(',').map((t: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-md text-xs font-medium">{t.trim()}</span>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => { setShowForm(false); setEditItem(null); }}>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-6">{editItem ? 'Edit Item' : 'Add New Item'}</h3>
            {fields.map(f => (
              <div key={f.key} className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={formData[f.key] || ''}
                    onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#222222] border border-[#2a2a2a] rounded-lg text-white text-sm outline-none focus:border-emerald-500 min-h-[80px] resize-y"
                  />
                ) : f.type === 'select' ? (
                  <select
                    value={formData[f.key] || ''}
                    onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#222222] border border-[#2a2a2a] rounded-lg text-white text-sm outline-none focus:border-emerald-500"
                  >
                    {(f.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : f.type === 'number' ? (
                  <input
                    type="number"
                    value={formData[f.key] || 0}
                    onChange={e => setFormData({ ...formData, [f.key]: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-[#222222] border border-[#2a2a2a] rounded-lg text-white text-sm outline-none focus:border-emerald-500"
                  />
                ) : (
                  <input
                    value={formData[f.key] || ''}
                    onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#222222] border border-[#2a2a2a] rounded-lg text-white text-sm outline-none focus:border-emerald-500"
                  />
                )}
              </div>
            ))}
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => { setShowForm(false); setEditItem(null); }} className="px-5 py-2.5 bg-[#222222] border border-[#2a2a2a] rounded-lg text-white text-sm transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
