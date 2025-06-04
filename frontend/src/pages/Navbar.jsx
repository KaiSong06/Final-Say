import {Link} from 'react-router-dom';

const Navbar = () => {
  return ( 
  <div className = "navbar">
    <div className = "left-navbar">
      <img src="/logo.png" alt="Logo" className="nav-logo" />
      <h1>FinalSay</h1>
    </div>
    <div className = "right-navbar">
      <Link to = "/">Home</Link>
      <Link to = "/about">About</Link>
      <Link to = "/debate" className="debate-button">Debate Now</Link>
    </div>
  </div> );
}
 
export default Navbar;