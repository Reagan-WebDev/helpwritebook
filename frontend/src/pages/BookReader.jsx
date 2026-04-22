import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';

const BookReader = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch topic details
        const topicRes = await api.get(`/topics/${topicId}`);
        setTopic(topicRes.data);

        // Fetch submissions (chapters)
        const subRes = await api.get(`/submissions/topic/${topicId}`);
        // Sort chronologically if needed, assuming the backend does or they are returned in insertion order
        setSubmissions(subRes.data);

        // Fetch user progress
        const progRes = await api.get(`/progress/${topicId}`);
        if (progRes.data && typeof progRes.data.currentChapterIndex === 'number') {
            const savedIndex = progRes.data.currentChapterIndex;
            // Ensure bounds
            setCurrentIndex(savedIndex < subRes.data.length ? savedIndex : 0);
        }
      } catch (err) {
        console.error('Failed to load book or progress:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  const saveProgress = async (newIndex) => {
    try {
      await api.post(`/progress/${topicId}`, { currentChapterIndex: newIndex });
    } catch (err) {
      console.error('Failed to save reading progress', err);
    }
  };

  const handleNext = () => {
    if (currentIndex < submissions.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      saveProgress(newIndex);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      saveProgress(newIndex);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Loading Book...</h2>
      </div>
    );
  }

  if (submissions.length === 0) {
      return (
        <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h2>No chapters available for this book.</h2>
          <button className="primary" onClick={() => navigate('/compiled-books')}>Back to Library</button>
        </div>
      );
  }

  const currentSubmission = submissions[currentIndex];

  return (
    <div className="container" style={{ 
        marginTop: '2rem', 
        marginBottom: '4rem',
        maxWidth: '800px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button className="secondary" onClick={() => navigate('/compiled-books')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={18} /> Library
        </button>
        <h2 style={{ margin: 0, textAlign: 'center', flex: 1 }}>{topic?.title || 'Unknown Title'}</h2>
        <div style={{ width: '100px' }} /> {/* Spacer to balance header */}
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div style={{ 
            background: 'var(--surface)', 
            padding: '1.5rem 2rem', 
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
        }}>
            <h3 style={{ margin: 0, color: 'var(--text)' }}>Chapter {currentIndex + 1}</h3>
            <span style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>
                {currentIndex + 1} of {submissions.length}
            </span>
        </div>

        <div 
          ref={contentRef}
          style={{ 
            padding: '2rem', 
            fontSize: '1.1rem', 
            lineHeight: '1.8', 
            color: 'var(--text)',
            minHeight: '400px',
            whiteSpace: 'pre-wrap'
        }}>
          {currentSubmission.content}
        </div>

        <div style={{ 
            background: 'var(--background)', 
            padding: '1.5rem 2rem', 
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px'
        }}>
            <button 
                className="secondary" 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <ArrowLeft size={16} /> Previous
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontSize: '0.85rem' }}>
                <BookOpen size={14} /> Author: {currentSubmission.user?.name || 'Anonymous'}
            </div>

            {currentIndex === submissions.length - 1 ? (
                <button 
                    className="primary" 
                    onClick={() => navigate('/compiled-books')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success)', borderColor: 'var(--success)' }}
                >
                    <CheckCircle size={16} /> Finish
                </button>
            ) : (
                <button 
                    className="primary" 
                    onClick={handleNext}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    Next <ArrowRight size={16} />
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default BookReader;
