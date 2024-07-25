import './index.css'

import { Link } from 'react-router-dom';

function index() {
    return (
      <div>
          <div className="index-container">
            <h2>Do you have an account?</h2>
            <Link to="/login">Yes, Login</Link>
            <Link to="/register">No, Register</Link>
          </div>
      </div>
    )
  }
  
export default index
  