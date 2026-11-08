import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Video, Play, Image as ImageIcon, Heart, Search, Filter, Plus, 
  X, Check, Trash2, Edit3, Download, Share2, Calendar, MapPin, User, 
  Sparkles, ExternalLink, ShieldCheck, CheckCircle2, RotateCcw, AlertCircle
} from 'lucide-react';
import { 
  getGalleryMedia, addGalleryMedia, updateGalleryMedia, deleteGalleryMedia, 
  resetGalleryMediaToDefaults, OFFICIAL_BRANCHES, parseVideoEmbedUrl 
} from '../services/store';

export default function GalleryPage({ currentUser, setActivePage }) {
  const [mediaList, setMediaList] = useState(() => getGalleryMedia());
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'welfare_evidence', 'video', 'image', 'annual_conference', 'thanksgiving'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');

  // Modals
  const [activeLightboxMedia, setActiveLightboxMedia] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State for Adding / Editing Media
  const [formType, setFormType] = useState('image'); // 'image' or 'video'
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('welfare_evidence');
  const [formBranch, setFormBranch] = useState('Aburi');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formDescription, setFormDescription] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const [isCompressing, setIsCompressing] = useState(false);
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const fileInputRef = useRef(null);

  const isAdmin = currentUser?.role === 'admin' || (typeof window !== 'undefined' && !!sessionStorage.getItem('ony_impersonated_by'));

  // Listen for live updates across tabs / components
  useEffect(() => {
    const handleGalleryUpdate = () => {
      setMediaList(getGalleryMedia());
    };
    window.addEventListener('ony_gallery_updated', handleGalleryUpdate);
    return () => window.removeEventListener('ony_gallery_updated', handleGalleryUpdate);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveLightboxMedia(null);
        setIsAddModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Client-Side Image Compression using Canvas (< 300KB)
  const handleImageFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setIsCompressing(true);
    setFormError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 1280;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setFormUrl(dataUrl);
        setFormThumbnail(dataUrl);
        setIsCompressing(false);
      };
      img.onerror = () => {
        setIsCompressing(false);
        setFormError('Failed to read image file.');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingMedia(null);
    setFormType('image');
    setFormTitle('');
    setFormCategory('welfare_evidence');
    setFormBranch('Aburi');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDescription('');
    setFormUrl('');
    setFormThumbnail('');
    setUploadMode('file');
    setFormError('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingMedia(item);
    setFormType(item.media_type || 'image');
    setFormTitle(item.title || '');
    setFormCategory(item.category || 'general_meeting');
    setFormBranch(item.branch || 'Aburi');
    setFormDate(item.date || new Date().toISOString().split('T')[0]);
    setFormDescription(item.description || '');
    setFormUrl(item.url || '');
    setFormThumbnail(item.thumbnail_url || '');
    setUploadMode(item.url?.startsWith('data:') ? 'file' : 'url');
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleSaveMedia = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Please enter a title for this fellowship moment.');
      return;
    }
    if (!formUrl.trim()) {
      setFormError(formType === 'image' ? 'Please upload or provide an image URL.' : 'Please provide a video URL.');
      return;
    }

    if (editingMedia) {
      updateGalleryMedia(editingMedia.id, {
        title: formTitle,
        category: formCategory,
        branch: formBranch,
        date: formDate,
        description: formDescription,
        media_type: formType,
        url: formUrl,
        thumbnail_url: formThumbnail || (formType === 'image' ? formUrl : '')
      });
      setSuccessToast('✅ Fellowship media entry updated successfully!');
    } else {
      addGalleryMedia({
        title: formTitle,
        category: formCategory,
        branch: formBranch,
        date: formDate,
        description: formDescription,
        media_type: formType,
        url: formUrl,
        thumbnail_url: formThumbnail || (formType === 'image' ? formUrl : ''),
        uploaded_by: currentUser?.full_name || 'Executive Secretary'
      });
      setSuccessToast('✅ New fellowship moment added to the gallery!');
    }

    setMediaList(getGalleryMedia());
    setIsAddModalOpen(false);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleDeleteMedia = (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the fellowship gallery?`)) {
      deleteGalleryMedia(id);
      setMediaList(getGalleryMedia());
      if (activeLightboxMedia?.id === id) {
        setActiveLightboxMedia(null);
      }
      setSuccessToast('🗑️ Media item deleted.');
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset gallery to default verified fellowship moments?')) {
      resetGalleryMediaToDefaults();
      setMediaList(getGalleryMedia());
      setSuccessToast('Restored initial fellowship gallery.');
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  // Filtered Media List
  const filteredMedia = mediaList.filter(item => {
    // Category match
    if (activeCategory === 'video' && item.media_type !== 'video') return false;
    if (activeCategory === 'image' && item.media_type !== 'image') return false;
    if (activeCategory !== 'all' && activeCategory !== 'video' && activeCategory !== 'image') {
      if (item.category !== activeCategory) return false;
    }

    // Branch match
    if (selectedBranch !== 'all' && item.branch !== selectedBranch) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchBranch = item.branch?.toLowerCase().includes(q);
      const matchUploadedBy = item.uploaded_by?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchBranch && !matchUploadedBy) return false;
    }

    return true;
  });

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'welfare_evidence':
        return { label: '🤝 Welfare Hand-Over', bg: 'rgba(5, 150, 105, 0.12)', color: '#059669', border: 'rgba(5, 150, 105, 0.3)' };
      case 'annual_conference':
        return { label: '⛪ Annual Conference', bg: 'rgba(37, 99, 235, 0.12)', color: '#2563eb', border: 'rgba(37, 99, 235, 0.3)' };
      case 'general_meeting':
        return { label: '👥 Executive & General', bg: 'rgba(124, 58, 237, 0.12)', color: '#7c3aed', border: 'rgba(124, 58, 237, 0.3)' };
      case 'thanksgiving':
        return { label: '🌾 Thanksgiving & Praise', bg: 'rgba(217, 119, 6, 0.12)', color: '#d97706', border: 'rgba(217, 119, 6, 0.3)' };
      case 'executive_message':
        return { label: '📢 Executive Address', bg: 'rgba(220, 38, 38, 0.12)', color: '#dc2626', border: 'rgba(220, 38, 38, 0.3)' };
      default:
        return { label: '📸 Fellowship Life', bg: 'rgba(100, 116, 139, 0.12)', color: 'var(--text-muted)', border: 'var(--border-color)' };
    }
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const photoCount = mediaList.filter(m => m.media_type === 'image').length;
  const videoCount = mediaList.filter(m => m.media_type === 'video').length;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>

      {/* Success Toast Notification */}
      {successToast && (
        <div style={{ 
          position: 'fixed', 
          bottom: '24px', 
          right: '24px', 
          zIndex: 99999, 
          background: '#064e3b', 
          color: '#ffffff', 
          padding: '0.85rem 1.4rem', 
          borderRadius: '12px', 
          fontWeight: 800, 
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          <CheckCircle2 size={18} color="#34d399" /> {successToast}
        </div>
      )}

      {/* Hero Banner Header */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '2.5rem 1.75rem', 
          borderRadius: '20px', 
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(37, 99, 235, 0.08), rgba(217, 119, 6, 0.06))',
          border: '1.5px solid rgba(5, 150, 105, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(5, 150, 105, 0.15)', color: '#059669', padding: '0.3rem 0.85rem', borderRadius: '30px', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.85rem' }}>
            <Sparkles size={14} /> Fellowship Life & Welfare Evidence
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, lineHeight: 1.15, margin: '0 0 0.85rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            📸 Fellowship Media & Video Hub
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            Visual testimonies of brotherly love, annual conferences, welfare grant hand-overs, and video addresses across all <strong>16 branches</strong> of Onuado Na Ye Men's Fellowship.
          </p>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', background: 'var(--bg-main)', padding: '0.4rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <ImageIcon size={16} color="#059669" /> {photoCount} Photos
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', background: 'var(--bg-main)', padding: '0.4rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <Video size={16} color="#dc2626" /> {videoCount} Video Recordings
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', background: 'var(--bg-main)', padding: '0.4rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <MapPin size={16} color="#d97706" /> 16 Branches Covered
            </div>

            {isAdmin && (
              <button
                onClick={openAddModal}
                className="btn btn-primary"
                style={{ 
                  padding: '0.5rem 1.15rem', 
                  fontSize: '0.85rem', 
                  fontWeight: 800, 
                  background: 'linear-gradient(135deg, #059669, #065f46)', 
                  borderColor: '#059669', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.45rem',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
                  marginLeft: 'auto'
                }}
              >
                <Plus size={16} /> ➕ Upload Photo / Add Video
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        
        {/* Category Pill Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.4rem', WebkitOverflowScrolling: 'touch' }}>
          {[
            { id: 'all', label: 'All Media', icon: Sparkles },
            { id: 'welfare_evidence', label: '🤝 Welfare Hand-Overs', icon: Heart },
            { id: 'video', label: '🎥 Videos & Addresses', icon: Video },
            { id: 'image', label: '📸 Photos Gallery', icon: ImageIcon },
            { id: 'annual_conference', label: '⛪ Annual Conferences', icon: Calendar },
            { id: 'thanksgiving', label: '🌾 Thanksgiving & Praise', icon: Sparkles }
          ].map(tab => {
            const isActive = activeCategory === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '30px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: isActive ? '1.5px solid #059669' : '1px solid var(--border-color)',
                  background: isActive ? '#059669' : 'var(--bg-main)',
                  color: isActive ? '#ffffff' : 'var(--text-main)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Branch Select Row */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search by title, event, elder, or branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ width: '100%', paddingLeft: '2.4rem', fontSize: '0.85rem' }}
            />
          </div>

          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '170px', fontSize: '0.85rem', fontWeight: 700 }}
          >
            <option value="all">📍 All 16 Branches</option>
            {OFFICIAL_BRANCHES.map(b => (
              <option key={b.name} value={b.name}>{b.name} ({b.region})</option>
            ))}
          </select>

          {isAdmin && (
            <button
              onClick={handleResetDefaults}
              className="btn btn-secondary"
              title="Reset gallery to default fellowship photos"
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 1.5rem', textAlign: 'center', borderRadius: '16px' }}>
          <ImageIcon size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text-main)' }}>
            No fellowship media found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Try clearing your search query or switching category filters to see all fellowship pictures and videos.
          </p>
          <button 
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); setSelectedBranch('all'); }} 
            className="btn btn-secondary"
          >
            View All Media
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredMedia.map((item) => {
            const badge = getCategoryBadge(item.category);
            const isVideo = item.media_type === 'video';

            return (
              <div 
                key={item.id}
                className="glass-card"
                style={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: '1px solid var(--border-color)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  background: 'var(--bg-main)'
                }}
              >
                {/* Media Preview Container */}
                <div 
                  onClick={() => setActiveLightboxMedia(item)}
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    paddingTop: '56.25%', // 16:9 Aspect Ratio
                    background: '#0f172a', 
                    cursor: 'pointer',
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={item.thumbnail_url || item.url} 
                    alt={item.title}
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80';
                    }}
                  />

                  {/* Top Badges */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
                    <span 
                      style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 800, 
                        padding: '0.25rem 0.65rem', 
                        borderRadius: '20px', 
                        background: 'rgba(15, 23, 42, 0.85)', 
                        color: badge.color, 
                        border: `1px solid ${badge.border}`,
                        backdropFilter: 'blur(4px)',
                        pointerEvents: 'auto'
                      }}
                    >
                      {badge.label}
                    </span>

                    {isVideo && (
                      <span 
                        style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 900, 
                          padding: '0.2rem 0.55rem', 
                          borderRadius: '6px', 
                          background: '#dc2626', 
                          color: '#fff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Play size={10} fill="#fff" /> VIDEO
                      </span>
                    )}
                  </div>

                  {/* Play Button Overlay for Videos */}
                  {isVideo && (
                    <div 
                      style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        background: 'rgba(0,0,0,0.3)' 
                      }}
                    >
                      <div 
                        style={{ 
                          width: '54px', 
                          height: '54px', 
                          borderRadius: '50%', 
                          background: 'rgba(220, 38, 38, 0.95)', 
                          color: '#fff', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          boxShadow: '0 8px 25px rgba(220, 38, 38, 0.5)',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        <Play size={24} fill="#fff" style={{ marginLeft: '3px' }} />
                      </div>
                    </div>
                  )}

                  {/* Photo Expand Pill */}
                  {!isVideo && (
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.65)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ImageIcon size={12} /> View Full
                    </div>
                  )}
                </div>

                {/* Content Box */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  
                  {/* Meta Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} color="#d97706" /> {item.branch}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} /> {item.date}
                    </div>
                  </div>

                  <h3 
                    onClick={() => setActiveLightboxMedia(item)}
                    style={{ 
                      fontSize: '1.05rem', 
                      fontWeight: 800, 
                      color: 'var(--text-main)', 
                      margin: '0 0 0.5rem', 
                      cursor: 'pointer',
                      lineHeight: 1.35
                    }}
                  >
                    {item.title}
                  </h3>

                  <p style={{ 
                    fontSize: '0.85rem', 
                    color: 'var(--text-muted)', 
                    lineHeight: 1.5, 
                    margin: '0 0 1rem', 
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.description || 'Verified fellowship activity recorded in the official archives.'}
                  </p>

                  {/* Footer Action Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <User size={12} /> {item.uploaded_by || 'Executive'}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {isAdmin && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); openEditModal(item); }}
                            style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: '0.2rem' }}
                            title="Edit this moment"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleDeleteMedia(item.id, item.title); }}
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.2rem' }}
                            title="Delete this moment"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => setActiveLightboxMedia(item)}
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', fontWeight: 800 }}
                      >
                        {isVideo ? 'Play Video ▶' : 'View Photo 🔍'}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* 🔍 LIGHTBOX & EMBEDDED VIDEO PLAYER MODAL                 */}
      {/* ========================================================= */}
      {activeLightboxMedia && (
        <div 
          onClick={() => setActiveLightboxMedia(null)}
          style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: 99999, 
            background: 'rgba(5, 10, 20, 0.92)', 
            backdropFilter: 'blur(10px)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '1rem',
            overflowY: 'auto'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-card"
            style={{ 
              width: '100%', 
              maxWidth: '920px', 
              maxHeight: '94vh', 
              background: 'var(--bg-card)', 
              borderRadius: '20px', 
              border: '1.5px solid var(--border-color)', 
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)', 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Top Bar */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span 
                  style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 800, 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '20px', 
                    background: getCategoryBadge(activeLightboxMedia.category).bg, 
                    color: getCategoryBadge(activeLightboxMedia.category).color,
                    border: `1px solid ${getCategoryBadge(activeLightboxMedia.category).border}`
                  }}
                >
                  {getCategoryBadge(activeLightboxMedia.category).label}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={12} color="#d97706" /> {activeLightboxMedia.branch} • {activeLightboxMedia.date}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => copyToClipboard(activeLightboxMedia.url)}
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', fontWeight: 700 }}
                  title="Copy media URL"
                >
                  {copiedLink ? <Check size={14} color="#059669" /> : <Share2 size={14} />} {copiedLink ? 'Copied' : 'Share'}
                </button>

                {activeLightboxMedia.media_type === 'image' && (
                  <a
                    href={activeLightboxMedia.url}
                    download={`onuado-na-ye-${activeLightboxMedia.id}.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', fontWeight: 700 }}
                    title="Download Photo"
                  >
                    <Download size={14} /> Download
                  </a>
                )}

                <button
                  onClick={() => setActiveLightboxMedia(null)}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Media Body Container */}
            <div style={{ background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {activeLightboxMedia.media_type === 'video' ? (
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' /* 16:9 */ }}>
                  {activeLightboxMedia.embed_url ? (
                    <iframe
                      src={`${activeLightboxMedia.embed_url}?autoplay=1`}
                      title={activeLightboxMedia.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      controls
                      autoPlay
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      src={activeLightboxMedia.url}
                    >
                      Your browser does not support HTML5 video.
                    </video>
                  )}
                </div>
              ) : (
                <div style={{ maxHeight: '68vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img
                    src={activeLightboxMedia.url}
                    alt={activeLightboxMedia.title}
                    style={{ maxWidth: '100%', maxHeight: '68vh', objectFit: 'contain' }}
                  />
                </div>
              )}
            </div>

            {/* Description & Metadata Footer */}
            <div style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-card)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 0.5rem' }}>
                {activeLightboxMedia.title}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                {activeLightboxMedia.description || 'Fellowship archival activity verified by the Executive Secretary.'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>Recorded by: <strong>{activeLightboxMedia.uploaded_by || 'Executive Council'}</strong></span>
                <span>Branch: <strong>{activeLightboxMedia.branch}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ➕ EXECUTIVE ADD / EDIT MEDIA MODAL                      */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: 99999, 
            background: 'rgba(15, 23, 42, 0.85)', 
            backdropFilter: 'blur(8px)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '1.25rem' 
          }}
        >
          <div 
            className="glass-card"
            style={{ 
              width: '100%', 
              maxWidth: '620px', 
              maxHeight: '90vh', 
              borderRadius: '20px', 
              border: '1.5px solid rgba(5, 150, 105, 0.4)', 
              background: 'var(--bg-card)', 
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(90deg, rgba(5, 150, 105, 0.1), rgba(37, 99, 235, 0.08))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(5, 150, 105, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                  {formType === 'image' ? <Camera size={22} /> : <Video size={22} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>
                    {editingMedia ? '✏️ Edit Fellowship Media' : '➕ Upload Photo or Video'}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Add visual memories, welfare hand-overs, and video messages to the hub
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(220, 38, 38, 0.2)' }}>
                <AlertCircle size={16} /> {formError}
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={handleSaveMedia} style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Type Switcher */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  1. Media Format
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setFormType('image')}
                    style={{
                      padding: '0.65rem',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: formType === 'image' ? '2px solid #059669' : '1px solid var(--border-color)',
                      background: formType === 'image' ? 'rgba(5, 150, 105, 0.12)' : 'var(--bg-main)',
                      color: formType === 'image' ? '#059669' : 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem'
                    }}
                  >
                    <ImageIcon size={16} /> 📸 Photograph
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormType('video')}
                    style={{
                      padding: '0.65rem',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: formType === 'video' ? '2px solid #dc2626' : '1px solid var(--border-color)',
                      background: formType === 'video' ? 'rgba(220, 38, 38, 0.12)' : 'var(--bg-main)',
                      color: formType === 'video' ? '#dc2626' : 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem'
                    }}
                  >
                    <Video size={16} /> 🎥 Video Recording
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  2. Title / Occasion Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Welfare Support Grant Hand-over to Eld. Kojo Acheampong"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.88rem', fontWeight: 700 }}
                />
              </div>

              {/* Category & Branch Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    3. Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="form-select"
                    style={{ width: '100%', fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    <option value="welfare_evidence">🤝 Welfare Hand-Over (Special Levies)</option>
                    <option value="annual_conference">⛪ Annual General Conference</option>
                    <option value="general_meeting">👥 Executive & General Meetings</option>
                    <option value="thanksgiving">🌾 Thanksgiving & Praise Service</option>
                    <option value="executive_message">📢 Executive Keynote Address</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    4. Fellowship Branch
                  </label>
                  <select
                    value={formBranch}
                    onChange={(e) => setFormBranch(e.target.value)}
                    className="form-select"
                    style={{ width: '100%', fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    {OFFICIAL_BRANCHES.map(b => (
                      <option key={b.name} value={b.name}>{b.name} ({b.region})</option>
                    ))}
                    <option value="All 16 Branches">All 16 Branches (National)</option>
                  </select>
                </div>
              </div>

              {/* Event Date */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  5. Event Date
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.85rem', fontWeight: 700 }}
                />
              </div>

              {/* Image Source or Video Link */}
              {formType === 'image' ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                      6. Photo Source *
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => setUploadMode('file')}
                        style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: uploadMode === 'file' ? '#059669' : 'transparent', color: uploadMode === 'file' ? '#fff' : 'var(--text-main)', cursor: 'pointer' }}
                      >
                        Device File
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadMode('url')}
                        style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: uploadMode === 'url' ? '#059669' : 'transparent', color: uploadMode === 'url' ? '#fff' : 'var(--text-main)', cursor: 'pointer' }}
                      >
                        Web Link
                      </button>
                    </div>
                  </div>

                  {uploadMode === 'file' ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      style={{ 
                        border: '2px dashed var(--border-color)', 
                        padding: '1.25rem', 
                        borderRadius: '12px', 
                        textAlign: 'center', 
                        cursor: 'pointer',
                        background: 'var(--bg-main)',
                        transition: 'border-color 0.2s ease'
                      }}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        accept="image/*" 
                        onChange={handleImageFileSelect} 
                        style={{ display: 'none' }} 
                      />
                      {isCompressing ? (
                        <div style={{ color: '#059669', fontWeight: 700, fontSize: '0.85rem' }}>
                          ⚡ Optimizing and compressing image...
                        </div>
                      ) : formUrl ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={formUrl} alt="Preview" style={{ height: '90px', borderRadius: '8px', objectFit: 'cover' }} />
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 800 }}>✓ Photo ready for upload (Click to change)</span>
                        </div>
                      ) : (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          <Camera size={26} style={{ margin: '0 auto 0.4rem', color: '#059669' }} />
                          <div>Click or tap to snap / upload photo from your device</div>
                          <div style={{ fontSize: '0.72rem', opacity: 0.7, marginTop: '0.2rem' }}>Automatic client-side compression for high performance</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type="url"
                      placeholder="https://example.com/fellowship-photo.jpg"
                      value={formUrl}
                      onChange={(e) => { setFormUrl(e.target.value); setFormThumbnail(e.target.value); }}
                      className="form-input"
                      style={{ width: '100%', fontSize: '0.85rem' }}
                    />
                  )}
                </div>
              ) : (
                /* Video Input */
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    6. Video Link (YouTube, Vimeo, or MP4 URL) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="e.g. https://www.youtube.com/watch?v=VIDEO_ID or Vimeo link"
                    value={formUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormUrl(val);
                      // Try extracting YouTube thumbnail
                      const ytMatch = val.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
                      if (ytMatch && ytMatch[1]) {
                        setFormThumbnail(`https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`);
                      }
                    }}
                    className="form-input"
                    style={{ width: '100%', fontSize: '0.85rem', fontWeight: 700 }}
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    💡 Paste any YouTube link. It is automatically converted into a responsive, mobile-friendly in-app player.
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  7. Description / Testimony Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="Provide context, scriptures quoted, elder attendees, or welfare recipient details..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              {/* Footer Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCompressing}
                  className="btn btn-primary"
                  style={{ padding: '0.55rem 1.4rem', fontSize: '0.85rem', fontWeight: 800, background: '#059669', borderColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Check size={16} /> {editingMedia ? 'Save Changes' : 'Publish to Gallery'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

