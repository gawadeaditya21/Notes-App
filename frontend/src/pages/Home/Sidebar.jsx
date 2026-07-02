import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    FileText, Star, LogOut, Moon, Sun,
    ChevronDown, Pencil, Hash, Filter,
} from 'lucide-react';

/**
 * Sidebar — 220px full navigation panel
 *
 * Props:
 *   filter         — 'all' | 'favorites'
 *   setFilter      — setter
 *   selectedTag    — string | null
 *   setSelectedTag — setter
 *   allTags        — string[]  (unique tags across all notes)
 *   noteCount      — total note count
 *   favoriteCount  — favorited note count
 */
const Sidebar = ({
    filter,
    setFilter,
    selectedTag,
    setSelectedTag,
    allTags = [],
    noteCount = 0,
    favoriteCount = 0,
}) => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [tagsOpen, setTagsOpen] = useState(true);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const handleAllNotes = () => {
        setFilter('all');
        setSelectedTag(null);
    };

    const handleFavorites = () => {
        setFilter('favorites');
        setSelectedTag(null);
    };

    const handleTagClick = (tag) => {
        if (selectedTag === tag) {
            // Deselect: go back to all notes
            setSelectedTag(null);
            setFilter('all');
        } else {
            setSelectedTag(tag);
            setFilter('all'); // tags filter overrides favorite filter
        }
    };

    const initials = user?.name
        ? user.name.split(' ').filter(Boolean).map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    const isAllActive   = filter === 'all' && !selectedTag;
    const isFavActive   = filter === 'favorites' && !selectedTag;

    return (
        <aside className="sidebar" aria-label="Application sidebar">

            {/* ── Brand ── */}
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon" aria-hidden="true">
                    <Pencil size={14} />
                </div>
                <span className="sidebar-brand-name">NoteFlow</span>
            </div>

            {/* ── User row ── */}
            <div className="sidebar-user">
                <div className="sidebar-avatar" title={user?.name}>
                    {initials}
                </div>
                <span className="sidebar-username" title={user?.name}>
                    {user?.name ?? 'User'}
                </span>
            </div>

            {/* ── Main Navigation ── */}
            <div className="sidebar-section">
                <span className="sidebar-section-label">Workspace</span>

                <button
                    id="sidebar-all-notes"
                    className={`sidebar-nav-item${isAllActive ? ' active' : ''}`}
                    onClick={handleAllNotes}
                    aria-label="All Notes"
                    aria-current={isAllActive ? 'page' : undefined}
                >
                    <FileText size={15} />
                    <span className="sidebar-nav-label">All Notes</span>
                    {noteCount > 0 && (
                        <span className="sidebar-nav-count">{noteCount}</span>
                    )}
                </button>

                <button
                    id="sidebar-favorites"
                    className={`sidebar-nav-item${isFavActive ? ' active' : ''}`}
                    onClick={handleFavorites}
                    aria-label="Favorites"
                    aria-current={isFavActive ? 'page' : undefined}
                >
                    <Star size={15} fill={isFavActive ? 'currentColor' : 'none'} />
                    <span className="sidebar-nav-label">Favorites</span>
                    {favoriteCount > 0 && (
                        <span className="sidebar-nav-count">{favoriteCount}</span>
                    )}
                </button>
            </div>

            {/* ── Tags Section ── */}
            {allTags.length > 0 && (
                <div className="sidebar-section">
                    <button
                        className="sidebar-tags-header"
                        onClick={() => setTagsOpen((o) => !o)}
                        aria-expanded={tagsOpen}
                        aria-label="Toggle tags section"
                    >
                        <span className="sidebar-section-label" style={{ marginBottom: 0 }}>
                            Tags
                        </span>
                        <ChevronDown
                            size={13}
                            className={`sidebar-chevron${tagsOpen ? ' open' : ''}`}
                        />
                    </button>

                    {tagsOpen && (
                        <div className="sidebar-tag-list" role="list">
                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    className={`sidebar-tag-item${selectedTag === tag ? ' active' : ''}`}
                                    onClick={() => handleTagClick(tag)}
                                    aria-label={`Filter by tag: ${tag}`}
                                    aria-pressed={selectedTag === tag}
                                    role="listitem"
                                >
                                    <Hash size={12} className="sidebar-tag-hash" />
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Bottom Controls ── */}
            <div className="sidebar-bottom-section">
                <button
                    id="sidebar-theme-toggle"
                    className="sidebar-nav-item"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                    <span className="sidebar-nav-label">
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </button>

                <button
                    id="sidebar-logout"
                    className="sidebar-nav-item sidebar-logout-item"
                    onClick={handleLogout}
                    aria-label="Logout"
                >
                    <LogOut size={15} />
                    <span className="sidebar-nav-label">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
