const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const {} = require('./handlerFactory');
const Tour = require('../models/tourModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1. Get the currently booked tour
    const tour = await Tour.findById(req.params.tourID);

    // 2. Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourID,
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: tour.price * 100,
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [
                            `https://www.natours.dev/img/tours/${tour.imageCover}`,
                        ],
                    },
                },

                quantity: 1,
            },
        ],
    });

    // 3. Create session ad response
    res.status(200).json({
        status: 'success',
        session,
    });
});
