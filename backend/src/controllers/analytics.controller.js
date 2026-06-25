const { Order, OrderItem, Product, Address, User } = require('../models');
const { Op } = require('sequelize');
const { sendOrderShippedEmail } = require('../services/email.service');

// Only for displaying orders to process....
const getAnalytics = async (req, res) => {
  try {
    const vendorId = req.user?.vendorId;

    if (!vendorId) {
      return res.status(403).json({
        error: 'Vendor access required',
      });
    }

    const orders = await Order.findAll({
      where: {
        [Op.or]: [
          {
            status: 'paid',
            payment_method: 'Stripe',
          },
          {
            status: 'unpaid',
            payment_method: 'COD',
          },
          {
            status: 'shipped',
          },
        ],
      },
      include: [
        {
          model: OrderItem,
          as: 'items',
          required: true,
          include: [
            {
              model: Product,
              as: 'product',
              where: { vendorId },
              attributes: ['id', 'name', 'price', 'image_urls', 'vendorId'],
            },
          ],
        },
        {
          model: Address,
          as: 'address',
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
      distinct: true,
    });

    // Concise the response body
    const formattedOrders = orders.map(order => {
      let vendorSubtotal = 0;
      const items = (order.items || []).map(item => {
        const itemPrice = parseFloat(item.price);
        const itemQuantity = item.quantity;
        const itemTotal = itemPrice * itemQuantity;
        vendorSubtotal += itemTotal;

        return {
          id: item.id,
          productId: item.productId,
          name: item.product?.name || 'Unknown Product',
          imageUrl: item.product?.imageUrl || '',
          quantity: itemQuantity,
          price: itemPrice,
          total: Number(itemTotal.toFixed(2)),
        };
      });

      return {
        id: order.id,
        createdAt: order.createdAt,
        status: order.status,
        paymentMethod: order.payment_method,
        customerName: order.user?.name || 'Guest Customer',
        customerEmail: order.user?.email || '',
        shippingAddress: order.address ? {
          fullName: order.address.fullName,
          phone: order.address.phone,
          addressLine1: order.address.addressLine1,
          addressLine2: order.address.addressLine2,
          city: order.address.city,
          state: order.address.state,
          postalCode: order.address.postalCode,
          country: order.address.country,
        } : null,
        items,
        vendorSubtotal: Number(vendorSubtotal.toFixed(2)),
      };
    });

    return res.status(200).json({
      success: true,
      orders: formattedOrders,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

const updateOrderStatus = async (req, res) => {
	const orderId = req.params.id;
	try {
		const order = await Order.findByPk(orderId);

		await order.update({status: 'shipped'})

		await order.save();

    // send inform email to customer
    const customer = await User.findByPk(order.userId)
    const customerAddress = await Address.findOne({
      where: {
        id: customer.id
      }, attributes: ['addressLine1']
    });

    await sendOrderShippedEmail(customer.email, orderId, customer.name, customerAddress.addressLine1);

		res.status(200).json({ success: true})
	} catch(err) {
		console.log(err);
		res.status(500).json({ error: "Internal server error"})
	}
}

module.exports = {getAnalytics, updateOrderStatus};