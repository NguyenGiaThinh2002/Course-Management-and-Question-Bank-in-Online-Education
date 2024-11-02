
// import { Router } from 'express';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login/Login';
import AuthProvide from './context/AuthProvider';
import Home from './pages/home/Home';
import AppProvider from './context/AppProvider';
function App() {
  return (
    // style={{ backgroundColor: '#333' }}
    <div className="App" >
      <Router>
      <AuthProvide>
        <AppProvider>
        <Routes>
          <Route exact path="/" element={<Login/>}/>  
          <Route exact path="/home" element={<Home/>}/>
        </Routes>
        </AppProvider>
        </AuthProvide>
      </Router>
      {/* <Route path="/" exact component={Home} />
        <Route path="/classroom/:classroomId" component={Classroom} />
        <Route path="/lesson/:lessonId" component={Lesson} />
        <Route path="/assignment/:assignmentId" component={Assignment} />
        <Route component={NotFound} /> */}

    </div>
  );
}

export default App;
