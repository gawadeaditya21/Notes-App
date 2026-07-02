import { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { X, Save, Star } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Quill configuration
───────────────────────────────────────────────────────────── */
const QUILL_MODULES = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link'],
        ['clean'],
    ],
};

const QUILL_FORMATS = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block', 'link',
];

/* ─────────────────────────────────────────────────────────────
   TagInput — inline tag chip input
   Props: tags: string[], onChange: (tags: string[]) => void
───────────────────────────────────────────────────────────── */
const TagInput = ({ tags, onChange }) => {
    const [inputVal, setInputVal] = useState('');
    const inputRef = useRef(null);

    const addTag = (raw) => {
        // Sanitise: lowercase, strip anything except alphanumerics, hyphens, underscores
        const cleaned = raw.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
        if (cleaned && !tags.includes(cleaned)) {
            onChange([...tags, cleaned]);
        }
        setInputVal('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (inputVal) addTag(inputVal);
        } else if (e.key === 'Backspace' && !inputVal && tags.length > 0) {
            // Remove last tag on backspace when input is empty
            onChange(tags.slice(0, -1));
        }
    };

    const removeTag = (tag) => {
        onChange(tags.filter((t) => t !== tag));
    };

    return (
        <div
            className="tag-input-wrapper"
            onClick={() => inputRef.current?.focus()}
            aria-label="Tag input"
        >
            {tags.map((tag) => (
                <span key={tag} className="tag-pill-active">
                    #{tag}
                    <button
                        type="button"
                        className="tag-pill-remove"
                        onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                        aria-label={`Remove tag ${tag}`}
                    >
                        ×
                    </button>
                </span>
            ))}
            <input
                ref={inputRef}
                type="text"
                className="tag-input-field"
                placeholder={tags.length === 0 ? 'Add tags… press Enter or comma' : ''}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => { if (inputVal) addTag(inputVal); }}
                autoComplete="off"
                spellCheck={false}
            />
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────
   NoteDrawer
   Props:
     isOpen         — controls visibility
     onClose        — callback to close
     formData       — { title, content, isFavorite, tags }
     setFormData    — state setter
     onSave         — async save handler
     editingNoteId  — null (create) | string (edit)
───────────────────────────────────────────────────────────── */
const NoteDrawer = ({ isOpen, onClose, formData, setFormData, onSave, editingNoteId }) => {
    const titleRef = useRef(null);

    // Auto-focus title once drawer slides in
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => titleRef.current?.focus(), 350);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Keyboard shortcuts: Ctrl/Cmd+Enter → save, Esc → close
    useEffect(() => {
        const handleKeydown = (e) => {
            if (isOpen && (e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                onSave();
            }
            if (isOpen && e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [isOpen, onSave, onClose]);

    const toggleFavorite = () => {
        setFormData((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
    };

    const isFavorite = formData.isFavorite ?? false;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="drawer-overlay"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`note-drawer${isOpen ? ' open' : ''}`}
                aria-label={editingNoteId ? 'Edit note' : 'New note'}
                aria-hidden={!isOpen}
            >
                {/* ── Header ── */}
                <div className="drawer-header">
                    <span className="drawer-label">
                        {editingNoteId ? 'Edit Note' : 'New Note'}
                    </span>

                    <div className="drawer-header-actions">
                        {/* Favorite toggle */}
                        <button
                            id="drawer-fav-btn"
                            className={`drawer-fav-btn${isFavorite ? ' is-favorite' : ''}`}
                            onClick={toggleFavorite}
                            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            aria-pressed={isFavorite}
                        >
                            <Star
                                size={16}
                                fill={isFavorite ? 'currentColor' : 'none'}
                            />
                        </button>

                        {/* Close */}
                        <button
                            id="drawer-close-btn"
                            className="drawer-close"
                            onClick={onClose}
                            aria-label="Close drawer"
                            title="Close (Esc)"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* ── Borderless Title ── */}
                <input
                    ref={titleRef}
                    id="drawer-title-input"
                    className="drawer-title-input"
                    type="text"
                    placeholder="Note title…"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    autoComplete="off"
                    spellCheck
                />

                <div className="drawer-divider" />

                {/* ── Rich Text Editor ── */}
                <div className="drawer-editor">
                    <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={(val) => setFormData({ ...formData, content: val })}
                        modules={QUILL_MODULES}
                        formats={QUILL_FORMATS}
                        placeholder="Start writing… (Ctrl+Enter to save)"
                    />
                </div>

                {/* ── Tags Input ── */}
                <div className="drawer-tags-section">
                    <span className="drawer-tags-label">Tags</span>
                    <TagInput
                        tags={formData.tags ?? []}
                        onChange={(newTags) => setFormData({ ...formData, tags: newTags })}
                    />
                </div>

                {/* ── Save Footer ── */}
                <div className="drawer-footer">
                    <button
                        id="drawer-save-btn"
                        className="drawer-save-btn"
                        onClick={onSave}
                        title="Save (Ctrl+Enter)"
                    >
                        <Save size={15} />
                        {editingNoteId ? 'Update Note' : 'Save Note'}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default NoteDrawer;
