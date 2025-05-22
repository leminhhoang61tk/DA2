import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Paper, Divider, Grid, Card, CardContent,
  List, ListItem, ListItemText, IconButton, Snackbar, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import axios from 'axios';

const WarehouseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState(null);
  const [warehouseItems, setWarehouseItems] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchWarehouse();
    fetchWarehouseItems();
    fetchItems();
  }, [id]);

  const fetchWarehouse = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/warehouses/${id}`);
      setWarehouse(response.data);
    } catch (error) {
      console.error('Error fetching warehouse:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tải thông tin kho',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouseItems = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/inventory/warehouse/${id}/items`);
      setWarehouseItems(response.data);
    } catch (error) {
      console.error('Error fetching warehouse items:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tải danh sách sản phẩm trong kho',
        severity: 'error'
      });
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/warehouses/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa kho này?')) {
      try {
        await axios.delete(`http://localhost:8080/api/warehouses/${id}`);
        setSnackbar({
          open: true,
          message: 'Xóa kho thành công',
          severity: 'success'
        });
        setTimeout(() => {
          navigate('/warehouses');
        }, 2000);
      } catch (error) {
        console.error('Error deleting warehouse:', error);
        setSnackbar({
          open: true,
          message: 'Lỗi khi xóa kho',
          severity: 'error'
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Tìm tên sản phẩm từ ID
  const getItemName = (itemId) => {
    const item = items.find(item => item.id === itemId);
    return item ? item.name : 'N/A';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  if (!warehouse) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Không tìm thấy kho</Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/warehouses')}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/warehouses')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Chi tiết kho: {warehouse.name}</Typography>
        </Box>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />} 
            onClick={handleEdit}
            sx={{ mr: 1 }}
          >
            Chỉnh sửa
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />} 
            onClick={handleDelete}
          >
            Xóa
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Thông tin kho</Typography>
              <Divider sx={{ mb: 2 }} />
              <List dense>
                <ListItem>
                  <ListItemText primary="ID" secondary={warehouse.id} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Tên kho" secondary={warehouse.name} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Địa điểm" secondary={warehouse.location} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Sức chứa" secondary={warehouse.capacity} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Mô tả" secondary={warehouse.description || 'Không có mô tả'} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Sản phẩm trong kho</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<InventoryIcon />}
                  onClick={() => navigate('/inventory')}
                >
                  Quản lý tồn kho
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell>Số lượng</TableCell>
                      <TableCell>Vị trí</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {warehouseItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{getItemName(item.itemId)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.location || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                    {warehouseItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Không có sản phẩm nào trong kho này
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WarehouseDetailPage;
