// src/components/CandidateSearch.tsx
import { useEffect, useState } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import advancedSearch from './advancedSearch';
import type Candidate from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  //wanted default candidate to be octocat, probably a better way to do this
  const [currentCandidate, setCurrentCandidate] = useState<Candidate>({
    id: 583231,
    login: 'octocat',
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    location: 'San Francisco',
    email: 'octocat@github.com',
    company: '@github',
    bio: '',
  });

  const [loadingStatus, setLoadingStatus] = useState<string>('Ready! Click a circle to search');

  const fetchCandidate = async () => {
    setLoadingStatus('Searching...');
    try {
      const randomUsers = await searchGithub(); // fetch random user(s) from the API
      // console.log('randomUsers:', randomUsers);
      // so... I see that the above line returns an array of users (30)
      // But I felt that looping over the array 30 times to get a single user is not efficient
      // So my solution is just to use the first user, and recall fetchCandidate each button click
      const randomUserLogin = randomUsers[0].login; // get the login of the random user
      // console.log('randomUserLogin:', randomUserLogin);
      const userData = await searchGithubUser(randomUserLogin); // feed login to new API function
      // console.log('userData:', userData);

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
        // set state of candidate and search
        console.log('normalSearch successful');
        
        setCurrentCandidate(formattedCandidate);
        setLoadingStatus('User found');
      } 
      else {
        setLoadingStatus('No suitable user found. Try again.');
      }
    } 
    catch (error) {
      console.error('Error fetching candidate:', error);
      setLoadingStatus('Error fetching user');
    }
  };

  //added functionality of searching for users with email
  const handleAdvancedSearch = async () => {
    setLoadingStatus('Searching...');
    const candidate = await advancedSearch();
    if (candidate) {
      console.log('advancedSearch successful');
      setCurrentCandidate(candidate);
      setLoadingStatus('User found');
    } 
    else {
      setLoadingStatus('No suitable user found');
    }
  };

  //so this would usually call the function on load. but I have default user set above.
  useEffect(() => { 
    // fetchCandidate();
  }, []);

  // save function
  const saveCandidate = () => {
    let savedCandidates: Candidate[] = []; //initialize empty array
    const storedCandidates = localStorage.getItem('savedCandidates'); // pull current storage

    if (storedCandidates) {
      try {
        savedCandidates = JSON.parse(storedCandidates); // allocate storage to array
      } 
      catch (error) {
        console.error('Error parsing local storage data:', error);
        savedCandidates = [];
      }
    }

    savedCandidates.push(currentCandidate); // add current candidate to array
    localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates)); // format and save
    console.log('Candidate saved successfully:', currentCandidate);
   
  };

  return (
    <div className='container'>
      <h1>Github User Search</h1>
      <div className='loading'>{loadingStatus}</div>
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
      {/* buttons */}
      <div className="button-container">
        <div>
          <button onClick={fetchCandidate} className="button fetch">Search Users</button>
          <p className="label">Any User</p>
        </div>
        <div>
          <button onClick={handleAdvancedSearch} className="button advanced">Advanced Search</button>
          <p className="label">User with Email</p>
        </div>
        <div>
          <button onClick={saveCandidate} className="button save">Save User</button>
          <p className="label">Save to Storage</p>
        </div>
      </div>
      
    </div>
  );
};

export default CandidateSearch;
