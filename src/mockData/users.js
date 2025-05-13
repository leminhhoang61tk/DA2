export const users = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@smartship.com',
        password: 'admin123', // Trong thực tế, mật khẩu phải được mã hóa
        role: 'admin',
        phone: '0901234567',
        avatar: '/assets/images/avatars/admin.jpg',
        department: 'Ban Giám đốc',
        joinDate: '2023-01-01',
    },
    {
        id: 2,
        name: 'Manager User',
        email: 'manager@smartship.com',
        password: 'manager123',
        role: 'manager',
        phone: '0912345678',
        avatar: '/assets/images/avatars/manager.jpg',
        department: 'Phòng Điều hành',
        joinDate: '2023-02-15',
    },
    {
        id: 3,
        name: 'Dispatcher User',
        email: 'dispatcher@smartship.com',
        password: 'dispatcher123',
        role: 'dispatcher',
        phone: '0923456789',
        avatar: '/assets/images/avatars/dispatcher.jpg',
        department: 'Phòng Điều phối',
        joinDate: '2023-03-10',
    },
    {
        id: 4,
        name: 'Driver User',
        email: 'driver@smartship.com',
        password: 'driver123',
        role: 'driver',
        phone: '0934567890',
        avatar: '/assets/images/avatars/driver.jpg',
        vehicleNumber: '51F-12345',
        licenseNumber: 'DL12345678',
        joinDate: '2023-04-05',
    },
    {
        id: 5,
        name: 'Customer User',
        email: 'customer@example.com',
        password: 'customer123',
        role: 'customer',
        phone: '0945678901',
        avatar: '/assets/images/avatars/customer.jpg',
        address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
        joinDate: '2023-05-20',
    },
];

// Hàm giả lập xác thực
export const authenticateUser = (email, password) => {
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        // Loại bỏ mật khẩu trước khi trả về thông tin người dùng
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
};