// src/api/advancedSearch.ts
import { searchGithub, searchGithubUser } from '../api/API';
import type Candidate from '../interfaces/Candidate.interface';

const advancedSearch = async (): Promise<Candidate | null> => {
  try {
    let validUserFound = false;
    let attempts = 0;
    const maxAttempts = 10; // Limit the number of retries

    while (!validUserFound && attempts < maxAttempts) {
      const randomUsers = await searchGithub(); // fetch random user(s) from the API
      const randomUserLogin = randomUsers[0].login; // get the login of the random user
      const userData = await searchGithubUser(randomUserLogin);  // Feed login to new API function

      if (userData && userData.email) {
        validUserFound = true; // We found a user with an email
        const formattedCandidate: Candidate = {
          id: userData.id,
          login: userData.login,
          avatar_url: userData.avatar_url,
          location: userData.location || 'Location not provided',
          email: userData.email,
          company: userData.company || 'Company not provided',
          bio: userData.bio || 'Bio not provided',
        };
        return formattedCandidate;
      } else {
        attempts++;
        if (attempts >= maxAttempts) {
          return null; // No suitable user found
        }
      }
    }
  } catch (error) {
    console.error('Error fetching candidate:', error);
    return null;
  }
    return null;
};

export default advancedSearch;
