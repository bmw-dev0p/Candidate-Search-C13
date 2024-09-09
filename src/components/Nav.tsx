import { Link } from 'react-router-dom';

const Nav = () => {
  // TODO: Add necessary code to display the navigation bar and link between the pages
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Search Candidates</Link> {/* Link to the search page */}
        </li>
        <li>
          <Link to="/SavedCandidates">Saved Candidates</Link> {/* Link to the saved candidates page */}
        </li>
      </ul>
    </nav>
  );
};

export default Nav;