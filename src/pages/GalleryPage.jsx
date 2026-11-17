import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Camera, Video, Play, Image as ImageIcon, Search, Plus, X, Check, Trash2, Edit3,
  Download, Calendar, MapPin, User, Sparkles, ShieldCheck, AlertCircle, UploadCloud,
  Loader2, ChevronLeft, ChevronRight, Users, Layers, RefreshCw, Star, ArrowLeft, ArrowRight
} from 'lucide-react';
import {
  OFFICIAL_BRANCHES,
  parseVideoEmbedUrl,
  uploadMediaFile,
  fetchAlbumsFromServer,
  createAlbumOnServer,
  uploadMediaToAlbum,
  updateAlbumOnServer,
  deleteAlbumOnServer,
  fetchMembersDirectoryFromServer,
  saveMemberDirectoryRecord,
  deleteMemberDirectoryRecord
} from '../services/store';

const TABS = [
  { id: 'all', label: 'All Media', icon: Sparkles },
  { id: 'members', label: 'Know Your Members', icon: Users },
  { id: 'photos', label: 'Photos', icon: ImageIcon },
  { id: 'videos', label: 'Videos', icon: Video }
];

const CATEGORIES = [
  { id: 'welfare_evidence', label: '🤝 Welfare Hand-Over' },
  { id: 'annual_conference', label: '⛪ Annual Conference' },
  { id: 'general_meeting', label: '👥 Executive & General' },
  { id: 'thanksgiving', label: '🌾 Thanksgiving & Praise' },
  { id: 'executive_message', label: '📢 Executive Address' }
];

function getInitialQueryParam(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  const params = new URLSearchParams(window.location.search);
  return params.get(key) || fallback;
}

