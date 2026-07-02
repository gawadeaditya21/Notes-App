import { useState, useEffect, useContext, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Clock, Plus, Star, Edit2, Trash2, Search, X } from 'lucide-react';
import Sidebar from './Sidebar';
import NoteDrawer from './NoteDrawer';

/**
 * Home — Studio Workspace with Favorites + Tags support
 *
 * State:
 *   notes[]          — all notes from API
 *   formData         — { title, content, isFavorite, tags }
 *   editingNoteId    — null | string
 *   drawerOpen       — boolean
 *   filter           — 'all' | 'favorites'
 *   selectedTag      — string | null
 *
 * Derived:
 *   allTags          — sorted unique tag array across all notes
 *   filteredNotes    — notes filtered by filter + selectedTag
 */
const Home = () => {
    const [notes, setNotes]               = useState([]);
    const [formData, setFormData]         = useState({ title: '', content: '', isFavorite: false, tags: [] });
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [drawerOpen, setDrawerOpen]     = useState(false);
    const [filter, setFilter]             = useState('all');       // 'all' | 'favorites'
    const [selectedTag, setSelectedTag]   = useState(null);        // string | null
    const [searchQuery, setSearchQuery]   = useState('');          // free-text search

    const searchRef = useRef(null);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    /* ── Fetch notes on mount ── */
    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        const fetchNotes = async () => {
            try {
                const res = await API.get('/notes');
                setNotes(res.data);
            } catch {
                toast.error('Failed to load notes');
            }
        };
        fetchNotes();
    }, [user, navigate]);

    /* ── Derived: all unique tags ── */
    const allTags = useMemo(() => {
        const set = new Set();
        notes.forEach((n) => (n.tags ?? []).forEach((t) => set.add(t)));
        return [...set].sort();
    }, [notes]);

    /* ── Derived: filtered + searched notes ── */
    const filteredNotes = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return notes
            .filter((n) => (filter === 'favorites' ? n.isFavorite : true))
            .filter((n) => (selectedTag ? (n.tags ?? []).includes(selectedTag) : true))
            .filter((n) => {
                if (!q) return true;
                const inTitle   = n.title.toLowerCase().includes(q);
                const inContent = n.content.replace(/<[^>]*>/g, '').toLowerCase().includes(q);
                const inTags    = (n.tags ?? []).some((t) => t.toLowerCase().includes(q));
                return inTitle || inContent || inTags;
            });
    }, [notes, filter, selectedTag, searchQuery]);

    const favoriteCount = useMemo(() => notes.filter((n) => n.isFavorite).length, [notes]);

    /* ── Drawer helpers ── */
    const openNewNote = () => {
        setFormData({ title: '', content: '', isFavorite: false, tags: [] });
        setEditingNoteId(null);
        setDrawerOpen(true);
    };

    const openEditNote = (note) => {
        setFormData({
            title:      note.title,
            content:    note.content,
            isFavorite: note.isFavorite ?? false,
            tags:       note.tags ?? [],
        });
        setEditingNoteId(note._id);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setTimeout(() => {
            setFormData({ title: '', content: '', isFavorite: false, tags: [] });
            setEditingNoteId(null);
        }, 350);
    };

    /* ── Save / Update ── */
    const handleSave = async () => {
        const stripped = formData.content.replace(/<[^>]*>/g, '').trim();
        if (!formData.title.trim() || !stripped) {
            toast.error('Please fill in both a title and some content.');
            return;
        }
        try {
            if (editingNoteId) {
                const res = await API.put(`/notes/${editingNoteId}`, formData);
                setNotes((prev) => prev.map((n) => (n._id === editingNoteId ? res.data : n)));
                toast.success('Note updated!');
            } else {
                const res = await API.post('/notes', formData);
                setNotes((prev) => [res.data, ...prev]);
                toast.success('Note saved!');
            }
            closeDrawer();
        } catch {
            toast.error('Failed to save note. Please try again.');
        }
    };

    /* ── Quick-toggle favorite (no drawer open) ── */
    const handleToggleFavorite = async (e, note) => {
        e.stopPropagation(); // don't bubble to card
        try {
            const res = await API.put(`/notes/${note._id}`, { isFavorite: !note.isFavorite });
            setNotes((prev) => prev.map((n) => (n._id === note._id ? res.data : n)));
        } catch {
            toast.error('Failed to update favorite');
        }
    };

    /* ── Delete ── */
    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await API.delete(`/notes/${id}`);
            setNotes((prev) => prev.filter((n) => n._id !== id));
            toast.success('Note deleted');
        } catch {
            toast.error('Failed to delete note');
        }
    };

    /* ── Helpers ── */
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const clearFilter = () => {
        setFilter('all');
        setSelectedTag(null);
    };

    /* ── Global keyboard shortcut: Ctrl+K / Cmd+K → focus search ── */
    useEffect(() => {
        const onKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
                searchRef.current?.select();
            }
            if (e.key === 'Escape' && document.activeElement === searchRef.current) {
                setSearchQuery('');
                searchRef.current?.blur();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const isFiltering   = filter === 'favorites' || !!selectedTag;
    const isSearching   = searchQuery.trim().length > 0;
    const hasActiveView = isFiltering || isSearching;

    // Dynamic canvas title
    const canvasTitle =
        isSearching            ? 'Search Results'
        : filter === 'favorites' ? 'Favorites'
        : selectedTag            ? `#${selectedTag}`
        :                          'My Notes';

    if (!user) return null;

    return (
        <div className={`workspace-shell${drawerOpen ? ' drawer-open' : ''}`}>

            {/* ── Left Sidebar ── */}
            <Sidebar
                filter={filter}
                setFilter={setFilter}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
                allTags={allTags}
                noteCount={notes.length}
                favoriteCount={favoriteCount}
            />

            {/* ── Main Canvas ── */}
            <main className="main-canvas">

                {/* Canvas header */}
                <div className="canvas-header">
                    <div>
                        <h1 className="canvas-title">{canvasTitle}</h1>
                        <p className="canvas-subtitle">
                            {filteredNotes.length === 0
                                ? 'No notes here yet'
                                : `${filteredNotes.length} ${filteredNotes.length === 1 ? 'note' : 'notes'}`}
                        </p>
                    </div>
                    <button
                        id="header-new-note-btn"
                        className="header-new-btn"
                        onClick={openNewNote}
                        aria-label="Create new note"
                    >
                        <Plus size={15} />
                        New Note
                    </button>
                </div>

                {/* Search bar */}
                <div className="canvas-search-bar">
                    <Search size={15} className="search-icon" />
                    <input
                        ref={searchRef}
                        id="notes-search-input"
                        type="search"
                        className="search-input"
                        placeholder="Search notes… (Ctrl+K)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search notes"
                        autoComplete="off"
                        spellCheck={false}
                    />
                    {isSearching && (
                        <button
                            className="search-clear-btn"
                            onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
                            aria-label="Clear search"
                            title="Clear search"
                        >
                            <X size={13} />
                        </button>
                    )}
                </div>

                {/* Active filter bar */}
                {(isFiltering || isSearching) && (
                    <div className="canvas-filter-bar" role="status" aria-live="polite">
                        <span>
                            {isSearching
                                ? `🔍 Searching for "${searchQuery.trim()}"`
                                : filter === 'favorites'
                                ? '⭐ Showing favorited notes'
                                : `🏷 Filtered by #${selectedTag}`}
                        </span>
                        <button
                            className="canvas-filter-clear"
                            onClick={() => { clearFilter(); setSearchQuery(''); }}
                        >
                            Clear all ×
                        </button>
                    </div>
                )}

                {/* Notes grid / Empty state */}
                {filteredNotes.length === 0 ? (
                    <div className="empty-canvas">
                        <div className="empty-canvas-icon">
                            {isSearching ? '🔍' : filter === 'favorites' ? '⭐' : selectedTag ? '🏷' : '✦'}
                        </div>
                        <h3>
                            {isSearching
                                ? `No results for "${searchQuery.trim()}"`
                                : filter === 'favorites'
                                ? 'No favorites yet'
                                : selectedTag
                                ? `No notes tagged #${selectedTag}`
                                : 'Your workspace is empty'}
                        </h3>
                        <p>
                            {isSearching
                                ? 'Try different keywords or clear the search'
                                : filter === 'favorites'
                                ? 'Star a note to save it here'
                                : selectedTag
                                ? 'Try a different tag or clear the filter'
                                : 'Click New Note or the + button to get started'}
                        </p>
                    </div>
                ) : (
                    <div className="masonry-grid" aria-label="Notes grid">
                        {filteredNotes.map((note, index) => (
                            <div
                                key={note._id}
                                className="masonry-item note-card"
                                style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
                                aria-label={`Note: ${note.title}`}
                            >
                                <div className="note-card-inner">

                                    {/* ── Quick-favorite star (top-right, absolute) ── */}
                                    <button
                                        id={`fav-note-${note._id}`}
                                        className={`card-fav-btn${note.isFavorite ? ' is-favorite' : ''}`}
                                        onClick={(e) => handleToggleFavorite(e, note)}
                                        title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                        aria-label={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                        aria-pressed={!!note.isFavorite}
                                    >
                                        <Star
                                            size={14}
                                            fill={note.isFavorite ? 'currentColor' : 'none'}
                                        />
                                    </button>

                                    {/* Title */}
                                    <h3 className="note-card-title">{note.title}</h3>

                                    {/* Rich text preview */}
                                    <div
                                        className="note-card-content"
                                        dangerouslySetInnerHTML={{ __html: note.content }}
                                    />

                                    {/* Tags */}
                                    {(note.tags ?? []).length > 0 && (
                                        <div className="note-tags" aria-label="Note tags">
                                            {note.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="note-tag-pill"
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() => {
                                                        setSelectedTag(tag);
                                                        setFilter('all');
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') { setSelectedTag(tag); setFilter('all'); }
                                                    }}
                                                    title={`Filter by #${tag}`}
                                                    aria-label={`Tag: ${tag}. Click to filter.`}
                                                >
                                                    <span className="note-tag-hash">#</span>{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Footer: date + edit/delete */}
                                    <div className="note-card-footer">
                                        <span className="note-date">
                                            <Clock size={11} />
                                            {formatDate(note.updatedAt ?? note.createdAt)}
                                        </span>
                                        <div className="note-card-actions">
                                            <button
                                                id={`edit-note-${note._id}`}
                                                className="note-action-btn edit"
                                                onClick={() => openEditNote(note)}
                                                title="Edit note"
                                                aria-label={`Edit ${note.title}`}
                                            >
                                                <Edit2 size={12} />
                                            </button>
                                            <button
                                                id={`delete-note-${note._id}`}
                                                className="note-action-btn delete"
                                                onClick={(e) => handleDelete(e, note._id)}
                                                title="Delete note"
                                                aria-label={`Delete ${note.title}`}
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* ── Floating Action Button ── */}
            <button
                id="fab-new-note"
                className="fab"
                onClick={openNewNote}
                title="New note"
                aria-label="Create new note"
            >
                <Plus size={22} />
            </button>

            {/* ── Right Drawer ── */}
            <NoteDrawer
                isOpen={drawerOpen}
                onClose={closeDrawer}
                formData={formData}
                setFormData={setFormData}
                onSave={handleSave}
                editingNoteId={editingNoteId}
            />
        </div>
    );
};

export default Home;