// TODO: Create an interface for the Candidate objects returned by the API
interface Candidate {
    id: number;
    login: string;
    avatar_url: string;
    location: string;
    email: string;
    company: string;
    bio: string;
    }

export default Candidate;
