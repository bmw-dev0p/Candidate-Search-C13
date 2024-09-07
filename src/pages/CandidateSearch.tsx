import { useState, useEffect, useCallback } from 'react';
import { searchGithub } from '../api/API';

interface Candidate {
  id: number;
  login: string;
  avatar_url: string;
}

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await searchGithub();
        console.log('Fetched Data:', data); // Debugging line to check the data structure

        // Ensure the data is an array and map it to the Candidate type
        if (Array.isArray(data)) {
          const formattedCandidates: Candidate[] = data.map((user: any) => ({
            id: user.id,
            login: user.login,
            avatar_url: user.avatar_url,
          }));

          setCandidates(formattedCandidates);
          if (formattedCandidates.length > 0) {
            setCurrentCandidate(formattedCandidates[0]);
          }
        } else {
          console.error('Data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, []);

  const handleNextCandidate = useCallback(() => {
    if (!candidates.length) return;

    const currentIndex = candidates.findIndex(candidate => candidate.id === currentCandidate?.id);
    const nextIndex = (currentIndex + 1) % candidates.length;
    setCurrentCandidate(candidates[nextIndex]);
  }, [candidates, currentCandidate]);

  const handleSaveCandidate = useCallback(() => {
    if (currentCandidate && !savedCandidates.some(candidate => candidate.id === currentCandidate.id)) {
      setSavedCandidates(prevCandidates => [...prevCandidates, currentCandidate]);
    }
  }, [currentCandidate, savedCandidates]);

  return (
    <div>
      <h1>Candidate Search</h1>
      {currentCandidate ? (
        <div>
          <img src={currentCandidate.avatar_url} alt={currentCandidate.login} style={{ width: '100px', height: '100px' }} />
          <h2>{currentCandidate.login}</h2>
        </div>
      ) : (
        <p>No candidates available</p>
      )}
      <button onClick={handleNextCandidate} disabled={!candidates.length}>Next Candidate</button>
      <button onClick={handleSaveCandidate} disabled={!currentCandidate}>Save Candidate</button>
    </div>
  );
};

export default CandidateSearch;
