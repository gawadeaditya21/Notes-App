import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
    const [notes, setNotes] = useState([]);
    const [formData, setformData] = useState({ title: '', content: ''});
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
                console.error("Failed to fetch notes", error);
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

            } else {
                const res = await API.post('/notes', formData);
                setNotes([res.data, ...notes]);
            
            }
            setformData({title: '', content:''});
        } catch(error) {
            console.error("Failed to create note", error);
        }
    };

    // SETUP EDIT MODE
    const handleEditSetup = (note) => {
        setformData({ title: note.title, content: note.content});
        setEditingNoteId(note._id);
        window.scrollTo({ top: 0, behavior: 'smooth'});
    };

    // CANCEL EDIT MODE
    const cancelEdit = () =>{
        setformData({ title: '', content: ''});
        setEditingNoteId(null);
    };

    // DELETE NOTE
    const handleDeleteNote = async(id) => {
        try {
            await API.delete(`/notes/${id}`);
            setNotes(notes.filter((note) => note._id != id));
        } catch(error) {
            console.error("Failed to create note", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('login');
    }

    if (!user) return null;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            {/* Header Area */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Welcome, {user.name}</h2>
                <button 
                    onClick={handleLogout} 
                    style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Logout
                </button>
            </header>

            {/* Dynamic Create/Update Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                {/* Dynamically change the title based on edit mode */}
                <h3>{editingNoteId ? 'Update Note' : 'Add a New Note'}</h3>
                <input 
                    type="text" 
                    placeholder="Note Title" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required 
                    style={{ padding: '10px' }}
                />
                <textarea 
                    placeholder="Note Content" 
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required 
                    rows="4"
                    style={{ padding: '10px' }}
                />
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flex: 1, padding: '10px', background: editingNoteId ? '#28a745' : '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        {editingNoteId ? 'Update Note' : 'Save Note'}
                    </button>
                    
                    {/* Show a Cancel button only if we are in edit mode */}
                    {editingNoteId && (
                        <button type="button" onClick={cancelEdit} style={{ flex: 1, padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            {/* Display Notes List */}
            <div>
                {notes.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>No notes yet. Create your first one above!</p>
                ) : (
                    notes.map((note) => (
                        <div key={note._id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px', position: 'relative' }}>
                            <h3 style={{ marginTop: '0', paddingRight: '120px' }}>{note.title}</h3>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
                            
                            {/* Action Buttons Container */}
                            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '10px' }}>
                                <button 
                                    onClick={() => handleEditSetup(note)} 
                                    style={{ background: '#ffc107', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDeleteNote(note._id)} 
                                    style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    Delete
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