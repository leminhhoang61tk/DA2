export const dashboardStats = {
    totalOrders: 1254,
    ordersToday: 48,
    pendingOrders: 156,
    deliveredOrders: 1035,
    totalRevenue: 1250000000,
    revenueToday: 45000000,
    activeDrivers: 12,
    totalCustomers: 845,
    totalProducts: 1245,
    avgDeliveryTime: 28, // in hours
};

export const revenueData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
        {
            label: 'Doanh thu 2025 (triệu VNĐ)',
            data: [95, 110, 125, 130, 140, 155, 160, 170, 185, 190, 200, 210],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        },
        {
            label: 'Doanh thu 2024 (triệu VNĐ)',
            data: [80, 90, 100, 110, 120, 130, 135, 145, 155, 165, 175, 185],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        },
    ],
};

export const orderStatusData = {
    labels: ['Đã giao', 'Đang vận chuyển', 'Đang xử lý', 'Đang chờ', 'Đã hủy'],
    datasets: [
        {
            data: [65, 15, 10, 5, 5],
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 99, 132, 0.6)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
        },
    ],
};

export const deliveryPerformance = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
        {
            label: 'Đúng hẹn (%)',
            data: [92, 93, 94, 91, 95, 96, 94, 95, 97, 96, 95, 98],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            yAxisID: 'y',
        },
        {
            label: 'Thời gian giao hàng trung bình (giờ)',
            data: [30, 29, 28, 30, 27, 26, 27, 26, 25, 26, 27, 24],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            yAxisID: 'y1',
        },
    ],
};

export const topDrivers = [
    {
        id: 1,
        name: 'Hoàng Minh Tuấn',
        deliveries: 342,
        onTimeRate: 98.2,
        rating: 4.8,
        avatar: null,
    },
    {
        id: 3,
        name: 'Trần Văn Công',
        deliveries: 189,
        onTimeRate: 97.5,
        rating: 4.9,
        avatar: null,
    },
    {
        id: 2,
        name: 'Nguyễn Thanh Bình',
        deliveries: 256,
        onTimeRate: 95.8,
        rating: 4.5,
        avatar: null,
    },
    {
        id: 4,
        name: 'Lê Thị Hương',
        deliveries: 124,
        onTimeRate: 94.3,
        rating: 4.7,
        avatar: null,
    },
    {
        id: 5,
        name: 'Phạm Minh Đức',
        deliveries: 98,
        onTimeRate: 93.1,
        rating: 4.6,
        avatar: null,
    },
];

export const topCustomers = [
    {
        id: 1,
        name: 'Công ty TNHH ABC',
        orders: 15,
        totalSpent: 25000000,
        lastOrder: '2025-04-20',
    },
    {
        id: 4,
        name: 'Công ty XYZ',
        orders: 10,
        totalSpent: 15000000,
        lastOrder: '2025-04-22',
    },
    {
        id: 3,
        name: 'Trần Thị B',
        orders: 7,
        totalSpent: 8500000,
        lastOrder: '2025-04-23',
    },
    {
        id: 2,
        name: 'Nguyễn Văn A',
        orders: 3,
        totalSpent: 2500000,
        lastOrder: '2025-04-21',
    },
    {
        id: 5,
        name: 'Phạm Thị D',
        orders: 2,
        totalSpent: 1800000,
        lastOrder: '2025-04-19',
    },
];

export const deliveryByRegion = {
    labels: ['TP.HCM', 'Bình Dương', 'Đồng Nai', 'Long An', 'Vũng Tàu', 'Khác'],
    datasets: [
        {
            data: [60, 15, 10, 5, 5, 5],
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(201, 203, 207, 0.6)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(201, 203, 207, 1)',
            ],
            borderWidth: 1,
        },
    ],
};

export default {
    dashboardStats,
    revenueData,
    orderStatusData,
    deliveryPerformance,
    topDrivers,
    topCustomers,
    deliveryByRegion,
};