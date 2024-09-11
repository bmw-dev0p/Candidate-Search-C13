import { useState, useEffect } from 'react';
import type Candidate from '../interfaces/Candidate.interface';
import '../index.css';

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const storedCandidates = localStorage.getItem('savedCandidates');
    if (storedCandidates) {
      try {
        setSavedCandidates(JSON.parse(storedCandidates));
      } catch (error) {
        console.error('Error parsing saved candidates:', error);
      }
    }
  }, []);

  const removeCandidate = (id: number) => {
    const updatedCandidates = savedCandidates.filter(candidate => candidate.id !== id);
    setSavedCandidates(updatedCandidates);
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
  };

  return (
    <>
      <h1 className="bigText">Potential Candidates</h1>
      <div className="grid-container">
        {savedCandidates.length > 0 ? (
          savedCandidates.map((candidate) => (
            <div key={candidate.id} className="grid-row">
              <div className="grid-item avatar">
                <img
                  src={candidate.avatar_url}
                  alt={candidate.login}
                  className="candidate-avatar"
                />
              </div>
              <div className="grid-item alt">
                <h2>{candidate.login}</h2>
              </div>
              <div className="grid-item ">
                <p><strong>Location:</strong> {candidate.location}</p>
              </div>
              <div className="grid-item alt">
                <p><strong>Email:</strong> {candidate.email}</p>
              </div>
              <div className="grid-item">
                <p><strong>Company:</strong> {candidate.company}</p>
              </div>
              <div className="grid-item alt">
                <p><strong>Bio:</strong> {candidate.bio}</p>
              </div>
              <div className="grid-item remove-button">
                <button onClick={() => removeCandidate(candidate.id)}>Remove</button>
              </div>
            </div>
          ))
        ) : (
          <p>No candidates saved yet.</p>
        )}
      </div>
    </>
  );
};

export default SavedCandidates;
