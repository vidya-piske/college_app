import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Space, ConfigProvider, Select, DatePicker } from 'antd';
import moment from 'moment';
import { TinyColor } from '@ctrl/tinycolor';
import './StudentPage.css'; 

const StudentTable = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [rowModalVisible, setRowModalVisible] = useState(false);
    const { Option } = Select;
    const [pagination, setPagination] = useState({
        pageSize: 4,
        current: 1,
    });
    const [editItem, setEditItem] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editedValues, setEditedValues] = useState({
        name: '',
        rollno: '',
        mobile: '',
        dob: '',
        department: '',
        year: '',
        incharge: ''
    });
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [deleteSuccessModalVisible, setDeleteSuccessModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false); // State to track form validation

    const handleRowClick = (record) => {
        setEditedValues({
          name: record.name,
          rollno: record.rollno,
          mobile: record.mobile,
          dob: record.dob,
          department: record.department,
          year: record.year,
          incharge: record.incharge,
        });
        setRowModalVisible(true);
    };

    const handleRowModalCancel = () => {
        setRowModalVisible(false);
    };

    // gradient button styling
    const colors2 = ['#fc6076', '#ff9a44', '#ef9d43', '#e75516'];
    const getHoverColors = (colors) =>
        colors.map((color) => new TinyColor(color).lighten(5).toString());
    const getActiveColors = (colors) =>
        colors.map((color) => new TinyColor(color).darken(5).toString());

    const fetchMenuData = () => {
        fetch('http://127.0.0.1:5000/api/menu')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then(data => {
                setMenuItems(data);
                setPagination(prevPagination => ({
                    ...prevPagination,
                    total: data.length // Update total based on fetched data
                }));
            })
            .catch(error => console.error('Error fetching menu data:', error));
    };

    useEffect(() => {
        fetchMenuData();
    }, []);

    const columns = [
        {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.item_name.localeCompare(b.item_name), // Enable sorting
        },
        {
            title: 'rollno',
            dataIndex: 'rollno',
            key: 'rollno',
            render: (text, record) => `$${text}`,
            sorter: (a, b) => a.rollno - b.rollno, // Enable sorting
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            key: 'mobile',
            sorter: (a, b) => a.mobile.localeCompare(b.mobile), // Enable sorting
        },
        {
            title: 'DOB',
            dataIndex: 'dob',
            key: 'dob',
            sorter: (a, b) => a.dob.localeCompare(b.dob), // Enable sorting
        },
        {
          title: 'Department',
          dataIndex: 'department',
          key: 'department',
          sorter: (a, b) => a.department.localeCompare(b.department), // Enable sorting
      },
      {
        title: 'Year',
        dataIndex: 'year',
        key: 'year',
        sorter: (a, b) => a.year.localeCompare(b.year), // Enable sorting
    },
    {
      title: 'Incharge',
      dataIndex: 'incharge',
      key: 'incharge',
      sorter: (a, b) => a.incharge.localeCompare(b.incharge), // Enable sorting
  },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div>
                    <Button.Group>
                        <Button type="link" style={{ backgroundColor: '#1890ff', color: '#fff' }} onClick={() => handleEdit(record)}>Edit</Button>
                        <Button type="link" style={{ backgroundColor: '#ff4d4f', color: '#fff' }} onClick={() => showDeleteModal(record.key)}>Delete</Button>
                    </Button.Group>
                </div>
            ),
        }                       
    ];

    const onPageChange = (page, pageSize) => {
        // Update pagination state
        setPagination(prevPagination => ({ ...prevPagination, current: page }));
    };

    const handleEdit = (record) => {
        setEditItem(record);
        setIsEditModalVisible(true);
        setEditedValues({
            item_name: record.item_name,
            price: record.price,
            description: record.description,
            category: record.category
        });
    };

    const showDeleteModal = (itemId) => {
        setDeleteItemId(itemId);
        setDeleteModalVisible(true);
    };
    

    const handleDeleteModalOk = () => {
        handleDelete();
        setDeleteModalVisible(false);
    };

    const handleDeleteModalCancel = () => {
        setDeleteModalVisible(false);
    };

    const handleDeleteSuccessModalOk = () => {
        setDeleteSuccessModalVisible(false);
    };

    const handleInputChange = (e, field) => {
      const value = e.target ? e.target.value : e; // Check if e has a target property
      setEditedValues(prevValues => ({
          ...prevValues,
          [field]: value
      }));
  };  

    const getRowClassName = (record, index) => {
        return index % 2 === 0 ? 'even-row' : 'odd-row';
    };

    const formattedMenuItems = menuItems.map(item => ({
        key: item[0], // Assuming the first element is the ID
        item_name: item[1],
        price: item[2],
        description: item[3],
        category: item[4]
    }));

    const filteredMenuItems = formattedMenuItems.filter(item =>
        Object.values(item).some(val =>
            val.toString().toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const handleEditModalOk = () => {
        setIsEditModalVisible(false);
        fetch(`http://127.0.0.1:5000/api/menu/update/${editItem.key}`, {
            method: 'PUT',
            body: JSON.stringify({
                item_name: editedValues.item_name,
                price: editedValues.price,
                description: editedValues.description,
                category: editedValues.category
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const updatedMenuItems = menuItems.map(item => {
                if (item.key === editItem.key) {
                    return {
                        ...item,
                        item_name: editedValues.item_name,
                        price: editedValues.price,
                        description: editedValues.description,
                        category: editedValues.category
                    };
                }
                return item;
            });
            setMenuItems(updatedMenuItems);
            fetchMenuData();
        })
        .catch(error => console.error('Error updating menu item:', error));
    };
    
    const handleDelete = () => {
        fetch(`http://127.0.0.1:5000/api/menu/delete/${deleteItemId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const updatedMenuItems = menuItems.filter(item => item.key !== deleteItemId);
            setMenuItems(updatedMenuItems);
            setDeleteSuccessModalVisible(true);
            fetchMenuData();
        })
        .catch(error => console.error('Error deleting menu item:', error));
    };
    
    const handleCreateModalOk = () => {
        // Call API to add a new menu item
        fetch('http://127.0.0.1:5000/api/menu/add', {
            method: 'POST',
            body: JSON.stringify({
                item_name: editedValues.item_name,
                price: editedValues.price,
                description: editedValues.description,
                category: editedValues.category
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Refresh menu items
            fetchMenuData();
            setCreateModalVisible(false); // Close the dialog box after adding the item
        })
        .catch(error => console.error('Error adding new menu item:', error));
    };
    
    // Function to handle cancellation of creating a new menu item
    const handleCreateModalCancel = () => {
        setCreateModalVisible(false); // Close the dialog box
        setEditedValues({
            item_name: '',
            price: '',
            description: '',
            category: ''
        });
    };

    const handleCreateMenuClick = () => {
        // Reset editedValues state to empty values
        setEditedValues({
            item_name: '',
            price: '',
            description: '',
            category: ''
        });
        // Open create menu dialog
        setCreateModalVisible(true);
    };

    return (    
        <div className="menu-page-container">
            <h2>All Menu Items</h2>
            <Space>
                <ConfigProvider
                    theme={{
                        components: {
                            Button: {
                                colorPrimary: `linear-gradient(90deg,  ${colors2.join(', ')})`,
                                colorPrimaryHover: `linear-gradient(90deg, ${getHoverColors(colors2).join(', ')})`,
                                colorPrimaryActive: `linear-gradient(90deg, ${getActiveColors(colors2).join(', ')})`,
                                lineWidth: 0,
                            },
                        },
                    }}
                >
                  <Modal
                      title="Create Item"
                      visible={createModalVisible}
                      onOk={handleCreateModalOk}
                      onCancel={handleCreateModalCancel}
                  >

                        <p>Name: <Input value={editedValues.name} onChange={(e) => handleInputChange(e, 'name')} /></p>
                        <p>Roll No: <Input value={editedValues.rollno} onChange={(e) => handleInputChange(e, 'rollno')} /></p>
                        <p>Mobile No: <Input value={editedValues.mobile} onChange={(e) => handleInputChange(e, 'mobile')} /></p>
                        <p>DOB:</p> 
                        <DatePicker value={editedValues.dob ? moment(editedValues.dob) : null} onChange={(date, dateString) => handleInputChange(dateString, 'dob')} style={{width: '100%'}}/>
                        <p>Department:</p>
                          <Select value={editedValues.department} onChange={(value) => handleInputChange({ target: { value } }, 'department')} className='dropdown-width'>
                              <Option value="IT">IT</Option>
                              <Option value="CS">CS</Option>
                              <Option value="ECE">ECE</Option>
                          </Select>
                      <p>Year:</p> 
                          <Select value={editedValues.year} onChange={(value) => handleInputChange({ target: { value } }, 'year')} className='dropdown-width'>
                              <Option value="First">First</Option>
                              <Option value="Second">Second</Option>
                              <Option value="Third">Third</Option>
                          </Select>
                      <p>Incharge:</p>
                          <Select value={editedValues.incharge} onChange={(value) => handleInputChange({ target: { value } }, 'incharge')} className='dropdown-width'>
                              <Option value="John Doe">John Doe</Option>
                              <Option value="Jane Doe">Jane Doe</Option>
                          </Select>
                    </Modal>
                    <Button type="primary" size="large" onClick={() => handleCreateMenuClick()}>
                        + Create Student
                    </Button>
                </ConfigProvider>
                <Input.Search
                    placeholder="Search..."
                    allowClear
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                />
            </Space>
            <Table
                dataSource={filteredMenuItems}
                columns={columns}
                pagination={{
                    ...pagination,
                    position: ['bottomCenter'],
                    onChange: onPageChange
                }}
                rowClassName={getRowClassName}
                bordered
                className="custom-table"
                headerClassName="custom-header"
                loading={!menuItems.length}
                onRow={(record) => ({
                    onClick: (event) => {
                        const isActionButtonClicked = event.target.closest('.ant-btn');
                        if (!isActionButtonClicked) {
                            handleRowClick(record);
                        }
                    }
                })}
            />

            <Modal
                title="Edit Item"
                visible={isEditModalVisible}
                onOk={handleEditModalOk}
                onCancel={() => setIsEditModalVisible(false)}
            >
                <p>Item Name: <Input value={editedValues.item_name} onChange={(e) => handleInputChange(e, 'item_name')} /></p>
                <p>Price: <Input value={editedValues.price} onChange={(e) => handleInputChange(e, 'price')} /></p>
                <p>Description: <Input value={editedValues.description} onChange={(e) => handleInputChange(e, 'description')} /></p>
                <p>Category: <Input value={editedValues.category} onChange={(e) => handleInputChange(e, 'category')} /></p>
            </Modal>

            <Modal
                title="Confirm Delete"
                visible={deleteModalVisible}
                onOk={handleDeleteModalOk}
                onCancel={handleDeleteModalCancel}
            >
                <p>Are you sure you want to delete this item?</p>
            </Modal>

            <Modal
                title="Delete Success"
                visible={deleteSuccessModalVisible}
                onOk={handleDeleteSuccessModalOk}
                onCancel={handleDeleteSuccessModalOk}
            >
                <p>Item deleted successfully!</p>
            </Modal>

            <Modal
                title="Row Details"
                visible={rowModalVisible}
                onCancel={handleRowModalCancel}
                footer={null}
            >
                <p>Item Name: <Input value={editedValues.item_name} readOnly onChange={(e) => handleInputChange(e, 'item_name')} /></p>
                <p>Price: <Input value={editedValues.price} readOnly onChange={(e) => handleInputChange(e, 'price')} /></p>
                <p>Description: <Input value={editedValues.description} readOnly onChange={(e) => handleInputChange(e, 'description')} /></p>
                <p>Category: <Input value={editedValues.category} readOnly onChange={(e) => handleInputChange(e, 'category')} /></p>
            </Modal>

        </div>
    );
};

export default StudentTable;