export default function GalleryPage({ currentUser }) {
  // Navigation & Filters (synced with URL query params)
  const [activeTab, setActiveTab] = useState(() => {
    const t = getInitialQueryParam('tab', 'all');
    return TABS.some(x => x.id === t) ? t : 'all';
  });
  const [selectedBranch, setSelectedBranch] = useState(() => getInitialQueryParam('branch', 'all'));
  const [searchQuery, setSearchQuery] = useState(() => getInitialQueryParam('q', ''));

  // Data
  const [albums, setAlbums] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animKey, setAnimKey] = useState(0);
  const [toast, setToast] = useState('');

  // Album Lightbox
  const [lightboxAlbum, setLightboxAlbum] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Member Profile Lightbox
  const [lightboxMember, setLightboxMember] = useState(null);

  // Admin Upload Modal (Single + Album)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState('album'); // 'single' | 'album'
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formBranch, setFormBranch] = useState('Aburi');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formCategory, setFormCategory] = useState('welfare_evidence');
  const [formDescription, setFormDescription] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [singleSourceType, setSingleSourceType] = useState('file'); // 'file' | 'url'
  const [singleVideoUrl, setSingleVideoUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]); // { id, file, previewUrl, type, status: 'pending'|'uploading'|'done'|'error', loaded, total, error }
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState('');

  // Admin Member Modal
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memName, setMemName] = useState('');
  const [memBranch, setMemBranch] = useState('Aburi');
  const [memRole, setMemRole] = useState('Member');
  const [memBio, setMemBio] = useState('');
  const [memPhotoUrl, setMemPhotoUrl] = useState('');
  const [isUploadingMemPhoto, setIsUploadingMemPhoto] = useState(false);

  const fileInputRef = useRef(null);
  const memPhotoInputRef = useRef(null);

  const isAdmin =
    currentUser?.role === 'admin' ||
    (typeof window !== 'undefined' && !!sessionStorage.getItem('ony_impersonated_by'));

  // Sync URL query params
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    params.set('tab', activeTab);
    if (selectedBranch !== 'all') params.set('branch', selectedBranch);
    else params.delete('branch');
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    else params.delete('q');
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [activeTab, selectedBranch, searchQuery]);

  // Load Albums & Members
  const loadData = async () => {
    setIsLoading(true);
    const [fetchedAlbums, fetchedMembers] = await Promise.all([
      fetchAlbumsFromServer(),
      fetchMembersDirectoryFromServer()
    ]);
    setAlbums(fetchedAlbums || []);
    setMembers(fetchedMembers || []);
    setIsLoading(false);
    setAnimKey(k => k + 1);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Re-trigger stagger animation on tab/filter change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setAnimKey(k => k + 1);
  };

  // Filtered Albums
  const filteredAlbums = useMemo(() => {
    let list = [...albums];
    if (activeTab === 'photos') {
      list = list.filter(a => a.media_type_summary === 'photo' || a.media_type_summary === 'mixed');
    } else if (activeTab === 'videos') {
      list = list.filter(a => a.media_type_summary === 'video' || a.media_type_summary === 'mixed');
    }

    if (selectedBranch !== 'all') {
      list = list.filter(a => (a.branch || '').toLowerCase().includes(selectedBranch.toLowerCase()));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        a =>
          (a.title || '').toLowerCase().includes(q) ||
          (a.branch || '').toLowerCase().includes(q) ||
          (a.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [albums, activeTab, selectedBranch, searchQuery]);

  // Filtered Members
  const filteredMembers = useMemo(() => {
    let list = [...members];
    if (selectedBranch !== 'all') {
      list = list.filter(m => (m.branch || '').toLowerCase().includes(selectedBranch.toLowerCase()));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        m =>
          (m.name || '').toLowerCase().includes(q) ||
          (m.role || '').toLowerCase().includes(q) ||
          (m.branch || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [members, selectedBranch, searchQuery]);

  // Featured Album for Hero Spotlight
  const featuredAlbum = useMemo(() => {
    const pool = activeTab === 'all' ? albums : filteredAlbums;
    return pool.find(a => a.is_featured) || pool[0] || null;
  }, [albums, filteredAlbums, activeTab]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxAlbum(null);
        setLightboxMember(null);
        if (!isUploading) setIsUploadModalOpen(false);
        setIsMemberModalOpen(false);
      }
      if (lightboxAlbum && lightboxAlbum.items?.length > 1) {
        if (e.key === 'ArrowRight') {
          setLightboxIndex(i => (i + 1) % lightboxAlbum.items.length);
        } else if (e.key === 'ArrowLeft') {
          setLightboxIndex(i => (i - 1 + lightboxAlbum.items.length) % lightboxAlbum.items.length);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxAlbum, isUploading]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  // ==========================================
  // UPLOAD MODAL HANDLERS (Single + Album)
  // ==========================================
  const openCreateModal = () => {
    setEditingAlbum(null);
    setUploadMode('album');
    setFormTitle('');
    setFormBranch('Aburi');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormCategory('welfare_evidence');
    setFormDescription('');
    setFormFeatured(false);
    setSingleSourceType('file');
    setSingleVideoUrl('');
    setSelectedFiles([]);
    setFormError('');
    setIsUploadModalOpen(true);
  };

  const openEditAlbumModal = (album, e) => {
    e.stopPropagation();
    setEditingAlbum(album);
    setFormTitle(album.title || '');
    setFormBranch(album.branch || 'Aburi');
    setFormDate(album.date || new Date().toISOString().split('T')[0]);
    setFormCategory(album.category || 'welfare_evidence');
    setFormDescription(album.description || '');
    setFormFeatured(!!album.is_featured);
    setSelectedFiles([]);
    setFormError('');
    setIsUploadModalOpen(true);
  };

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const mapped = files.map((file, idx) => {
      const isVideo =
        file.type.startsWith('video/') ||
        ['.mp4', '.mov', '.webm', '.mkv', '.avi'].some(ext => file.name.toLowerCase().endsWith(ext));
      return {
        id: `f_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        type: isVideo ? 'video' : 'photo',
        status: 'pending',
        loaded: 0,
        total: file.size || 1,
        error: ''
      };
    });

    if (uploadMode === 'single') {
      setSelectedFiles([mapped[0]]);
    } else {
      setSelectedFiles(prev => [...prev, ...mapped]);
    }
    setFormError('');
  };

  const removeSelectedFile = (id) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveSelectedFile = (index, direction) => {
    setSelectedFiles(prev => {
      const copy = [...prev];
      const target = index + direction;
      if (target < 0 || target >= copy.length) return copy;
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  // Parallel upload with concurrency cap of 4
  const runParallelUploads = async (albumId, filesToUpload) => {
    const concurrency = 4;
    let cursor = 0;

    const worker = async () => {
      while (cursor < filesToUpload.length) {
        const idx = cursor++;
        const item = filesToUpload[idx];
        const orderIndex = selectedFiles.findIndex(f => f.id === item.id);

        setSelectedFiles(prev =>
          prev.map(f => (f.id === item.id ? { ...f, status: 'uploading', error: '' } : f))
        );

        try {
          await uploadMediaToAlbum(albumId, item.file, orderIndex >= 0 ? orderIndex : idx, (loaded, total) => {
            setSelectedFiles(prev =>
              prev.map(f => (f.id === item.id ? { ...f, loaded, total } : f))
            );
          });
          setSelectedFiles(prev =>
            prev.map(f => (f.id === item.id ? { ...f, status: 'done', loaded: f.total } : f))
          );
        } catch (err) {
          setSelectedFiles(prev =>
            prev.map(f =>
              f.id === item.id ? { ...f, status: 'error', error: err.message || 'Upload failed' } : f
            )
          );
        }
      }
    };

    const workers = Array.from({ length: Math.min(concurrency, filesToUpload.length) }, () => worker());
    await Promise.all(workers);
  };

  const handleSubmitAlbum = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Please enter a Title / Occasion Name.');
      return;
    }

    // Editing existing album metadata
    if (editingAlbum) {
      try {
        setIsUploading(true);
        await updateAlbumOnServer(editingAlbum.id, {
          title: formTitle,
          branch: formBranch,
          date: formDate,
          category: formCategory,
          description: formDescription,
          is_featured: formFeatured
        });
        await loadData();
        setIsUploadModalOpen(false);
        showToast('✅ Album updated successfully!');
      } catch (err) {
        setFormError(err.message || 'Failed to update album.');
      } finally {
        setIsUploading(false);
      }
      return;
    }

    // Single YouTube / External Video Link
    if (uploadMode === 'single' && singleSourceType === 'url') {
      if (!singleVideoUrl.trim()) {
        setFormError('Please paste a YouTube, Vimeo, or video URL.');
        return;
      }
      try {
        setIsUploading(true);
        const embed = parseVideoEmbedUrl(singleVideoUrl);
        const ytMatch = singleVideoUrl.match(
          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
        );
        const thumb = ytMatch?.[1]
          ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`
          : 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80';

        await createAlbumOnServer({
          title: formTitle,
          branch: formBranch,
          date: formDate,
          category: formCategory,
          description: formDescription,
          is_featured: formFeatured,
          created_by: currentUser?.full_name || 'Executive Board',
          items: [
            {
              type: 'video',
              url: singleVideoUrl.trim(),
              embed_url: embed,
              thumbnail_url: thumb,
              order_in_album: 0
            }
          ]
        });
        await loadData();
        setIsUploadModalOpen(false);
        showToast('✅ Video published to Gallery!');
      } catch (err) {
        setFormError(err.message || 'Failed publishing video.');
      } finally {
        setIsUploading(false);
      }
      return;
    }

    // File Upload (Single or Album)
    if (selectedFiles.length === 0) {
      setFormError('Please select at least one photo or video file.');
      return;
    }

    setIsUploading(true);
    setFormError('');

    try {
      const created = await createAlbumOnServer({
        title: formTitle,
        branch: formBranch,
        date: formDate,
        category: formCategory,
        description: formDescription,
        is_featured: formFeatured,
        created_by: currentUser?.full_name || 'Executive Board',
        items: []
      });

      const albumId = created.album.id;
      await runParallelUploads(albumId, selectedFiles);

      await loadData();
      setIsUploadModalOpen(false);
      showToast(`✅ Published "${formTitle}" (${selectedFiles.length} item${selectedFiles.length > 1 ? 's' : ''})!`);
    } catch (err) {
      setFormError(err.message || 'Error uploading album.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAlbum = async (album, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${album.title}" and all ${album.media_count} item(s) inside it?`)) return;
    try {
      await deleteAlbumOnServer(album.id);
      await loadData();
      if (lightboxAlbum?.id === album.id) setLightboxAlbum(null);
      showToast('🗑️ Album deleted.');
    } catch (err) {
      showToast('❌ Failed to delete album.');
    }
  };

  // Aggregate byte progress
  const totalBytes = selectedFiles.reduce((acc, f) => acc + (f.total || 0), 0);
  const loadedBytes = selectedFiles.reduce((acc, f) => acc + (f.loaded || 0), 0);
  const aggregatePercent = totalBytes > 0 ? Math.min(100, Math.round((loadedBytes / totalBytes) * 100)) : 0;

  // ==========================================
  // MEMBER DIRECTORY HANDLERS
  // ==========================================
  const openAddMember = () => {
    setEditingMember(null);
    setMemName('');
    setMemBranch('Aburi');
    setMemRole('Member');
    setMemBio('');
    setMemPhotoUrl('');
    setIsMemberModalOpen(true);
  };

  const openEditMember = (m, e) => {
    e.stopPropagation();
    setEditingMember(m);
    setMemName(m.name || '');
    setMemBranch(m.branch || 'Aburi');
    setMemRole(m.role || 'Member');
    setMemBio(m.bio || '');
    setMemPhotoUrl(m.photo_url || '');
    setIsMemberModalOpen(true);
  };

  const handleMemberPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMemPhoto(true);
    try {
      const res = await uploadMediaFile(file);
      if (res?.success && res.url) setMemPhotoUrl(res.url);
    } catch (err) {
      alert('Failed uploading member photo.');
    } finally {
      setIsUploadingMemPhoto(false);
    }
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (!memName.trim()) return;
    await saveMemberDirectoryRecord(
      { name: memName, branch: memBranch, role: memRole, bio: memBio, photo_url: memPhotoUrl },
      editingMember?.id || null
    );
    await loadData();
    setIsMemberModalOpen(false);
    showToast(editingMember ? '✅ Member updated!' : '✅ Member added to directory!');
  };

  const handleDeleteMember = async (m, e) => {
    e.stopPropagation();
    if (!window.confirm(`Remove ${m.name} from Know Your Members?`)) return;
    await deleteMemberDirectoryRecord(m.id);
    await loadData();
    showToast('🗑️ Member removed.');
  };

  const getCoverUrl = (album) => {
    if (!album?.items?.length) return 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80';
    const cover = album.items.find(i => i.id === album.cover_media_id) || album.items[0];
    return cover.thumbnail_url || cover.url;
  };

  const getCountBadge = (album) => {
    if (!album || album.media_count <= 1) return null;
    if (album.media_type_summary === 'mixed') return `📸🎥 ${album.media_count} Items`;
    if (album.media_type_summary === 'video') return `🎥 ${album.media_count} Videos`;
    return `📸 ${album.media_count} Photos`;
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <style>{`
        @keyframes galleryFadeUp {
          from { opacity: 0; transform: translateY(28px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes heroKenBurns {
          0% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.08) translateY(-1.5%); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes shimmerPulse {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .gallery-card-reveal {
          animation: galleryFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .hero-zoom-img {
          animation: heroKenBurns 11s ease-in-out infinite;
        }
        .gallery-card {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
        }
        .gallery-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 38px rgba(0,0,0,0.22) !important;
        }
        .gallery-card-media {
          transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
          object-position: center 20%;
        }
        .gallery-card:hover .gallery-card-media {
          transform: scale(1.07);
        }
        .gallery-card-pill {
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .gallery-card:hover .gallery-card-pill {
          opacity: 1;
          transform: translateY(0);
        }
        .skeleton-box {
          background: linear-gradient(90deg, rgba(148,163,184,0.12) 25%, rgba(148,163,184,0.24) 50%, rgba(148,163,184,0.12) 75%);
          background-size: 200% 100%;
          animation: shimmerPulse 1.5s infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .gallery-card-reveal, .hero-zoom-img {
            animation: none !important;
          }
          .gallery-card-media, .gallery-card-pill {
            transition: none !important;
          }
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999999,
            background: '#059669',
            color: '#fff',
            padding: '0.75rem 1.25rem',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.88rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}
        >
          {toast}
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. EDITORIAL HEADER & 4-TAB PRIMARY NAVIGATION           */}
      {/* ========================================================= */}
      <div
        style={{
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1.75rem 1.25rem 1.25rem'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                <Sparkles size={14} /> Onuado Na Eye Men's Fellowship
              </div>
              <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 900, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Fellowship Media Showcase
              </h1>
            </div>

            {isAdmin && (
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {activeTab === 'members' ? (
                  <button
                    onClick={openAddMember}
                    className="btn btn-primary"
                    style={{
                      padding: '0.6rem 1.2rem',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      borderColor: '#2563eb',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem'
                    }}
                  >
                    <Plus size={16} /> Add Member
                  </button>
                ) : (
                  <button
                    onClick={openCreateModal}
                    className="btn btn-primary"
                    style={{
                      padding: '0.6rem 1.25rem',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #059669, #065f46)',
                      borderColor: '#059669',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)'
                    }}
                  >
                    <Plus size={16} /> Upload Photo / Video
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 4-Tab Primary Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: '1.35rem',
              overflowX: 'auto',
              paddingBottom: '0.25rem',
              scrollbarWidth: 'none'
            }}
          >
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.6rem 1.15rem',
                    borderRadius: '999px',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    border: isActive ? '1.5px solid #059669' : '1px solid var(--border-color)',
                    background: isActive ? '#059669' : 'var(--bg-main)',
                    color: isActive ? '#fff' : 'var(--text-main)',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(5, 150, 105, 0.28)' : 'none'
                  }}
                >
                  <Icon size={15} /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Secondary Compact Row: Branch Filter + Search */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              marginTop: '1rem',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '420px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder={activeTab === 'members' ? 'Search member name, role, or branch...' : 'Search occasion, title, or branch...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ width: '100%', paddingLeft: '2.3rem', fontSize: '0.84rem', borderRadius: '10px' }}
              />
            </div>

            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '180px', fontSize: '0.84rem', fontWeight: 700, borderRadius: '10px' }}
            >
              <option value="all">📍 All 16 Branches</option>
              {OFFICIAL_BRANCHES.map(b => (
                <option key={b} value={b}>{b} Branch</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT CONTAINER                                 */}
      {/* ========================================================= */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.75rem 1.25rem 0' }}>
        {activeTab !== 'members' ? (
          <>
            {/* FEATURED SPOTLIGHT HERO */}
            {!isLoading && featuredAlbum && !searchQuery.trim() && selectedBranch === 'all' && (
              <div
                onClick={() => {
                  setLightboxAlbum(featuredAlbum);
                  setLightboxIndex(0);
                }}
                style={{
                  position: 'relative',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  height: 'clamp(280px, 42vw, 420px)',
                  marginBottom: '2rem',
                  cursor: 'pointer',
                  boxShadow: '0 20px 45px rgba(0,0,0,0.22)'
                }}
              >
                <img
                  src={getCoverUrl(featuredAlbum)}
                  alt=""
                  aria-hidden="true"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(24px) brightness(0.55)', transform: 'scale(1.15)' }}
                />
                <img
                  src={getCoverUrl(featuredAlbum)}
                  alt={featuredAlbum.title}
                  className="hero-zoom-img"
                  style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center 20%' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.45) 55%, rgba(15, 23, 42, 0.15) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: 'clamp(1.25rem, 3vw, 2.5rem)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                    <span style={{ background: '#059669', color: '#fff', fontSize: '0.72rem', fontWeight: 900, padding: '0.25rem 0.7rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Star size={12} fill="#fff" /> FEATURED HIGHLIGHT
                    </span>
                    {getCountBadge(featuredAlbum) && (
                      <span style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.7rem', borderRadius: '999px' }}>
                        {getCountBadge(featuredAlbum)}
                      </span>
                    )}
                  </div>
                  <h2 style={{ color: '#fff', fontSize: 'clamp(1.35rem, 3vw, 2.1rem)', fontWeight: 900, margin: '0 0 0.4rem', maxWidth: '780px', lineHeight: 1.2 }}>
                    {featuredAlbum.title}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.9rem', margin: '0 0 1rem', maxWidth: '640px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {featuredAlbum.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        background: '#fff',
                        color: '#0f172a',
                        padding: '0.55rem 1.2rem',
                        borderRadius: '999px',
                        fontSize: '0.84rem',
                        fontWeight: 900,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      {featuredAlbum.media_type_summary === 'video' ? <Play size={15} fill="#0f172a" /> : <ImageIcon size={15} />}
                      {featuredAlbum.media_count > 1 ? 'View Album' : featuredAlbum.media_type_summary === 'video' ? 'Watch Video' : 'View Photo'}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 700 }}>
                      📍 {featuredAlbum.branch} • {featuredAlbum.date}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SHIMMER SKELETONS */}
            {isLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="skeleton-box" style={{ height: '300px', borderRadius: '18px' }} />
                ))}
              </div>
            ) : filteredAlbums.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <ImageIcon size={42} style={{ color: 'var(--text-muted)', opacity: 0.5, margin: '0 auto 0.75rem' }} />
                <h3 style={{ margin: '0 0 0.35rem', fontWeight: 800 }}>No media found</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Try clearing your search or switching branches.
                </p>
              </div>
            ) : (
              /* EDITORIAL BENTO / GRID */
              <div
                key={animKey}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: '1.25rem'
                }}
              >
                {filteredAlbums.map((album, idx) => {
                  const badge = getCountBadge(album);
                  const isVideo = album.media_type_summary === 'video';
                  return (
                    <div
                      key={album.id}
                      onClick={() => {
                        setLightboxAlbum(album);
                        setLightboxIndex(0);
                      }}
                      className="gallery-card gallery-card-reveal"
                      style={{
                        position: 'relative',
                        borderRadius: '18px',
                        overflow: 'hidden',
                        aspectRatio: '4 / 3',
                        cursor: 'pointer',
                        background: '#0f172a',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                        animationDelay: `${Math.min(idx * 50, 400)}ms`
                      }}
                    >
                      <img
                        src={getCoverUrl(album)}
                        alt={album.title}
                        loading="lazy"
                        className="gallery-card-media"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />

                      {/* Top Badges & Admin Controls */}
                      <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pointerEvents: 'none' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {badge && (
                            <span style={{ background: 'rgba(15, 23, 42, 0.82)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '0.28rem 0.65rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.18)' }}>
                              {badge}
                            </span>
                          )}
                          {isVideo && !badge && (
                            <span style={{ background: '#dc2626', color: '#fff', fontSize: '0.7rem', fontWeight: 900, padding: '0.25rem 0.6rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Play size={10} fill="#fff" /> VIDEO
                            </span>
                          )}
                        </div>

                        {isAdmin && (
                          <div style={{ display: 'flex', gap: '0.35rem', pointerEvents: 'auto' }}>
                            <button
                              onClick={(e) => openEditAlbumModal(album, e)}
                              title="Edit Album"
                              style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'none', background: 'rgba(15,23,42,0.75)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteAlbum(album, e)}
                              title="Delete Album"
                              style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'none', background: 'rgba(220,38,38,0.85)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Center Hover Pill */}
                      <div
                        className="gallery-card-pill"
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          background: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(8px)',
                          color: '#0f172a',
                          padding: '0.45rem 1rem',
                          borderRadius: '999px',
                          fontSize: '0.78rem',
                          fontWeight: 900,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          pointerEvents: 'none'
                        }}
                      >
                        {isVideo ? <Play size={14} fill="#0f172a" /> : <ImageIcon size={14} />}
                        {album.media_count > 1 ? 'Open Album' : isVideo ? 'Watch' : 'View'}
                      </div>

                      {/* Bottom Gradient Overlay */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 'auto 0 0 0',
                          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.55) 65%, transparent 100%)',
                          padding: '2rem 1rem 0.9rem'
                        }}
                      >
                        <h3 style={{ color: '#fff', fontSize: '0.98rem', fontWeight: 800, margin: '0 0 0.3rem', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {album.title}
                        </h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'rgba(255,255,255,0.78)', fontWeight: 600 }}>
                          <span>📍 {album.branch}</span>
                          <span>{album.date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* ========================================================= */
          /* 3. KNOW YOUR MEMBERS DIRECTORY TAB                        */
          /* ========================================================= */
          <div key={animKey}>
            {filteredMembers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <Users size={42} style={{ color: 'var(--text-muted)', opacity: 0.5, margin: '0 auto 0.75rem' }} />
                <h3 style={{ margin: '0 0 0.35rem', fontWeight: 800 }}>No members listed yet</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  {isAdmin ? 'Click "Add Member" above to showcase fellowship members.' : 'Check back soon for fellowship member profiles.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.25rem' }}>
                {filteredMembers.map((m, idx) => (
                  <div
                    key={m.id}
                    onClick={() => setLightboxMember(m)}
                    className="gallery-card gallery-card-reveal"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      animationDelay: `${Math.min(idx * 45, 350)}ms`,
                      position: 'relative'
                    }}
                  >
                    <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', background: 'var(--bg-main)', position: 'relative' }}>
                      {m.photo_url ? (
                        <img src={m.photo_url} alt={m.name} className="gallery-card-media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                          <User size={48} />
                        </div>
                      )}
                      {isAdmin && (
                        <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '0.3rem' }}>
                          <button onClick={(e) => openEditMember(m, e)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'rgba(15,23,42,0.75)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Edit3 size={12} />
                          </button>
                          <button onClick={(e) => handleDeleteMember(m, e)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'rgba(220,38,38,0.85)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ margin: '0 0 0.2rem', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>{m.name}</h3>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', marginBottom: '0.35rem' }}>{m.role}</div>
                      <span style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '999px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                        📍 {m.branch}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 4. ALBUM-SCOPED LIGHTBOX VIEWER                           */}
      {/* ========================================================= */}
      {lightboxAlbum && lightboxAlbum.items?.length > 0 && (() => {
        const items = lightboxAlbum.items;
        const current = items[lightboxIndex] || items[0];
        return (
          <div
            onClick={() => setLightboxAlbum(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(10, 15, 28, 0.92)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1rem'
            }}
          >
            {/* Top Bar */}
            <div onClick={e => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 900 }}>{lightboxAlbum.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.72)' }}>
                  📍 {lightboxAlbum.branch} • {lightboxAlbum.date} {items.length > 1 ? `• ${lightboxIndex + 1} of ${items.length}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {current.type === 'photo' && (
                  <a href={current.url} download target="_blank" rel="noopener noreferrer" style={{ color: '#fff', background: 'rgba(255,255,255,0.15)', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Download size={14} /> Download
                  </a>
                )}
                <button onClick={() => setLightboxAlbum(null)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.18)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Center Media + Arrows */}
            <div onClick={e => e.stopPropagation()} style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: '1100px', width: '100%', margin: '0.75rem auto', minHeight: 0 }}>
              {items.length > 1 && (
                <button
                  onClick={() => setLightboxIndex(i => (i - 1 + items.length) % items.length)}
                  style={{ position: 'absolute', left: '8px', zIndex: 10, width: '42px', height: '42px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.6)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {current.type === 'video' ? (
                current.embed_url ? (
                  <iframe
                    src={`${current.embed_url}?autoplay=1`}
                    title={lightboxAlbum.title}
                    style={{ width: '100%', maxWidth: '900px', aspectRatio: '16 / 9', border: 'none', borderRadius: '12px' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video controls autoPlay playsInline src={current.url} style={{ maxHeight: '68vh', maxWidth: '100%', borderRadius: '12px' }} />
                )
              ) : (
                <img src={current.url} alt={lightboxAlbum.title} style={{ maxHeight: '68vh', maxWidth: '100%', objectFit: 'contain', borderRadius: '12px' }} />
              )}

              {items.length > 1 && (
                <button
                  onClick={() => setLightboxIndex(i => (i + 1) % items.length)}
                  style={{ position: 'absolute', right: '8px', zIndex: 10, width: '42px', height: '42px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.6)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* Bottom Thumbnail Strip (Album-Scoped) */}
            {items.length > 1 && (
              <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', overflowX: 'auto', padding: '0.25rem 0', maxWidth: '100%' }}>
                {items.map((it, idx) => (
                  <button
                    key={it.id}
                    onClick={() => setLightboxIndex(idx)}
                    style={{
                      position: 'relative',
                      width: '60px',
                      height: '46px',
                      flexShrink: 0,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: idx === lightboxIndex ? '2.5px solid #10b981' : '2px solid transparent',
                      opacity: idx === lightboxIndex ? 1 : 0.55,
                      cursor: 'pointer',
                      padding: 0,
                      background: '#000'
                    }}
                  >
                    <img src={it.thumbnail_url || it.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {it.type === 'video' && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)' }}>
                        <Play size={14} fill="#fff" color="#fff" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* 5. MEMBER PROFILE LIGHTBOX                                */}
      {/* ========================================================= */}
      {lightboxMember && (
        <div
          onClick={() => setLightboxMember(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(10,15,28,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', borderRadius: '20px', maxWidth: '440px', width: '100%', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}>
            <div style={{ position: 'relative', height: '280px', background: 'var(--bg-main)' }}>
              {lightboxMember.photo_url ? (
                <img src={lightboxMember.photo_url} alt={lightboxMember.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={64} /></div>
              )}
              <button onClick={() => setLightboxMember(null)} style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.6)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.3rem', fontWeight: 900 }}>{lightboxMember.name}</h2>
              <div style={{ color: '#059669', fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.5rem' }}>{lightboxMember.role} • {lightboxMember.branch} Branch</div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {lightboxMember.bio || 'Dedicated member of the Onuado Na Eye Men\'s Fellowship.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. ADMIN SINGLE + ALBUM UPLOAD MODAL                      */}
      {/* ========================================================= */}
      {isUploadModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '640px', maxHeight: '92vh', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '1.15rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>
                {editingAlbum ? '✏️ Edit Album' : '➕ Upload to Fellowship Gallery'}
              </h3>
              <button onClick={() => !isUploading && setIsUploadModalOpen(false)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div style={{ padding: '0.7rem 1.5rem', background: 'rgba(220,38,38,0.1)', color: '#dc2626', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <AlertCircle size={16} /> {formError}
              </div>
            )}

            <form onSubmit={handleSubmitAlbum} style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              {!editingAlbum && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => { setUploadMode('album'); setSelectedFiles([]); }}
                    style={{
                      padding: '0.6rem',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      border: uploadMode === 'album' ? '2px solid #059669' : '1px solid var(--border-color)',
                      background: uploadMode === 'album' ? 'rgba(5, 150, 105, 0.12)' : 'var(--bg-main)',
                      color: uploadMode === 'album' ? '#059669' : 'var(--text-main)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                    }}
                  >
                    <Layers size={16} /> Album (Multiple Files)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setUploadMode('single'); setSelectedFiles([]); }}
                    style={{
                      padding: '0.6rem',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      border: uploadMode === 'single' ? '2px solid #059669' : '1px solid var(--border-color)',
                      background: uploadMode === 'single' ? 'rgba(5, 150, 105, 0.12)' : 'var(--bg-main)',
                      color: uploadMode === 'single' ? '#059669' : 'var(--text-main)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
                    }}
                  >
                    <ImageIcon size={16} /> Single Photo / Video
                  </button>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Title / Occasion Name *</label>
                <input type="text" required placeholder="e.g. Annual Men's Conference 2026" value={formTitle} onChange={e => setFormTitle(e.target.value)} className="form-input" style={{ width: '100%', fontWeight: 700 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Branch</label>
                  <select value={formBranch} onChange={e => setFormBranch(e.target.value)} className="form-select" style={{ width: '100%', fontWeight: 700 }}>
                    {OFFICIAL_BRANCHES.map(b => <option key={b} value={b}>{b} Branch</option>)}
                    <option value="All 16 Branches">All 16 Branches (National)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Event Date</label>
                  <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} className="form-input" style={{ width: '100%', fontWeight: 700 }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Category</label>
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="form-select" style={{ width: '100%', fontWeight: 700 }}>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', marginTop: '1.1rem' }}>
                  <input type="checkbox" checked={formFeatured} onChange={e => setFormFeatured(e.target.checked)} /> Featured Hero
                </label>
              </div>

              {!editingAlbum && (
                <div>
                  {uploadMode === 'single' && (
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <button type="button" onClick={() => setSingleSourceType('file')} style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: singleSourceType === 'file' ? '#059669' : 'transparent', color: singleSourceType === 'file' ? '#fff' : 'var(--text-main)', cursor: 'pointer' }}>
                        Upload File
                      </button>
                      <button type="button" onClick={() => setSingleSourceType('url')} style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: singleSourceType === 'url' ? '#059669' : 'transparent', color: singleSourceType === 'url' ? '#fff' : 'var(--text-main)', cursor: 'pointer' }}>
                        YouTube / Video Link
                      </button>
                    </div>
                  )}

                  {uploadMode === 'single' && singleSourceType === 'url' ? (
                    <input type="url" placeholder="https://www.youtube.com/watch?v=..." value={singleVideoUrl} onChange={e => setSingleVideoUrl(e.target.value)} className="form-input" style={{ width: '100%' }} />
                  ) : (
                    <>
                      <div
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        style={{ border: '2px dashed var(--border-color)', padding: '1.15rem', borderRadius: '12px', textAlign: 'center', cursor: isUploading ? 'wait' : 'pointer', background: 'var(--bg-main)' }}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple={uploadMode === 'album'}
                          accept="image/*,video/*"
                          onChange={handleFilesSelected}
                          style={{ display: 'none' }}
                          disabled={isUploading}
                        />
                        <UploadCloud size={26} style={{ margin: '0 auto 0.35rem', color: '#059669' }} />
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                          {uploadMode === 'album' ? 'Click to select multiple Photos & Videos' : 'Click to select a Photo or Video'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Direct upload to media.onuadonaeyemens.org</div>
                      </div>

                      {/* Selected Files Strip with Reorder & Remove */}
                      {selectedFiles.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', padding: '0.6rem 0' }}>
                          {selectedFiles.map((f, idx) => (
                            <div key={f.id} style={{ position: 'relative', width: '88px', flexShrink: 0, borderRadius: '10px', border: '1px solid var(--border-color)', overflow: 'hidden', background: 'var(--bg-main)' }}>
                              {f.type === 'video' ? (
                                <video src={f.previewUrl} style={{ width: '100%', height: '64px', objectFit: 'cover' }} />
                              ) : (
                                <img src={f.previewUrl} alt="" style={{ width: '100%', height: '64px', objectFit: 'cover' }} />
                              )}
                              {!isUploading && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem', background: 'var(--bg-card)' }}>
                                  <button type="button" onClick={() => moveSelectedFile(idx, -1)} disabled={idx === 0} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px', opacity: idx === 0 ? 0.3 : 1 }}><ArrowLeft size={12} /></button>
                                  <button type="button" onClick={() => removeSelectedFile(f.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px', color: '#dc2626' }}><Trash2 size={12} /></button>
                                  <button type="button" onClick={() => moveSelectedFile(idx, 1)} disabled={idx === selectedFiles.length - 1} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px', opacity: idx === selectedFiles.length - 1 ? 0.3 : 1 }}><ArrowRight size={12} /></button>
                                </div>
                              )}
                              {f.status === 'done' && <div style={{ position: 'absolute', top: 4, right: 4, background: '#059669', color: '#fff', borderRadius: '50%', padding: '2px' }}><Check size={10} /></div>}
                              {f.status === 'error' && <div style={{ position: 'absolute', top: 4, right: 4, background: '#dc2626', color: '#fff', borderRadius: '50%', padding: '2px' }}><AlertCircle size={10} /></div>}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Aggregate Byte Progress Bar */}
                      {isUploading && (
                        <div style={{ marginTop: '0.35rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 800, color: '#059669', marginBottom: '0.2rem' }}>
                            <span>Uploading to Cloud Media Server...</span>
                            <span>{aggregatePercent}%</span>
                          </div>
                          <div style={{ height: '7px', background: 'rgba(5,150,105,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${aggregatePercent}%`, height: '100%', background: '#059669', transition: 'width 0.2s ease' }} />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Description</label>
                <textarea rows="2" placeholder="Occasion details, elders present..." value={formDescription} onChange={e => setFormDescription(e.target.value)} className="form-input" style={{ width: '100%' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button type="button" disabled={isUploading} onClick={() => setIsUploadModalOpen(false)} className="btn btn-secondary" style={{ padding: '0.55rem 1rem' }}>Cancel</button>
                <button type="submit" disabled={isUploading} className="btn btn-primary" style={{ padding: '0.55rem 1.35rem', background: '#059669', borderColor: '#059669', fontWeight: 800 }}>
                  {isUploading ? 'Uploading...' : editingAlbum ? 'Save Changes' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. ADMIN MEMBER MODAL (Know Your Members)                 */}
      {/* ========================================================= */}
      {isMemberModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '480px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '1.1rem 1.4rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontWeight: 900 }}>{editingMember ? '✏️ Edit Member' : '➕ Add Fellowship Member'}</h3>
              <button onClick={() => setIsMemberModalOpen(false)} style={{ width: '30px', height: '30px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.08)', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleSaveMember} style={{ padding: '1.25rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <input type="text" required placeholder="Full Name *" value={memName} onChange={e => setMemName(e.target.value)} className="form-input" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <select value={memBranch} onChange={e => setMemBranch(e.target.value)} className="form-select">
                  {OFFICIAL_BRANCHES.map(b => <option key={b} value={b}>{b} Branch</option>)}
                </select>
                <input type="text" placeholder="Role (e.g. Chairman)" value={memRole} onChange={e => setMemRole(e.target.value)} className="form-input" />
              </div>
              <div>
                <input ref={memPhotoInputRef} type="file" accept="image/*" onChange={handleMemberPhotoUpload} style={{ display: 'none' }} />
                <button type="button" onClick={() => memPhotoInputRef.current?.click()} className="btn btn-secondary" style={{ width: '100%' }}>
                  {isUploadingMemPhoto ? 'Uploading Photo...' : memPhotoUrl ? '✓ Photo Uploaded (Click to Change)' : '📸 Upload Member Photo'}
                </button>
              </div>
              <textarea rows="2" placeholder="Short bio or testimony..." value={memBio} onChange={e => setMemBio(e.target.value)} className="form-input" />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setIsMemberModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: '#2563eb', borderColor: '#2563eb' }}>Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
