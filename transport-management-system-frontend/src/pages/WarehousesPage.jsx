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
    MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const WarehousesPage = () => {
    const [warehouses, setWarehouses] = useState([]);

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);


    const initialWarehouseState = {
        name: '',
        address: '',
        capacity: '',
        status: 'ACTIVE'
    };
    const [currentWarehouse, setCurrentWarehouse] = useState(initialWarehouseState);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });


    const [loading, setLoading] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [warehouseToDelete, setWarehouseToDelete] = useState(null);

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/warehouses');
            setWarehouses(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
            setSnackbar({
                open: true,
                message: 'Error when downloading warehouse data',
                severity: 'error'
            });
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditMode(false);
        setCurrentWarehouse(initialWarehouseState);
        setOpen(true);
    };


    const handleEdit = (warehouse) => {
        setEditMode(true);
        setCurrentWarehouse(warehouse);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {

        if (!currentWarehouse.name || !currentWarehouse.address) {
            setSnackbar({
                open: true,
                message: 'Please enter the full warehouse name and address',
                severity: 'error'
            });
            return;
        }

        if (currentWarehouse.capacity && (isNaN(currentWarehouse.capacity) || currentWarehouse.capacity <= 0)) {
            setSnackbar({
                open: true,
                message: 'The right capacity is positive',
                severity: 'error'
            });
            return;
        }

        try {

            const warehouseData = {
                name: currentWarehouse.name,
                address: currentWarehouse.address,
                capacity: Number(currentWarehouse.capacity),
                status: currentWarehouse.status || "ACTIVE"
            };

            console.log('Sending warehouse data:', warehouseData);

            if (editMode) {
                await axios.put(`http://localhost:8080/api/warehouses/${currentWarehouse.id}`, warehouseData);
                setSnackbar({
                    open: true,
                    message: 'Successful warehouse update',
                    severity: 'success'
                });
            } else {
                await axios.post('http://localhost:8080/api/warehouses', warehouseData);
                setSnackbar({
                    open: true,
                    message: 'Add a new successful warehouse',
                    severity: 'success'
                });
            }

            setOpen(false);
            fetchWarehouses();
            setCurrentWarehouse(initialWarehouseState);
        } catch (error) {
            console.error('Error saving warehouse:', error);

            // Log chi tiết lỗi
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
                console.error('Error headers:', error.response.headers);
            }

            setSnackbar({
                open: true,
                message: `Error when saving warehouse: ${error.response?.data?.message || error.message}`,
                severity: 'error'
            });
        }
    };


    const handleDelete = (id) => {
        setWarehouseToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/warehouses/${warehouseToDelete}`);
            setSnackbar({
                open: true,
                message: 'Delete successful warehouses',
                severity: 'success'
            });
            fetchWarehouses();
        } catch (error) {
            console.error('Error deleting warehouse:', error);
            setSnackbar({
                open: true,
                message: 'Error when deleting warehouse',
                severity: 'error'
            });
        } finally {
            setDeleteDialogOpen(false);
            setWarehouseToDelete(null);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentWarehouse({
            ...currentWarehouse,
            [name]: value
        });
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
                    <h4 className="card-title">Warehouse Management</h4>
                </div>


                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAdd}
                    >
                        Add warehouse
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
                                    <TableCell>Warehouse name</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Capacity</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {warehouses.length > 0 ? (
                                    warehouses.map((warehouse) => (
                                        <TableRow key={warehouse.id}>
                                            <TableCell>{warehouse.id}</TableCell>
                                            <TableCell>{warehouse.name}</TableCell>
                                            <TableCell>{warehouse.address}</TableCell>
                                            <TableCell>{warehouse.capacity}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={
                                                        warehouse.status === 'ACTIVE' ? 'Active' :
                                                            warehouse.status === 'INACTIVE' ? 'Inactive' : 'Maintenance'
                                                    }
                                                    color={
                                                        warehouse.status === 'ACTIVE' ? 'success' :
                                                            warehouse.status === 'INACTIVE' ? 'error' : 'warning'
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleEdit(warehouse)} color="primary">
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleDelete(warehouse.id)} color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            No warehouse data
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>


            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? 'Edit warehouse' : 'Add new warehouse'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Warehouse name"
                        fullWidth
                        value={currentWarehouse.name || ''}
                        onChange={handleInputChange}
                        required
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        name="address"
                        label="Address"
                        fullWidth
                        value={currentWarehouse.address || ''}
                        onChange={handleInputChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="capacity"
                        label="Capacity"
                        type="number"
                        fullWidth
                        value={currentWarehouse.capacity || ''}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={currentWarehouse.status || 'ACTIVE'}
                            onChange={handleInputChange}
                            label="Status"
                        >
                            <MenuItem value="ACTIVE">Active</MenuItem>
                            <MenuItem value="INACTIVE">Inactive</MenuItem>
                            <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                        </Select>
                    </FormControl>
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
                    <Typography>Are you sure you want to delete this warehouse?</Typography>
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

export default WarehousesPage;
