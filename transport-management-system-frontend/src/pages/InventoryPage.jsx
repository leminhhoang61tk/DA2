import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
    Box, Typography, Button, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, IconButton, Snackbar, Alert, MenuItem,
    FormControl, InputLabel, Select, Grid, Card, CardContent,
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import axios from 'axios';

const InventoryPage = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [warehouseItems, setWarehouseItems] = useState([]);
    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);
    const [transactionOpen, setTransactionOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [transferLoading, setTransferLoading] = useState(false);
    const [currentItem, setCurrentItem] = useState({
        warehouseId: '',
        itemId: '',
        quantity: '',
        position: ''
    });
    const [transaction, setTransaction] = useState({
        sourceWarehouseId: '',
        destinationWarehouseId: '',
        itemId: '',
        quantity: '',
        maxQuantity: 0,
        referenceId: '',
        notes: '',
        createdBy: 'admin'
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const generateUniqueId = () => {
        const timestamp = Date.now();
        const shortUuid = uuidv4().split('-')[0]; // Lấy phần đầu của UUID (8 ký tự)
        return `TR-${timestamp}-${shortUuid}`;
    };

    // Thiết lập interceptor cho Axios để xử lý lỗi
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                console.error('API Error:', error.response || error);
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, []); // 

    useEffect(() => {
        fetchWarehouses();
        fetchItems();
    }, []);

    useEffect(() => {
        if (selectedWarehouse) {
            fetchWarehouseItems(selectedWarehouse);
        }
    }, [selectedWarehouse]);

    const fetchWarehouses = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/warehouses');
            setWarehouses(response.data);
            if (response.data.length > 0 && !selectedWarehouse) {
                setSelectedWarehouse(response.data[0].id);
            }
        } catch (error) {
            console.error('Error fetching warehouses:', error);
            setSnackbar({
                open: true,
                message: 'Can not download the warehouse list',
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
            setSnackbar({
                open: true,
                message: 'Unable to download the product list',
                severity: 'error'
            });
        }
    };

    const fetchWarehouseItems = async (warehouseId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/inventory/warehouse/${warehouseId}/items`);
            setWarehouseItems(response.data);
        } catch (error) {
            console.error('Error fetching warehouse items:', error);
            setSnackbar({
                open: true,
                message: 'Unable to download product lists in the warehouse',
                severity: 'error'
            });
        }
    };

    // Hàm gửi giao dịch với xử lý lỗi tốt hơn
    const sendTransaction = async (payload) => {
        try {
            const response = await axios.post('http://localhost:8080/api/inventory/transactions', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            // Xử lý chi tiết các loại lỗi khác nhau
            if (error.response) {
                // Lỗi từ server với status code
                const status = error.response.status;
                const message = error.response.data.message || 'Error from the server';

                if (status === 400) {
                    throw new Error(`Invalid data: ${message}`);
                } else if (status === 404) {
                    throw new Error(`Unable to find resources: ${message}`);
                } else if (status === 500) {
                    throw new Error(`Server error: ${message}`);
                }

                throw new Error(`Error (${status}): ${message}`);
            } else if (error.request) {
                // Không nhận được phản hồi từ server
                throw new Error('No response from the server.Please check the network connection.');
            } else {
                // Lỗi khi thiết lập request
                throw new Error(`Error: ${error.message}`);
            }
        }
    }; // 

    const getWarehouseName = (warehouseId) => {
        const warehouse = warehouses.find(w => w.id === warehouseId);
        return warehouse ? warehouse.name : 'Unknown';
    };

    const handleWarehouseChange = (e) => {
        setSelectedWarehouse(e.target.value);
    };

    const handleOpen = (item = null) => {
        if (item) {
            setCurrentItem({
                id: item.id,
                warehouseId: item.warehouse.id,
                itemId: item.item.id,
                quantity: item.quantity,
                position: item.position || ''
            });
            setEditMode(true);
        } else {
            setCurrentItem({
                warehouseId: selectedWarehouse,
                itemId: '',
                quantity: '',
                position: ''
            });
            setEditMode(false);
        }
        setOpen(true);
    };

    const handleOpenTransaction = () => {
        setTransaction({
            sourceWarehouseId: selectedWarehouse,
            destinationWarehouseId: '',
            itemId: '',
            quantity: '',
            maxQuantity: 0,
            referenceId: generateUniqueId(),
            notes: '',
            createdBy: 'admin'
        });
        setTransactionOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTransactionClose = () => {
        setTransactionOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTransactionChange = (e) => {
        const { name, value } = e.target;

        // Nếu đang thay đổi itemId, cập nhật maxQuantity
        if (name === 'itemId') {
            const selectedItem = warehouseItems.find(item => item.item.id === parseInt(value));
            setTransaction(prev => ({
                ...prev,
                [name]: value,
                maxQuantity: selectedItem ? selectedItem.quantity : 0
            }));
        } else {
            setTransaction(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            // Tạo payload theo cấu trúc API mới
            const payload = {
                warehouseId: Number(currentItem.warehouseId),
                itemId: Number(currentItem.itemId),
                quantity: Number(currentItem.quantity),
                position: currentItem.position || ''
            };

            if (editMode) {
                await axios.put(`http://localhost:8080/api/inventory/warehouse-items/${currentItem.id}`, payload);
                setSnackbar({
                    open: true,
                    message: 'Update products in successful warehouse',
                    severity: 'success'
                });
            } else {
                await axios.post('http://localhost:8080/api/inventory/warehouse-items', payload);
                setSnackbar({
                    open: true,
                    message: 'Add products to successful warehouse',
                    severity: 'success'
                });
            }
            fetchWarehouseItems(selectedWarehouse);
            handleClose();
        } catch (error) {
            console.error('Error saving warehouse item:', error);
            setSnackbar({
                open: true,
                message: 'Error when saving product information in the warehouse',
                severity: 'error'
            });
        }
    };

    const handleTransactionSubmit = async () => {
        // Kiểm tra dữ liệu đầu vào
        if (!transaction.sourceWarehouseId || !transaction.destinationWarehouseId || !transaction.itemId || !transaction.quantity) {
            setSnackbar({
                open: true,
                message: 'Please fill in information',
                severity: 'warning'
            });
            return;
        }

        if (parseFloat(transaction.quantity) <= 0) {
            setSnackbar({
                open: true,
                message: 'The number must be greater than 0',
                severity: 'warning'
            });
            return;
        }

        if (parseFloat(transaction.quantity) > transaction.maxQuantity) {
            setSnackbar({
                open: true,
                message: 'The number of transfer cannot be greater than the current quantity',
                severity: 'warning'
            });
            return;
        }

        if (transaction.sourceWarehouseId === transaction.destinationWarehouseId) {
            setSnackbar({
                open: true,
                message: 'Source warehouse and destination warehouse cannot be the same',
                severity: 'warning'
            });
            return;
        }

        setTransferLoading(true);
        try {
            // Chuyển đổi dữ liệu sang số trước khi gửi đi
            const sourceWarehouseId = parseInt(transaction.sourceWarehouseId, 10);
            const destWarehouseId = parseInt(transaction.destinationWarehouseId, 10);
            const itemId = parseInt(transaction.itemId, 10);
            const quantity = parseFloat(transaction.quantity);

            // Bước 1: EXPORT từ kho nguồn
            const exportPayload = {
                warehouseId: sourceWarehouseId,
                itemId: itemId,
                quantity: quantity,
                transactionType: 'EXPORT',
                referenceId: `${transaction.referenceId}-OUT`,
                notes: `Move ${getWarehouseName(destWarehouseId)} - ${transaction.notes}`,
                createdBy: transaction.createdBy || 'system'
            };

            console.log('Sending export payload:', exportPayload);

            // Sử dụng try-catch riêng cho từng request để xử lý lỗi tốt hơn
            try {
                await sendTransaction(exportPayload);
            } catch (exportError) {
                throw new Error(`Error when exporting: ${exportError.message}`);
            } // 

            // Bước 2: IMPORT vào kho đích
            const importPayload = {
                warehouseId: destWarehouseId,
                itemId: itemId,
                quantity: quantity,
                transactionType: 'IMPORT',
                referenceId: `${transaction.referenceId}-IN`,
                notes: `IMPORT from the warehouse ${getWarehouseName(sourceWarehouseId)} - ${transaction.notes}`,
                createdBy: transaction.createdBy || 'system'
            };

            console.log('Sending import payload:', importPayload);

            try {
                await sendTransaction(importPayload);
            } catch (importError) {
                // Nếu import lỗi, cần thông báo và có thể cần rollback export
                console.error('Import failed, may need manual intervention:', importError);
                throw new Error(`Error when imported: ${importError.message}`);
            } // 

            // Làm mới dữ liệu sau khi chuyển kho thành công
            await fetchWarehouseItems(selectedWarehouse);

            setSnackbar({
                open: true,
                message: 'Successful warehouse transfer!',
                severity: 'success'
            });

            handleTransactionClose();
        } catch (error) {
            console.error('Error transferring item:', error);
            setSnackbar({
                open: true,
                message: error.message || 'The error is not determined when moving the warehouse',
                severity: 'error'
            });
        } finally {
            setTransferLoading(false);
        }
    }; // 

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ p: 3 }}>
            <div
                className="card-header bg-color custom-bg-text mt-2 mb-3 text-center"
                style={{
                    borderRadius: "1em",
                    height: "45px",
                }}
            >
                <h4 className="card-title">Inventory management</h4>
            </div>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Choose a warehouse</Typography>
                            <FormControl fullWidth>
                                <InputLabel>Warehouse</InputLabel>
                                <Select
                                    value={selectedWarehouse}
                                    onChange={handleWarehouseChange}
                                    label="Kho"
                                >
                                    {warehouses.map((warehouse) => (
                                        <MenuItem key={warehouse.id} value={warehouse.id}>
                                            {warehouse.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6">Action</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpen()}
                                    disabled={!selectedWarehouse}
                                >
                                    Add products to the warehouse
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<TransferWithinAStationIcon />}
                                    onClick={handleOpenTransaction}
                                    disabled={!selectedWarehouse}
                                >
                                    Transfer Warehouse
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mb: 2 }}>List of products in the warehouse</Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Product name</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {warehouseItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.item?.name || 'N/A'}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.position || 'N/A'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpen(item)}>
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {warehouseItems.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    There is no product in this warehouse
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog thêm/sửa sản phẩm trong kho */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editMode ? 'Update products in the warehouse' : 'Add products to the warehouse'}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Warehouse</InputLabel>
                        <Select
                            name="warehouseId"
                            value={currentItem.warehouseId}
                            onChange={handleChange}
                            label="Kho"
                        >
                            {warehouses.map((warehouse) => (
                                <MenuItem key={warehouse.id} value={warehouse.id}>
                                    {warehouse.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Product</InputLabel>
                        <Select
                            name="itemId"
                            value={currentItem.itemId}
                            onChange={handleChange}
                            label="Product"
                            disabled={editMode}
                        >
                            {items.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        margin="dense"
                        name="quantity"
                        label="Quantity"
                        type="number"
                        fullWidth
                        value={currentItem.quantity}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="dense"
                        name="position"
                        label="Location in the warehouse"
                        fullWidth
                        value={currentItem.position}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editMode ? 'Update ' : ' Add new'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog chuyển kho */}
            <Dialog open={transactionOpen} onClose={handleTransactionClose} maxWidth="md">
                <DialogTitle>Transfer of products between warehouses</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Source</InputLabel>
                        <Select
                            name="sourceWarehouseId"
                            value={transaction.sourceWarehouseId}
                            onChange={handleTransactionChange}
                            label="Source"
                        >
                            {warehouses.map((warehouse) => (
                                <MenuItem key={warehouse.id} value={warehouse.id}>
                                    {warehouse.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Destination warehouse</InputLabel>
                        <Select
                            name="destinationWarehouseId"
                            value={transaction.destinationWarehouseId}
                            onChange={handleTransactionChange}
                            label="Destination warehouse"
                        >
                            {warehouses.map((warehouse) => (
                                <MenuItem key={warehouse.id} value={warehouse.id} disabled={warehouse.id === parseInt(transaction.sourceWarehouseId)}>
                                    {warehouse.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Product</InputLabel>
                        <Select
                            name="itemId"
                            value={transaction.itemId}
                            onChange={handleTransactionChange}
                            label="Product"
                        >
                            {warehouseItems.map((item) => (
                                <MenuItem key={item.id} value={item.item.id}>
                                    {item.item.name} (Exist: {item.quantity})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        margin="dense"
                        name="quantity"
                        label={`Quantity (maximum: ${transaction.maxQuantity})`}
                        type="number"
                        fullWidth
                        value={transaction.quantity}
                        onChange={handleTransactionChange}
                        inputProps={{ max: transaction.maxQuantity }}
                        error={parseFloat(transaction.quantity) > transaction.maxQuantity}
                        helperText={parseFloat(transaction.quantity) > transaction.maxQuantity ? 'Số lượng vượt quá tồn kho' : ''}
                    />

                    <TextField
                        margin="dense"
                        name="referenceId"
                        label="Reference code"
                        fullWidth
                        value={transaction.referenceId}
                        onChange={handleTransactionChange}
                    />

                    <TextField
                        margin="dense"
                        name="notes"
                        label="Note"
                        fullWidth
                        multiline
                        rows={3}
                        value={transaction.notes}
                        onChange={handleTransactionChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleTransactionClose} disabled={transferLoading}>Cancel</Button>
                    <Button
                        onClick={handleTransactionSubmit}
                        variant="contained"
                        disabled={transferLoading ||
                            !transaction.sourceWarehouseId ||
                            !transaction.destinationWarehouseId ||
                            !transaction.itemId ||
                            !transaction.quantity ||
                            parseFloat(transaction.quantity) <= 0 ||
                            parseFloat(transaction.quantity) > transaction.maxQuantity}
                        startIcon={transferLoading ? <CircularProgress size={20} /> : <TransferWithinAStationIcon />}
                    >
                        {transferLoading ? 'Processing ...' : 'Transfer warehouse'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default InventoryPage;
