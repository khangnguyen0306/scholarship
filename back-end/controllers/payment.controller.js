import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import PayOS from "@payos/node";
import Auth from "../models/Auth.model.js";
import Subscription from "../models/Subscription.model.js";

dotenv.config();

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

process.env.TZ = "Asia/Ho_Chi_Minh";

// Tạo URL thanh toán nâng cấp Vip qua PayOS
export const createPayOSPayment = asyncHandler(async (req, res) => {
  const { amount, description } = req.body;
  const user = req.user;

  // Tạo orderCode duy nhất cho user (có thể dùng userId + timestamp)
  const orderCode = parseInt(user._id.toString().slice(-8), 16) + Math.floor(Date.now() / 1000);

  const body = {
    orderCode,
    amount: Math.round(amount),
    description: description || "Nâng cấp tài khoản Vip",
    items: [
      {
        name: "Gói Vip",
        quantity: 1,
        price: Math.round(amount)
      }
    ],
    cancelUrl: `${process.env.FRONTEND_URL}`,
    returnUrl: `${process.env.FRONTEND_URL}`,
    buyerName: user.firstName + " " + user.lastName,
    buyerEmail: user.email,
    expiredAt: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    // customData: { userId: user._id }
  };

  try {
    const paymentLinkRes = await payOS.createPaymentLink(body);

    // (Tuỳ chọn) Lưu lịch sử/subscription với trạng thái pending
    await Subscription.create({
      student: user._id,
      packageName: "VIP",
      startDate: new Date(),
      endDate: null,
      isActive: false,
      payosOrderCode: orderCode,
      payosTransactionId: paymentLinkRes.paymentLinkId
    });

    res.json({
      success: true,
      data: {
        paymentUrl: paymentLinkRes.checkoutUrl
      },
      message: "Tạo URL thanh toán thành công"
    });
  } catch (error) {
    res.status(500);
    throw new Error("Không thể tạo thanh toán PayOS: " + (error.response?.data?.desc || error.message));
  }
});

// Xử lý webhook từ PayOS (nâng cấp Vip)
export const handlePayOSWebhook = asyncHandler(async (req, res) => {
  try {
    // Xác thực webhook
    const webhookData = payOS.verifyPaymentWebhookData(req.body);

    if (!webhookData) {
      res.status(400);
      throw new Error("Invalid webhook data");
    }

    console.log('Webhook received:', req.body);
    console.log('WebhookData:', webhookData);

    // Tìm subscription theo orderCode
    const subscription = await Subscription.findOne({ payosOrderCode: webhookData.orderCode });
    if (!subscription) {
      res.status(404);
      throw new Error("Subscription not found");
    }

    console.log('Subscription:', subscription);

    // Nếu thanh toán thành công, cập nhật user và subscription
    if (webhookData.code === "00") {
      await Auth.findByIdAndUpdate(subscription.student, { isPremium: true });
      subscription.isActive = true;
      subscription.startDate = new Date();
      subscription.endDate = null; // hoặc tính toán thời hạn
      await subscription.save();
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500);
    throw new Error("Error processing webhook: " + error.message);
  }
}); 