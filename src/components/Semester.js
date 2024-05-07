import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Space, ConfigProvider, Select } from 'antd';
import { TinyColor } from '@ctrl/tinycolor';
import './StudentPage.css'; 

const SemesterTable = () => {
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
        year: '',
    });
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [deleteSuccessModalVisible, setDeleteSuccessModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [createModalVisible, setCreateModalVisible] = useState(false);

    const handleRowClick = (record) => {
        setEditedValues({
          year: record.year,
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
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
            sorter: (a, b) => a.year.localeCompare(b.year), // Enable sorting
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
          year: record.year,
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
        year: item[1],
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
              year: editedValues.year,
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
                        year: editedValues.year,
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
              year: editedValues.year,
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
          year: '',
        });
    };

    const handleCreateMenuClick = () => {
        // Reset editedValues state to empty values
        setEditedValues({
          year: '',
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

                  <p>Year:</p>
                          <Select value={editedValues.year} onChange={(value) => handleInputChange({ target: { value } }, 'year')} className='dropdown-width'>
                              <Option value="1">I I</Option>
                              <Option value="1">I II</Option>
                              <Option value="2">II I</Option>
                              <Option value="2">II II</Option>
                              <Option value="3">III I</Option>
                              <Option value="3">III II</Option>
                              <Option value="4">IV I</Option>
                              <Option value="4">IV II</Option>
                          </Select>
                    </Modal>
                    <Button type="primary" size="large" onClick={() => handleCreateMenuClick()}>
                        + Create Semester
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
                <p>Year: <Input value={editedValues.year} onChange={(e) => handleInputChange(e, 'year')} /></p>
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
                <p>Year: <Input value={editedValues.year} readOnly onChange={(e) => handleInputChange(e, 'year')} /></p>
            </Modal>

        </div>
    );
};

export default SemesterTable;
