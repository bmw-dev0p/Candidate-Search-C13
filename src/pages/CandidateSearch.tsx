// src/components/CandidateSearch.tsx
import { useState } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import advancedSearch from './advancedSearch';
import type Candidate from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [currentCandidate, setCurrentCandidate] = useState<Candidate>({
    id: 583231,
    login: 'octocat',
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    location: 'San Francisco',
    email: 'octocat@github.com',
    company: '@github',
    bio: '',
  });
  const [loadingStatus, setLoadingStatus] = useState<string>('Ready to search');

  const fetchCandidate = async () => {
    setLoadingStatus('Searching...');
    try {
      const randomUsers = await searchGithub();
      const randomUserLogin = randomUsers[0].login;
      const userData = await searchGithubUser(randomUserLogin);

      if (userData) {
        const formattedCandidate: Candidate = {
          id: userData.id,
          login: userData.login,
          avatar_url: userData.avatar_url,
          location: userData.location || 'Location not provided',
          email: userData.email || 'Email not provided',
          company: userData.company || 'Company not provided',
          bio: userData.bio || 'Bio not provided',
        };
        setCurrentCandidate(formattedCandidate);
        setLoadingStatus('User found');
      } else {
        setLoadingStatus('No suitable user found');
      }
    } catch (error) {
      console.error('Error fetching candidate:', error);
      setLoadingStatus('Error fetching user');
    }
  };

  const handleAdvancedSearch = async () => {
    setLoadingStatus('Searching...');
    const candidate = await advancedSearch();
    if (candidate) {
      setCurrentCandidate(candidate);
      setLoadingStatus('User found');
    } else {
      setLoadingStatus('No suitable user found');
    }
  };

  const saveCandidate = () => {
    let savedCandidates: Candidate[] = [];
    const storedCandidates = localStorage.getItem('savedCandidates');

    if (storedCandidates) {
      try {
        savedCandidates = JSON.parse(storedCandidates);
      } catch (error) {
        console.error('Error parsing local storage data:', error);
        savedCandidates = [];
      }
    }

    savedCandidates.push(currentCandidate);

    try {
      localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
      console.log('Candidate saved successfully:', currentCandidate);
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  };

  return (
    <div>
      <h1>Candidate Search</h1>
      <div>
        <img
          src={currentCandidate.avatar_url}
          alt={currentCandidate.login}
          style={{ width: '500px', height: '500px' }}
        />
        <h2>{currentCandidate.login}</h2>
        <p>Location: {currentCandidate.location}</p>
        <p>Email: {currentCandidate.email}</p>
        <p>Company: {currentCandidate.company}</p>
        <p>Bio: {currentCandidate.bio}</p>
      </div>
      <div className="button-container">
        <div>
          <button onClick={fetchCandidate} className="button fetch">-</button>
          <div className="label">Search Users</div>
        </div>
        <div>
          <button onClick={handleAdvancedSearch} className="button advanced">*</button>
          <div className="label">Advanced Search</div>
        </div>
        <div>
          <button onClick={saveCandidate} className="button save">+</button>
          <div className="label">Save User</div>
        </div>
      </div>
      <div>{loadingStatus}</div>
    </div>
  );
};

export default CandidateSearch;
