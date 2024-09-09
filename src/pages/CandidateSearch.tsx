import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import type Candidate from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  // create state to store the current candidate
  // octocat is the default candidate
  const [currentCandidate, setCurrentCandidate] = useState<Candidate>({
    id: 583231,
    login: 'octocat',
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    location: 'San Francisco',
    email: 'octocat@github.com',
    company: '@github',
    bio: '',
  });

  // Function to fetch a random user
  const fetchCandidate = async () => {
    try {
      const randomUsers = await searchGithub(); // fetch random user(s) from the API
      console.log('Fetched User:', randomUsers); // check the data 
      // so... I see that the above line returns an array of users (30)
      // But I felt that looping over the array 30 times to get a single user is not efficient
      // So my solution is just to use the first user, and recall fetchCandidate each button click
      const randomUserLogin = randomUsers[0].login; // get the login of the random user
      console.log('Fetched User Login:', randomUserLogin); // check the data 
      const userData = await searchGithubUser(randomUserLogin);  // Feed login to new api function
      console.log('Fetched User Data:', userData); // check 


      if (userData) {
        // format the data response to the Candidate type
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
      }
    } catch (error) {
      console.error('Error fetching candidate:', error);
    }
  };

  // Fetch user when the component mounts ?
  // useEffect(() => {fetchCandidate()}, []);

  const saveCandidate = () => {
    // initialize an candidate array for storage
    let savedCandidates: Candidate[] = [];
    // Retrieve existing saved candidates 
    const storedCandidates = localStorage.getItem('savedCandidates');
    
    if (storedCandidates) {
      try {
        savedCandidates = JSON.parse(storedCandidates);
      } catch (error) {
        console.error('Error parsing local storage data:', error);
        savedCandidates = []; // reset to empty if parsing fails
      }
    }
    
    // Add the current candidate to the saved list
    savedCandidates.push(currentCandidate);
    
    // Update local storage
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
          <p><strong>Location:</strong> {currentCandidate.location}</p>
          <p><strong>Email:</strong> {currentCandidate.email}</p>
          <p><strong>Company:</strong> {currentCandidate.company}</p>
          <p><strong>Bio:</strong> {currentCandidate.bio}</p>
        </div>
      <button onClick={fetchCandidate}>Fetch New Candidate</button> {/* Button to fetch a new user */}
      <button onClick={saveCandidate}>Save Candidate</button> {/* Button to save user */}
    </div>
  );
};

export default CandidateSearch;
