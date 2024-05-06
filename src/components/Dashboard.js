import React from 'react';
import { Card } from 'antd';
import { IdcardOutlined, ApartmentOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate()
  const handleStudentClick = () => {
      navigate('/student')
  }
  const handleDepartmentClick = () =>{
      navigate('/department')
  }
  const handleSemesterClick = () => {
      navigate('/semester')
  }
  const handleFacultyClick = () => {
      navigate('/faculty')
  }
  return (
    <>
      <h1 style={{ marginBottom: '100px', display: 'flex', justifyContent: 'center' }}>College Admin Panel</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Card
            bordered={false}
            style={{
              width: 200,
              position: 'relative',
              backgroundColor: '#B989F7',
              color: 'white',
              marginRight: '16px',
              cursor: 'pointer'
            }}
            onClick={handleStudentClick}
          >
            <p style={{ color: 'white', margin: 0, fontSize: '16px' }}>Student</p>
            <IdcardOutlined style={{ fontSize: '24px', color: 'white' }} />
          </Card>
          <Card
            bordered={false}
            style={{
              width: 200,
              position: 'relative',
              backgroundColor: '#3FCCE3',
              color: 'white',
              cursor: 'pointer'
            }}
            onClick={handleDepartmentClick}
          >
            <p style={{ color: 'white', margin: 0, fontSize: '16px' }}>Department</p>
            <ApartmentOutlined style={{ fontSize: '24px', color: 'white' }} /> 
          </Card>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '20px' }}>
          <Card
            bordered={false}
            style={{
              width: 200,
              position: 'relative',
              backgroundColor: '#13C155',
              color: 'white',
              marginRight: '16px',
              cursor: 'pointer' 
            }}
            onClick={handleSemesterClick}
          >
            <p style={{ color: 'white', margin: 0, fontSize: '16px' }}>Semester</p>
            <CalendarOutlined style={{ fontSize: '24px', color: 'white' }} /> 
          </Card>
          <Card
            bordered={false}
            style={{
              width: 200,
              position: 'relative',
              backgroundColor: '#1ECAA3',
              color: 'white',
              cursor: 'pointer'
            }}
            onClick={handleFacultyClick}
          >
            <p style={{ color: 'white', margin: 0, fontSize: '16px' }}>Faculty</p>
            <TeamOutlined style={{ fontSize: '24px', color: 'white' }} />
          </Card>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
