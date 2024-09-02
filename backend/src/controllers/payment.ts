// import { stripe } from "../app.js";
// import { TryCatch } from "../middlewares/error.js";
// import { Coupon } from "../models/coupon.js";
// import ErrorHandler from "../utils/utility-class.js";

// export const createPaymentIntent = TryCatch(async (req, res, next) => {
//   const { amount } = req.body;

//   if (!amount) return next(new ErrorHandler("Please enter amount", 400));

//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: Number(amount) * 100,
//     currency: "inr",
//   });

//   return res.status(201).json({
//     success: true,
//     clientSecret: paymentIntent.client_secret,
//   });
// });

// export const newCoupon = TryCatch(async (req, res, next) => {
//   const { code, amount } = req.body;

//   if (!code || !amount)
//     return next(new ErrorHandler("Please enter both coupon and amount", 400));

//   await Coupon.create({ code, amount });

//   return res.status(201).json({
//     success: true,
//     message: `Coupon ${code} Created Successfully`,
//   });
// });

// export const applyDiscount = TryCatch(async (req, res, next) => {
//   const { coupon } = req.query;

//   const discount = await Coupon.findOne({ code: coupon });

//   if (!discount) return next(new ErrorHandler("Invalid Coupon Code", 400));

//   return res.status(200).json({
//     success: true,
//     discount: discount.amount,
//   });
// });

// export const allCoupons = TryCatch(async (req, res, next) => {
//   const coupons = await Coupon.find({});

//   return res.status(200).json({
//     success: true,
//     coupons,
//   });
// });

// export const getCoupon = TryCatch(async (req, res, next) => {
//   const { id } = req.params;

//   const coupon = await Coupon.findById(id);

//   if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));

//   return res.status(200).json({
//     success: true,
//     coupon,
//   });
// });

// export const updateCoupon = TryCatch(async (req, res, next) => {
//   const { id } = req.params;

//   const { code, amount } = req.body;

//   const coupon = await Coupon.findById(id);

//   if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));

//   if (code) coupon.code = code;
//   if (amount) coupon.amount = amount;

//   await coupon.save();

//   return res.status(200).json({
//     success: true,
//     message: `Coupon ${coupon.code} Updated Successfully`,
//   });
// });

// export const deleteCoupon = TryCatch(async (req, res, next) => {
//   const { id } = req.params;

//   const coupon = await Coupon.findByIdAndDelete(id);

//   if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));

//   return res.status(200).json({
//     success: true,
//     message: `Coupon ${coupon.code} Deleted Successfully`,
//   });
// });




import Razorpay from "razorpay";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";

const razorpay = new Razorpay({
  key_id: 'rzp_test_IRmBqsIvqK7xXK',
  key_secret:'eMZ95X1i78u3USNwxCtA69m4',
});

export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { amount, isCOD } = req.body; // Adding isCOD to check for COD

  if (!amount) return next(new ErrorHandler("Please enter amount", 400));

  if (isCOD) {
    // Handle Cash on Delivery (COD) logic
    return res.status(201).json({
      success: true,
      message: "Order will be paid by Cash on Delivery",
      isCOD: true,
    });
  }

  // Existing Razorpay Payment Integration
  const options = {
    amount: Number(amount) * 100, // amount in the smallest currency unit
    currency: "INR",
    payment_capture: 1, // auto-capture after payment success
  };

  const order = await razorpay.orders.create(options);

  if (!order) return next(new ErrorHandler("Failed to create payment order", 500));

  return res.status(201).json({
    success: true,
    orderId: order.id,
  });
});


// export const newCoupon = TryCatch(async (req, res, next) => {
//   const { code, amount } = req.body;

//   if (!code || !amount)
//     return next(new ErrorHandler("Please enter both coupon and amount", 400));

//   const coupon = await Coupon.create({ code, amount });
//   console.log(coupon)
//   return res.status(201).json({
//     success: true,
//     message: `Coupon ${code} Created Successfully`,
//   });
// });

// export const applyDiscount = TryCatch(async (req, res, next) => {
//   const { coupon } = req.query;

//   const discount = await Coupon.findOne({ code: coupon });

//   if (!discount) return next(new ErrorHandler("Invalid Coupon Code", 400));

//   return res.status(200).json({
//     success: true,
//     discount: discount.amount,
//   });
// });

// export const allCoupons = TryCatch(async (req, res, next) => {
//   const coupons = await Coupon.find({});

//   return res.status(200).json({
//     success: true,
//     coupons,
//   });
// });

// export const getCoupon = TryCatch(async (req, res, next) => {
//   const { id } = req.params;

//   const coupon = await Coupon.findById(id);

//   if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));

//   return res.status(200).json({
//     success: true,
//     coupon,
//   });
// });

// export const updateCoupon = TryCatch(async (req, res, next) => {
//   const { id } = req.params;
//   const { code, amount } = req.body;

//   const coupon = await Coupon.findById(id);

//   if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));

//   if (code) coupon.code = code;
//   if (amount) coupon.amount = amount;

//   await coupon.save();

//   return res.status(200).json({
//     success: true,
//     message: `Coupon ${coupon.code} Updated Successfully`,
//   });
// });

// export const deleteCoupon = TryCatch(async (req, res, next) => {
//   const { id } = req.params;

//   const coupon = await Coupon.findByIdAndDelete(id);

//   if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));

//   return res.status(200).json({
//     success: true,
//     message: `Coupon ${coupon.code} Deleted Successfully`,
//   });
// });

