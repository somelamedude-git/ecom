const { asyncHandler } = require("../utils/asyncHandler");
const { Buyer, Seller } = require('../models/user.models')
const { Order } = require('../models/order.models')
const { Product } = require('../models/product.models');
const { ApiError } = require("../utils/ApiError");
const { handleTransaction } = require('../utils/handleTransaction');
const mongoose = require('mongoose');

const addOrder = asyncHandler(async (req, res) => {
    const { productId, quantity, size } = req.body;
    const customerId = req.user._id;

    if (!customerId || !productId) {
        throw new ApiError(404, 'Bad request');
    }

    const result = await handleTransaction(async (session) => {
        const customer = await Buyer.findById(customerId).session(session);
        const product = await Product.findById(productId).session(session);

        if (!product || !customer) {
            throw new ApiError(404, 'Product or customer not found');
        }

        const product_owner = await Seller.findById(product.owner).session(session);

        if (!product.stock.has(size)) {
            throw new ApiError(400, 'Invalid size selected');
        }

        const available = product.stock.get(size);
        if (available - quantity < 0 || quantity < 1) {
            throw new ApiError(400, 'Invalid quantity');
        }

        const total = product.price * quantity;

        const order = new Order({
            customer: customerId,
            product: productId,
            quantity,
            total,
            size,
        });

        product_owner.order_quo.push(order._id);
        customer.cart = customer.cart.filter(item => item.product.toString() !== productId);
        customer.orderHistory.push([order._id]);

        product.average_age_customers = (
            (product.average_age_customers * product.times_ordered + customer.age) /
            (product.times_ordered + 1)
        );
        product.times_ordered++;

        await order.save({ session });
        await product.save({ session });
        await customer.save({ session });
        await product_owner.save({ session });

        return order;
    });

    return res.status(201).json({
        status: true,
        message: `Order ${result._id} placed`,
        order: result
    });
});

const addOrderFromCart = asyncHandler(async (req, res) => {
    const customerId = req.user._id;

    const customer = await Buyer.findById(customerId);

    if (!customer || !customer.cart || customer.cart.length === 0)
        return res.status(404).json({ status: false, message: "Cart is empty or customer not found" });

    const errors = [];
    const successOrders = [];

    const result = await handleTransaction(async (session) => {
        // Process each cart item
        for (const item of customer.cart) {
            try {
                const product = await Product.findById(item.product).session(session);
                
                if (!product || product.stock.get(item.size) < item.quantity) {
                    errors.push({ product: item.product, message: "Insufficient stock or product not found" });
                    continue;
                }

                const currentQuantity = product.stock.get(item.size);
                const total = item.quantity * product.price;

                // Update product analytics
                product.average_age_customers = (((product.average_age_customers * product.times_ordered) + customer.age) / (product.times_ordered + 1));
                product.times_ordered++;
                
                // Update stock
                product.stock.set(item.size, currentQuantity - item.quantity);

                // Create order
                const order = new Order({
                    customer: customerId,
                    product: product._id,
                    quantity: item.quantity,
                    size: item.size,
                    total
                });

                await product.save({ session });
                await order.save({ session });

                successOrders.push(order._id);

                // Update seller's order queue
                const seller = await Seller.findById(product.owner).session(session);
                if (seller) {
                    seller.order_quo.push(order._id);
                    await seller.save({ session });
                }
            } catch (error) {
                console.error('Error processing cart item:', error);
                errors.push({ product: item.product, message: "Error processing item" });
            }
        }

        // Clear cart and update order history
        customer.cart = [];
        customer.orderHistory.push(successOrders);
        await customer.save({ session });

        return { successOrders, errors };
    });

    return res.status(201).json({
        status: true,
        message: "Order processing completed",
        ordersPlaced: successOrders.length,
        errors,
        successOrders,
        result
    });
});

const cancelOrder = asyncHandler(async(req, res) => {
    const {orderId} = req.query;
    const customerId = req.user._id;

    const result = await handleTransaction(async (session) => {
        const order = await Order.findById(orderId).session(session)
        const customer = await Buyer.findById(customerId).session(session)

        if(!order || !customer || order.customer.toString() !== customerId.toString())
            throw new ApiError(404, "Order not found")
        if(order.status !== 'pending')
            throw new ApiError(401, "Cannot cancel order in current status")
        
        order.status = 'cancelled'
        await order.save({session})

        const product = await Product.findById(order.product).session(session)
        if(!product)
            throw new ApiError(404, "Product not found")
        
        const current_stock = product.stock.get(order.size);
        product.stock.set(order.size, current_stock + order.quantity)

        await product.save({session})
        return order;
    })
    return res.status(200).json({status: true, message: "Order cancelled", result})
})

