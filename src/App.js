import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SemesterTable from './components/Semester';
import Faculty from './components/Faculty';
import DepartmentTable from './components/Department';
import StudentTable from './components/Student';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Dashboard/>}/>
        <Route path='/student' element={<StudentTable/>}/>
        <Route path='/department' element={<DepartmentTable/>}/>
        <Route path='/semester' element={<SemesterTable/>}/>
        <Route path='/faculty' element={<Faculty/>}/>
      </Routes>
    </Router>
  );
}

export default App;
