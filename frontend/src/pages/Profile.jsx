import React, { useState, useEffect } from 'react';
import api from '../api';
import { User, Book, Edit3 } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // HTML5 Canvas approach to compress image on client-side before sending
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 150;
        const MAX_HEIGHT = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // Update via backend API
        api.put('/auth/profile-picture', { profilePicture: dataUrl })
          .then(res => {
             const updatedUser = { ...user, profilePicture: res.data.profilePicture };
             setUser(updatedUser);
             localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist locally globally
          })
          .catch(err => {
             console.error("Failed to upload image", err);
             alert("Failed to upload profile picture");
          });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);

        const subRes = await api.get(`/submissions/user/${parsedUser.id}`);
        setSubmissions(subRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <div className="container">Loading...</div>;
  if (!user) return <div className="container">Please log in to view profile.</div>;

  const totalWords = submissions.reduce((acc, curr) => acc + curr.wordCount, 0);

  return (
    <div className="container" style={{ marginTop: '2rem', maxWidth: '900px' }}>
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <label style={{ cursor: 'pointer', position: 'relative' }} title="Change Profile Picture">
          <input 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handleImageUpload} 
          />
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'var(--accent)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden',
            border: '2px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={48} color="white" />
            )}
          </div>
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '50%',
            padding: '0.4rem',
            display: 'flex',
            boxShadow: 'var(--shadow)'
          }}>
             <Edit3 size={14} className="text-secondary" />
          </div>
        </label>
        <div>
          <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>{user.name}</h2>
          <p className="text-secondary" style={{ margin: 0 }}>{user.email}</p>
          {user.role === 'admin' && <span style={{ 
            display: 'inline-block', 
            marginTop: '0.5rem', 
            background: 'var(--danger)', 
            padding: '0.2rem 0.5rem', 
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>Admin</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Book size={32} className="text-accent" />
          <div>
            <h3 style={{ margin: 0 }}>{submissions.length}</h3>
            <p className="text-secondary" style={{ margin: 0 }}>Total Submissions</p>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Edit3 size={32} className="text-accent" />
          <div>
            <h3 style={{ margin: 0 }}>{totalWords.toLocaleString()}</h3>
            <p className="text-secondary" style={{ margin: 0 }}>Words Written</p>
          </div>
        </div>
      </div>

      <h3>Your Contributions</h3>
      {submissions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {submissions.map(sub => (
            <div key={sub._id} className="card">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0 }} className="text-accent">{sub.topic?.title || 'Unknown Topic'}</h4>
                <span className="text-secondary">{new Date(sub.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-secondary">{sub.wordCount} words</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-secondary mt-2">You haven't contributed to any topics yet.</p>
      )}
    </div>
  );
};

export default Profile;