const schedule_return = asyncHandler(async (req, res) => {
    const { orderId } = req.query;
    const customerId = req.user._id;

    const result = await handleTransaction(async (session) => {
        const order = await Order.findById(orderId)
            .select('status customer product')
            .populate('product')
            .session(session);

        const customer = await Buyer.findById(customerId).session(session);

        if (!order || !customer || order.customer.toString() !== customerId.toString())
            throw new ApiError(404, 'Order not found');

        if (order.status !== 'delivered')
            throw new ApiError(400, 'Order must be delivered to schedule return');

        if (!order.product)
            throw new ApiError(500, 'Product data not found');

        order.status = 'schedule_return';
        order.product.times_returned++;

        await order.save({ session });
        await order.product.save({ session });

        return order;
    });

    return res.status(200).json({
        status: true,
        message: `Order ${orderId} scheduled for return`,
        result
    });
});

const approve_return = asyncHandler(async (req, res) => {
    const {orderId} = req.query;

    const order = await Order.findById(orderId)

    if(!order)
        return res.status(404).json({status: false, message: "Order not found"})

    if(order.status !== 'schedule_return')
        return res.status(400).json({status: false, message: "Order not scheduled for return"})

    order.status = 'approve_return'
    await order.save()

    return res.status(200).json({status: true, message: `Order ${orderId} approved for return`})
})

const returned = asyncHandler(async(req, res) => {
    const {orderId} = req.query;

    const order = await Order.findById(orderId)

    if(!order)
        return res.status(404).json({status: false, message: "Order not found"})

    if(order.status !== 'approve_return')
        return res.status(400).json({status: false, message: "Order not approved for return"})

    order.status = 'returned'
    await order.save()

    return res.status(200).json({status: true, message: `Order ${orderId} returned`})
})

const reached_return = asyncHandler(async(req, res) => {
    const {orderId} = req.query;

    const result = await handleTransaction(async (session) => {
        const order = await Order.findById(orderId).session(session)

        if(!order)
            throw new ApiError(404, "Order not found")

        if(order.status !== 'returned')
            throw new ApiError(400, "Order not in returned status")

        order.status = 'reached_return'
        await order.save({session})

        const product = await Product.findById(order.product).session(session)
        if (!product)
            throw new ApiError(404, "Product not found")
            
        const currentStock = product.stock.get(order.size) || 0;
        product.stock.set(order.size, currentStock + order.quantity);

        await product.save({session})
        return order;
    })

    return res.status(200).json({status: true, message: `Order ${orderId} reached seller`, result})
})

const shipped = asyncHandler(async(req, res) => {
    const {orderId} = req.query;

    const order = await Order.findById(orderId)

    if(!order)
        return res.status(404).json({status: false, message: "Order not found"})

    if(order.status !== 'confirmed')
        return res.status(400).json({status: false, message: "Order not confirmed yet"})

    order.status = 'shipped'
    await order.save()

    return res.status(200).json({status: true, message: `Order ${orderId} shipped`})
})

const orderConfirmed = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json({ status: false, message: "Order not found" });
    }

    const product = await Product.findById(order.product);
    if (!product) {
        return res.status(404).json({ status: false, message: "Product not found" });
    }

    const { size, quantity } = order;
    const available = product.stock.get(size);

    if (available === undefined) {
        return res.status(400).json({ status: false, message: "Invalid size" });
    }

    if (available < quantity) {
        return res.status(400).json({ status: false, message: "Not enough stock" });
    }

    order.status = "confirmed";
    product.stock.set(size, available - quantity);

    await Promise.all([order.save(), product.save()]);

    return res.status(200).json({ status: true, order });
});

module.exports = {
    addOrder,
    addOrderFromCart,
    cancelOrder,
    schedule_return,
    approve_return,
    returned,
    reached_return,
    shipped,
    orderConfirmed
}