import React, { useState, useEffect } from 'react';
import type Candidate from '../interfaces/Candidate.interface';
import '../index.css'

const SavedCandidates = () => {
  //initialize state 
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  // Fetch saved candidates from localStorage when the component mounts
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

 return (
  <>
    <h1 className="bigText">Potential Candidates</h1>
    <div className="grid-container">
      {savedCandidates.length > 0 ? (
        savedCandidates.map((candidate) => (
          <div key={candidate.id} className="candidate-card">
            <img
              src={candidate.avatar_url}
              alt={candidate.login}
              className="candidate-avatar"
            />
            <div className="candidate-info">
              <h2 className='userName'>{candidate.login}</h2>
              <p><strong>Location:</strong> {candidate.location}</p>
              <p><strong>Email:</strong> {candidate.email}</p>
              <p><strong>Company:</strong> {candidate.company}</p>
              <p><strong>Bio:</strong> {candidate.bio}</p>
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
