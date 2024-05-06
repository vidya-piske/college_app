import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Semester from './components/Semester';
import Faculty from './components/Faculty';
import Department from './components/Department';
import Student from './components/Student';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Dashboard/>}/>
        <Route path='/student' element={<Student/>}/>
        <Route path='/department' element={<Department/>}/>
        <Route path='/semester' element={<Semester/>}/>
        <Route path='/faculty' element={<Faculty/>}/>
      </Routes>
    </Router>
  );
}

export default App;
