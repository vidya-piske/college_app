import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Space, ConfigProvider, Select, DatePicker } from 'antd';
import moment from 'moment';
import { TinyColor } from '@ctrl/tinycolor';
import './StudentPage.css'; 

const DepartmentTable = () => {
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
        code: '',
        name: '',
    });
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [deleteSuccessModalVisible, setDeleteSuccessModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false); // State to track form validation

    const handleRowClick = (record) => {
        setEditedValues({
          code: record.code,
          name: record.name,
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
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            sorter: (a, b) => a.code.localeCompare(b.code), // Enable sorting
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => `$${text}`,
            sorter: (a, b) => a.name - b.name, // Enable sorting
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
            code: record.code,
            name: record.name,
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
        code: item[1],
        name: item[2],
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
                code: editedValues.code,
                name: editedValues.name
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
                        code: editedValues.code,
                        name: editedValues.name,
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
              code: editedValues.code,
              name: editedValues.name,
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
          code: '',
          name: '',
        });
    };

    const handleCreateMenuClick = () => {
        // Reset editedValues state to empty values
        setEditedValues({
          code: '',
          name: '',
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

                  <p>Code:</p>
                          <Select value={editedValues.code} onChange={(value) => handleInputChange({ target: { value } }, 'code')} className='dropdown-width'>
                              <Option value="IT">IT</Option>
                              <Option value="CS">CS</Option>
                              <Option value="ECE">ECE</Option>
                          </Select>
                          <p>Name:</p>
                          <Select value={editedValues.name} onChange={(value) => handleInputChange({ target: { value } }, 'name')} className='dropdown-width'>
                              <Option value="it">Information Technology</Option>
                              <Option value="cs">Computer Science</Option>
                              <Option value="ece">Electrical and COmmunication Engineering</Option>
                          </Select>
                    </Modal>
                    <Button type="primary" size="large" onClick={() => handleCreateMenuClick()}>
                        + Create Department
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
                <p>Code: <Input value={editedValues.item_name} onChange={(e) => handleInputChange(e, 'item_name')} /></p>
                <p>Name: <Input value={editedValues.price} onChange={(e) => handleInputChange(e, 'price')} /></p>
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
                <p>Code: <Input value={editedValues.code} readOnly onChange={(e) => handleInputChange(e, 'code')} /></p>
                <p>Name: <Input value={editedValues.name} readOnly onChange={(e) => handleInputChange(e, 'name')} /></p>
            </Modal>

        </div>
    );
};

export default DepartmentTable;
