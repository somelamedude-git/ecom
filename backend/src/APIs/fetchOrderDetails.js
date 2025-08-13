const { asyncHandler } = require('../utils/asyncHandler');
const { Order } = require('../models/order.models');
const { Buyer } = require('../models/user.models');

const fetchOrderDetails = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user._id;

    try {
        // Find order and populate product details
        const order = await Order.findById(orderId)
            .populate({
                path: 'product',
                select: 'name price productImages color'
            })
            .populate({
                path: 'customer',
                select: 'name email phone_number'
            });

        if (!order) {
            return res.status(404).json({
                status: false,
                message: "Order not found"
            });
        }

        if (order.customer._id.toString() !== userId.toString()) {
            return res.status(403).json({
                status: false,
                message: "Unauthorized access"
            });
        }

        const orderDetails = {
            orderId: order._id,
            orderNumber: `ORD-${new Date(order.createdAt).getFullYear()}-${order._id.toString().slice(-4).toUpperCase()}`,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            customer: {
                name: order.customer.name,
                email: order.customer.email,
                phone: order.customer.phone_number
            },
            product: {
                id: order.product._id,
                name: order.product.name,
                price: order.product.price,
                image: order.product.productImages,
                color: order.product.color
            },
            quantity: order.quantity,
            size: order.size,
            total: order.total,
            paymentVerified: order.paymentVerified,
            paymentId: order.paymentId,
            razorpayOrderId: order.razorpayOrderId
        };

        return res.status(200).json({
            status: true,
            order: orderDetails
        });

    } catch (error) {
        console.error('Error fetching order details:', error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
});

module.exports = {
    fetchOrderDetails
};