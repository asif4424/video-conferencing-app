import React, { useContext, useEffect, useState } from 'react';
import '../styles/Home.css';
import { AuthContext } from '../context/authContext';
import { SocketContext } from '../context/SocketContext';
import { CgEnter } from 'react-icons/cg';
import { RiVideoAddFill } from 'react-icons/ri';
import { useNavigate, Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Card from 'react-bootstrap/Card';
import Groups2Icon from '@mui/icons-material/Groups2';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import BoltIcon from '@mui/icons-material/Bolt';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

const Home = () => {
  const [roomName, setRoomName] = useState('');
  const [newMeetDate, setNewMeetDate] = useState('none');
  const [newMeetTime, setNewMeetTime] = useState('none');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinRoomError, setJoinRoomError] = useState('');

  const { logout } = useContext(AuthContext);
  const { socket, setMyMeets, newMeetType, setNewMeetType } = useContext(SocketContext);

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId") || "";
  const userName = localStorage.getItem("userName") || "";

  const handleLogIn = () => {
    navigate('/login');
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    logout();
  };

  const handleCreateRoom = () => {
    socket.emit("create-room", { userId, roomName, newMeetType, newMeetDate, newMeetTime });
  };

  const handleJoinRoom = async () => {
    socket.emit('user-code-join', { roomId: joinRoomId });
    setRoomName('');
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("room-exists", ({ roomId }) => {
      navigate(`/meet/${roomId}`);
    });

    socket.on("room-not-exist", () => {
      setJoinRoomId('');
      setJoinRoomError("Room doesn't exist! Please try again.");
    });

    socket.emit("fetch-my-meets", { userId });
    socket.on("meets-fetched", ({ myMeets }) => {
      setMyMeets(myMeets);
    });

    return () => {
      socket.off("room-exists");
      socket.off("room-not-exist");
      socket.off("meets-fetched");
    };
  }, [socket, navigate, setMyMeets, userId]);

  return (
    <div className='homePage'>
      <div className="homePage-hero">
        <div className="home-header">
          <div className="home-logo">
            <h2>Smart Meet</h2>
          </div>

          {!userName ? (
            <div className="header-before-login">
              <button onClick={handleLogIn}>Login</button>
            </div>
          ) : (
            <div className="header-after-login">
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic">
                  {userName}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <Link className='dropdown-options' to='/profile'>Profile</Link>
                  </Dropdown.Item>
                  <Dropdown.Item className='dropdown-options' onClick={handleLogOut}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </div>

        <div className="home-container container">
          {!userName ? (
            <div className="home-app-intro">
              <h2>
                Unbounded <b>Connections:</b> Elevate Your Meetings with Free, Future-Forward <b>Video Conferencing!!</b>
              </h2>
              <p>
                Revolutionize your meetings with our cutting-edge, future-forward video conferencing platform. Experience seamless collaboration, crystal-clear audio, and HD video, all at <b>zero-cost..!!</b> Elevate your virtual communication and connect without boundaries today!
              </p>
              <button onClick={handleLogIn}>Join Now..</button>
            </div>
          ) : (
            <>
              <div className="home-app-intro">
                <span className="welcome">Welcome!! {userName},</span>
                <h2>Unbounded Connections: Elevate Your Meetings with Free, Future-Forward Video Conferencing!!</h2>
              </div>
              <div className="home-meet-container">
                <div className="create-meet">
                  <input type="text" placeholder='Name your meet...' onChange={(e) => setRoomName(e.target.value)} />
                  <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    <RiVideoAddFill /> New meet
                  </button>
                </div>
                <p>or</p>
                <div className="join-meet">
                  <input type="text" placeholder='Enter code...' onChange={(e) => setJoinRoomId(e.target.value)} />
                  <button onClick={handleJoinRoom}>
                    <CgEnter /> Join Meet
                  </button>
                </div>
                <span>{joinRoomError}</span>
              </div>

              {/* Modal */}
              <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" style={{ width: "30vw" }}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="staticBackdropLabel">Create New Meet</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="floatingInput" placeholder="Name your meet" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                        <label htmlFor="floatingInput">Meet name</label>
                      </div>

                      <select className="form-select" aria-label="Default select example" onChange={(e) => setNewMeetType(e.target.value)}>
                        <option selected>Choose meet type</option>
                        <option value="instant">Instant meet</option>
                        <option value="scheduled">Schedule for later</option>
                      </select>

                      {newMeetType === 'scheduled' && (
                        <>
                          <p className="mt-3">Meet Date:</p>
                          <input type="date" className="form-control" onChange={(e) => setNewMeetDate(e.target.value)} />
                          <p className="mt-3">Meet Time:</p>
                          <input type="time" className="form-control" onChange={(e) => setNewMeetTime(e.target.value)} />
                        </>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                      <button type="button" className="btn btn-primary" onClick={handleCreateRoom} data-bs-dismiss="modal">Create meet</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="about-app-container">
        <div className="box">
          <div className="box-inner">
            <div className="box-front">
              <h2>Connect Anytime, Anywhere!</h2>
              <p>Our video conference app brings people closer with easy connectivity and affordability. Experience seamless virtual meetings, collaborate effortlessly, and stay connected across the globe.</p>
            </div>
            <div className="box-back">
              <h2>Your Passport to Seamless Communication!</h2>
              <p>Unlock effortless connectivity. Stay connected with colleagues, friends, and family, no matter where they are.</p>
            </div>
          </div>
        </div>

        <div className="about-cards">
          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title"><Groups2Icon /></Card.Title>
              <Card.Text className="about-card-text">Easy Group Conference! One virtual group hug at a time!</Card.Text>
            </Card.Body>
          </Card>
          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title"><CalendarMonthIcon /></Card.Title>
              <Card.Text className="about-card-text">Schedule Meets Anytime! You are the boss of your time!</Card.Text>
            </Card.Body>
          </Card>
          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title"><CurrencyRupeeIcon /></Card.Title>
              <Card.Text className="about-card-text">Free of Cost! High fives for freebies!</Card.Text>
            </Card.Body>
          </Card>
          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title"><StopCircleIcon /></Card.Title>
              <Card.Text className="about-card-text">Preserve discussions. Revisit & learn from every meeting.</Card.Text>
            </Card.Body>
          </Card>
          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title"><QuestionAnswerIcon /></Card.Title>
              <Card.Text className="about-card-text">In-Meet Chat Feature! Real-time collaboration made easy!</Card.Text>
            </Card.Body>
          </Card>
          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title"><BoltIcon /></Card.Title>
              <Card.Text className="about-card-text">Zooming through virtual space. Efficiently connecting dots!</Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>

      <div className="footer">
        <h2>Contact us @:</h2>
        <div className="footer-social-media">
          <GoogleIcon />
          <FacebookIcon />
          <InstagramIcon />
          <TwitterIcon />
        </div>
      </div>
    </div>
  );
};

export default Home;
