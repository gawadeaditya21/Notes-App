import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { LogOut, Plus, Save, Edit2, Trash2, X } from 'lucide-react'; // Import Icons

const Home = () => {
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState({ title: '', content: ''});
    const [editingNoteId, setEditingNoteId] = useState(null);

    const {user, logout} = useContext(AuthContext);
    const navigate = useNavigate();

    // FETCH DATA
    useEffect(() => {
        if(!user) {
            navigate('/login');
            return;
        }

        const fetchNotes = async () => {
            try {
                const res = await API.get('/notes');
                setNotes(res.data);
            } catch(error) {    
                toast.error("Failed to fetch notes", error);
            }
        };
        fetchNotes();
    }, [user, navigate]);

    // SAVE AND UPDATE NOTE
    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            if (editingNoteId) {
                const res = await API.put(`/notes/${editingNoteId}`, formData);
                setNotes(notes.map((note) => note._id = editingNoteId ? res.data : note));
                setEditingNoteId(null);
                toast.success("Note updated successfully!");
            } else {
                const res = await API.post('/notes', formData);
                setNotes([res.data, ...notes]);
                toast.success("Note created!");
            }
            setFormData({title: '', content:''});
        } catch(error) {
            toast.error("Failed to create note", error);
        }
    };

    // SETUP EDIT MODE
    const handleEditSetup = (note) => {
        setFormData({ title: note.title, content: note.content});
        setEditingNoteId(note._id);
        window.scrollTo({ top: 0, behavior: 'smooth'});
    };

    // CANCEL EDIT MODE
    const cancelEdit = () =>{
        setFormData({ title: '', content: ''});
        setEditingNoteId(null);
    };

    // DELETE NOTE
    const handleDeleteNote = async(id) => {
        try {
            await API.delete(`/notes/${id}`);
            setNotes(notes.filter((note) => note._id != id));
            toast.success("Note deleted");
        } catch(error) {
            toast.error("Failed to create note", error);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate('login');
    }

    if (!user) return null;

    return (
        <div className="container">
            {/* Header Area */}
            <header className="flex-between" style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--text-main)' }}>Welcome, {user.name}</h2>
                <button onClick={handleLogout} className="btn btn-danger">
                    <LogOut size={18} /> Logout
                </button>
            </header>

            {/* Dynamic Form */}
            <div className="card animate-card">
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
                    {editingNoteId ? 'Update your Note' : 'Create a New Note'}
                </h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input 
                        type="text" 
                        placeholder="Note Title" 
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required 
                        className="input-field"
                    />
                    <textarea 
                        placeholder="Note Content" 
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        required 
                        rows="4"
                        className="input-field"
                    />
                    
                    <div className="flex-gap">
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            {editingNoteId ? <><Save size={18} /> Update Note</> : <><Plus size={18} /> Save Note</>}
                        </button>
                        
                        {editingNoteId && (
                            <button type="button" onClick={cancelEdit} className="btn" style={{ background: 'var(--text-muted)', color: 'white', flex: 1 }}>
                                <X size={18} /> Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Display Notes Grid */}
            <div className="notes-grid">
                {notes.length === 0 ? (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        No notes yet. Create your first one above!
                    </p>
                ) : (
                    notes.map((note, index) => (
                        <div 
                            key={note._id} 
                            className="card animate-card" 
                            style={{ animationDelay: `${index * 0.05}s` }} /* Staggers the fade-in animation */
                        >
                            <h3 style={{ marginBottom: '0.5rem', paddingRight: '70px', color: 'var(--text-main)' }}>
                                {note.title}
                            </h3>
                            <p style={{ color: 'var(--text-muted)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                                {note.content}
                            </p>
                            
                            {/* Floating Action Icons */}
                            <div className="flex-gap" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
                                <button onClick={() => handleEditSetup(note)} className="btn btn-warning btn-icon-only">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDeleteNote(note._id)} className="btn btn-danger btn-icon-only">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;