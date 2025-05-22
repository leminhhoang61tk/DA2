import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
    Chip,
    Snackbar,
    Alert,
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ItemsPage = () => {
    // State cho danh sách sản phẩm
    const [items, setItems] = useState([]);

    // State cho dialog thêm/sửa sản phẩm
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // State cho sản phẩm hiện tại đang thao tác
    const initialItemState = {
        name: '',
        description: '',
        category: '',
        unit: '',
        unitPrice: 0,
        quantityInStock: 0,
        status: 'ACTIVE'
    };
    const [currentItem, setCurrentItem] = useState(initialItemState);

    // State cho thông báo
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    // State cho trạng thái loading
    const [loading, setLoading] = useState(false);

    // State cho dialog xác nhận xóa
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // State cho danh sách danh mục và đơn vị
    const [categories, setCategories] = useState([
        'Electronics', 'Food', 'Household Appliances', 'Fashion', 'Cosmetics', 'Other'
    ]);
    const [units, setUnits] = useState([
        'item', 'pieces', 'box', 'kg', 'package', 'liters', 'set'
    ]);

    // Fetch dữ liệu sản phẩm khi component mount
    useEffect(() => {
        fetchItems();
    }, []);

    // Hàm lấy danh sách sản phẩm từ API
    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/items');
            setItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching items:', error);
            setSnackbar({
                open: true,
                message: 'Error when downloading product data',
                severity: 'error'
            });
            setLoading(false);
        }
    };

    // Hàm mở dialog thêm sản phẩm mới
    const handleAdd = () => {
        setEditMode(false);
        setCurrentItem(initialItemState);
        setOpen(true);
    };

    // Hàm mở dialog sửa sản phẩm
    const handleEdit = (item) => {
        setEditMode(true);
        setCurrentItem(item);
        setOpen(true);
    };

    // Hàm đóng dialog
    const handleClose = () => {
        setOpen(false);
    };

    // Hàm xử lý khi submit form thêm/sửa sản phẩm
    const handleSubmit = async () => {
        // Kiểm tra dữ liệu trước khi gửi
        if (!currentItem.name) {
            setSnackbar({
                open: true,
                message: 'Please enter the product name',
                severity: 'error'
            });
            return;
        }

        if (!currentItem.category) {
            setSnackbar({
                open: true,
                message: 'Please select a product category',
                severity: 'error'
            });
            return;
        }

        if (!currentItem.unit) {
            setSnackbar({
                open: true,
                message: 'Please choose the unit',
                severity: 'error'
            });
            return;
        }

        try {
            // Tạo đúng cấu trúc dữ liệu theo yêu cầu API
            const itemData = {
                name: currentItem.name,
                description: currentItem.description || '',
                category: currentItem.category,
                unit: currentItem.unit,
                unitPrice: Number(currentItem.unitPrice) || 0,
                quantityInStock: Number(currentItem.quantityInStock) || 0,
                status: currentItem.status || 'ACTIVE'
            };

            console.log('Sending item data:', itemData);

            if (editMode) {
                await axios.put(`http://localhost:8080/api/items/${currentItem.id}`, itemData);
                setSnackbar({
                    open: true,
                    message: 'Successful product update',
                    severity: 'success'
                });
            } else {
                await axios.post('http://localhost:8080/api/items', itemData);
                setSnackbar({
                    open: true,
                    message: 'Add new products successfully',
                    severity: 'success'
                });
            }

            setOpen(false);
            fetchItems();
            setCurrentItem(initialItemState);
        } catch (error) {
            console.error('Error saving item:', error);

            // Log chi tiết lỗi
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
                console.error('Error headers:', error.response.headers);
            }

            setSnackbar({
                open: true,
                message: `Error when saving the product: ${error.response?.data?.message || error.message}`,
                severity: 'error'
            });
        }
    };

    // Hàm mở dialog xác nhận xóa
    const handleDelete = (id) => {
        setItemToDelete(id);
        setDeleteDialogOpen(true);
    };

    // Hàm xử lý xóa sản phẩm
    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/items/${itemToDelete}`);
            setSnackbar({
                open: true,
                message: 'Delete products successfully',
                severity: 'success'
            });
            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            setSnackbar({
                open: true,
                message: 'Error when deleting the product',
                severity: 'error'
            });
        } finally {
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    // Hàm đóng snackbar
    const handleSnackbarClose = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };

    // Hàm xử lý thay đổi giá trị trong form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem({
            ...currentItem,
            [name]: value
        });
    };

    // Định dạng giá tiền để hiển thị
    const formatPrice = (price) => {
        if (price === null || price === undefined) return '0 VND';
        return `${Number(price).toLocaleString()} VND`;
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <div
                    className="card-header bg-color custom-bg-text mt-2 mb-3 text-center"
                    style={{
                        borderRadius: "1em",
                        height: "45px",
                    }}
                >
                    <h4 className="card-title">Product management</h4>
                </div>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAdd}
                    >
                        Add product
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Product name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Unit</TableCell>
                                    <TableCell>Unit price (VND)</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.length > 0 ? (
                                    items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {item.name}
                                                </Typography>
                                                {item.description && (
                                                    <Typography variant="caption" color="textSecondary">
                                                        {item.description}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell>{item.unit}</TableCell>
                                            <TableCell>{formatPrice(item.unitPrice)}</TableCell>
                                            <TableCell>{item.quantityInStock}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={
                                                        item.status === 'ACTIVE' ? 'In stock' :
                                                            item.status === 'INACTIVE' ? 'Stop business' :
                                                                item.status === 'OUT_OF_STOCK' ? 'Out of stock' : 'Other'
                                                    }
                                                    color={
                                                        item.status === 'ACTIVE' ? 'success' :
                                                            item.status === 'INACTIVE' ? 'error' :
                                                                item.status === 'OUT_OF_STOCK' ? 'warning' : 'default'
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleEdit(item)} color="primary" size="small">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton onClick={() => handleDelete(item.id)} color="error" size="small">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            No product data
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>

            {/* Dialog thêm/sửa sản phẩm */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{editMode ? 'Product repair ' : ' Add new products'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                name="name"
                                label="Product name"
                                fullWidth
                                value={currentItem.name || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={currentItem.description || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={currentItem.category || ''}
                                    onChange={handleInputChange}
                                    label="Category"
                                    required
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Unit</InputLabel>
                                <Select
                                    name="unit"
                                    value={currentItem.unit || ''}
                                    onChange={handleInputChange}
                                    label="Unit"
                                    required
                                >
                                    {units.map((unit) => (
                                        <MenuItem key={unit} value={unit}>
                                            {unit}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                name="unitPrice"
                                label="Unit price (VND)"
                                type="number"
                                fullWidth
                                value={currentItem.unitPrice || 0}
                                onChange={handleInputChange}
                                InputProps={{
                                    inputProps: { min: 0 }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                name="quantityInStock"
                                label="Quantity in the warehouse"
                                type="number"
                                fullWidth
                                value={currentItem.quantityInStock || 0}
                                onChange={handleInputChange}
                                InputProps={{
                                    inputProps: { min: 0 }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="status"
                                    value={currentItem.status || 'ACTIVE'}
                                    onChange={handleInputChange}
                                    label="Status"
                                >
                                    <MenuItem value="ACTIVE">In stock</MenuItem>
                                    <MenuItem value="INACTIVE"> Stopping business </MenuItem>
                                    <MenuItem value="OUT_OF_STOCK">Out of stock</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog xác nhận xóa */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this product?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar thông báo */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ItemsPage;
