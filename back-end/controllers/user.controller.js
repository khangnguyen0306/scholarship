import asyncHandler from "express-async-handler";
import Auth from "../models/Auth.model.js";
import generateToken from "../utils/GenerateToken.js";
import bcrypt from "bcryptjs";
import transporter from "../utils/MailserVices.js";
import { protect, admin } from "../middleware/authMiddleware.js";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API để quản lý người dùng và xác thực
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Xác thực người dùng và lấy token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Địa chỉ email của người dùng
 *               password:
 *                 type: string
 *                 description: Mật khẩu của người dùng
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     isEmailVerified:
 *                       type: boolean
 *                     isPremium:
 *                       type: boolean
 *                     token:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: ""
 *       401:
 *         description: Sai tài khoản hoặc mật khẩu, hoặc Email chưa được xác thực
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sai tài khoản hoặc mật khẩu vui lòng thử lại ! or Email chưa được xác thực. Vui lòng kiểm tra email của bạn."
 */
// @desc    Xác thực người dùng và lấy token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Tìm người dùng theo email
  const user = await Auth.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    // Thêm kiểm tra block
    if (user.isBlocked) {
      res.status(403);
      throw new Error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin.");
    }
    // Thêm kiểm tra xác thực email
    if (!user.isEmailVerified) {
      res.status(401);
      throw new Error("Email chưa được xác thực. Vui lòng kiểm tra email của bạn.");
    }
    // Nếu là mentor, chỉ cho đăng nhập khi đã được duyệt
    if (user.role === 'mentor' && user.mentorStatus !== 'approved') {
      res.status(403);
      throw new Error(
        user.mentorStatus === 'pending'
          ? "Tài khoản mentor của bạn đang chờ admin duyệt. Vui lòng quay lại sau."
          : "Tài khoản mentor của bạn đã bị từ chối. Vui lòng liên hệ admin để biết thêm chi tiết."
      );
    }
    res.json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPremium: user.isPremium,
        token: generateToken(user._id),
        profileImage: user.profileImage,
        firstName: user.firstName,
        lastName: user.lastName
      },
      message: "Đăng nhập thành công"
    });
  } else {
    res.status(401);
    throw new Error("Sai tài khoản hoặc mật khẩu vui lòng thử lại !");
  }
});

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 description: Địa chỉ email
 *               password:
 *                 type: string
 *                 description: Mật khẩu
 *               firstName:
 *                 type: string
 *                 description: Họ
 *               lastName:
 *                 type: string
 *                 description: Tên
 *     responses:
 *       201:
 *         description: Đăng ký thành công, email xác thực đã được gửi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     isEmailVerified:
 *                       type: boolean
 *                   description: Thông tin người dùng đã đăng ký (isEmailVerified sẽ là false)
 *                 message:
 *                   type: string
 *                   example: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản."
 *       400:
 *         description: Tài khoản đã tồn tại hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài khoản đã tồn tại or Dữ liệu tài khoản không hợp lệ"
 *       500:
 *         description: Lỗi gửi email xác thực (người dùng vẫn được tạo)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error sending verification email"
 */
// @desc    Đăng ký người dùng mới
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const userExists = await Auth.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Tài khoản đã tồn tại");
  }

  // Tạo token xác thực email
  const emailVerificationToken = Math.random().toString(36).substring(2) + Date.now().toString(36);

  const user = await Auth.create({
    email,
    passwordHash: password,
    firstName,
    lastName,
    role: 'student',
    isEmailVerified: false,
    emailVerificationToken
  });

  if (user) {
    // Gửi email xác thực
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${emailVerificationToken}`; 

    const mailOptions = {
      to: email,
      subject: "Xác thực địa chỉ email của bạn",
      text: `Chào ${firstName} ${lastName},\n\nVui lòng xác thực địa chỉ email của bạn bằng cách nhấp vào liên kết này:\n${verificationUrl}\n\n` + `Liên kết này sẽ hết hạn sau 1 giờ.`,
      html: `<p>Chào ${firstName} ${lastName},</p><p>Vui lòng xác thực địa chỉ email của bạn bằng cách nhấp vào liên kết này:</p><p><a href="${verificationUrl}">Xác thực Email</a></p><p>Liên kết này sẽ hết hạn sau 1 giờ.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Lỗi gửi email xác thực:", error); // Log lỗi gửi email
        // Tuy nhiên, vẫn tiếp tục đăng ký người dùng thành công ở đây,
        // có thể thêm logic để thử gửi lại email sau nếu cần.
      } else {
        console.log("Email xác thực đã gửi:", info.response);
      }
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified, // Vẫn trả về false
        token: generateToken(user._id)
      },
      message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản."
    });
  } else {
    res.status(400);
    throw new Error("Dữ liệu tài khoản không hợp lệ");
  }
});

/**
 * @swagger
 * /api/users/forgot-password:
 *   post:
 *     summary: Yêu cầu đặt lại mật khẩu (gửi mã xác thực qua email)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng yêu cầu đặt lại mật khẩu
 *     responses:
 *       200:
 *         description: Mã xác thực đã được gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mã xác thực đã được gửi đến email của bạn"
 *       404:
 *         description: Không tìm thấy tài khoản với email đã cung cấp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy tài khoản"
 *       500:
 *         description: Lỗi khi gửi email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error sending email"
 */
// @desc    Quên mật khẩu
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await Auth.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy tài khoản");
  }

  // Tạo mật khẩu mới ngẫu nhiên (8 ký tự)
  const newPassword = Math.random().toString(36).slice(-8);

  // Hash mật khẩu mới và lưu vào database
  user.passwordHash = newPassword;
  await user.save();

  // Gửi mật khẩu mới về email
  const mailOptions = {
    to: email,
    subject: "Mật khẩu mới của bạn",
    text: `Mật khẩu mới của bạn là: ${newPassword}\n\nVui lòng đăng nhập và đổi mật khẩu ngay sau khi đăng nhập để đảm bảo an toàn.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).json({ message: "Mật khẩu mới đã được gửi đến email của bạn" });
  });
});

/**
 * @swagger
 * /api/users/verify-code:
 *   post:
 *     summary: Xác thực mã để đặt lại mật khẩu
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *               code:
 *                 type: string
 *                 description: Mã xác thực nhận được qua email
 *     responses:
 *       200:
 *         description: Mã xác thực hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mã xác thực hợp lệ"
 *       400:
 *         description: Mã xác thực không hợp lệ hoặc đã hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mã xác thực không hợp lệ hoặc đã hết hạn"
 */
// @desc    Xác thực mã để đặt lại mật khẩu
// @route   POST /api/users/verify-code
// @access  Public
const verifyCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;
  const user = await Auth.findOne({ email });

  if (!user || user.verificationCode !== code || Date.now() > user.verificationCodeExpires) {
    res.status(400);
    throw new Error("Mã xác thực không hợp lệ hoặc đã hết hạn");
  }

  res.status(200).json({ message: "Mã xác thực hợp lệ" });
});

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu mới sau khi xác thực mã
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *               - verificationCode
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *               newPassword:
 *                 type: string
 *                 description: Mật khẩu mới
 *               verificationCode:
 *                 type: string
 *                 description: Mã xác thực đã nhận được và xác thực thành công
 *     responses:
 *       200:
 *         description: Mật khẩu đã được đặt lại thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mật khẩu đã được đặt lại thành công"
 *       400:
 *         description: Mã xác thực không hợp lệ hoặc đã hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mã xác thực không hợp lệ hoặc đã hết hạn"
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy người dùng"
 */
// @desc    Đặt lại mật khẩu
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, verificationCode } = req.body;
  const user = await Auth.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  // Kiểm tra mã xác thực và thời gian hết hạn
  if (user.verificationCode !== verificationCode || Date.now() > user.verificationCodeExpires) {
    res.status(400);
    throw new Error("Mã xác thực không hợp lệ hoặc đã hết hạn");
  }

  // Gán mật khẩu mới, model sẽ tự hash
  user.passwordHash = newPassword;

  // Xóa mã xác thực sau khi đặt lại mật khẩu
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công" });
});

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Đổi mật khẩu (yêu cầu xác thực)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *               oldPassword:
 *                 type: string
 *                 description: Mật khẩu cũ hiện tại
 *               newPassword:
 *                 type: string
 *                 description: Mật khẩu mới
 *     responses:
 *       200:
 *         description: Mật khẩu đã được thay đổi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mật khẩu đã được thay đổi thành công"
 *       401:
 *         description: Mật khẩu cũ không hợp lệ hoặc không có quyền truy cập (token không hợp lệ/hết hạn)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mật khẩu cũ không hợp lệ or Token không hợp lệ, không có quyền truy cập"
 *       403:
 *         description: Không có token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không có token, không có quyền truy cập"
 *       404:
 *         description: Không tìm thấy tài khoản
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy tài khoản"
 */
// @desc    Đổi mật khẩu
// @route   POST /api/users/change-password
// @access  Private (cần xác thực)
const changePassword = asyncHandler(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  const user = await Auth.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy tài khoản");
  }

  // Kiểm tra mật khẩu cũ
  if (!(await user.matchPassword(oldPassword))) {
    res.status(401);
    throw new Error("Mật khẩu cũ không hợp lệ");
  }

  // Gán mật khẩu mới, model sẽ tự hash
  user.passwordHash = newPassword;
  await user.save();

  res.status(200).json({ message: "Mật khẩu đã được thay đổi thành công" });
});

/**
 * @swagger
 * /api/users/verify-email/{token}:
 *   get:
 *     summary: Xác thực địa chỉ email người dùng bằng token
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token xác thực email nhận được qua email
 *     responses:
 *       200:
 *         description: Email đã được xác thực thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email của bạn đã được xác thực thành công!"
 *       400:
 *         description: Token xác thực không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token xác thực không hợp lệ"
 */
// @desc    Xác thực email người dùng
// @route   GET /api/users/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await Auth.findOne({
    emailVerificationToken: token
  });

  if (!user) {
    res.status(400);
    throw new Error("Token xác thực không hợp lệ");
  }

  if (user.isEmailVerified) {
    return res.status(409).json({
      success: false,
      errorCode: "EMAIL_ALREADY_VERIFIED",
      message: "Email đã được xác thực trước đó. Không thể xác thực lại."
    });
  }

  // Cập nhật trạng thái xác thực và xóa token
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;

  await user.save();

  res.status(200).json({ message: "Email của bạn đã được xác thực thành công!" });
});

/**
 * @swagger
 * /api/users/update-profile:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *               firstName:
 *                 type: string
 *                 example: "Nguyen"
 *               lastName:
 *                 type: string
 *                 example: "Van A"
 *               address:
 *                 type: string
 *                 example: "123 Đường ABC, Quận 1, TP.HCM"
 *               profileImage:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *               grades10:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     subject:
 *                       type: string
 *                     score:
 *                       type: number
 *                 example:
 *                   - subject: "Toán"
 *                     score: 8.5
 *                   - subject: "Văn"
 *                     score: 7.8
 *               grades11:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     subject:
 *                       type: string
 *                     score:
 *                       type: number
 *                 example:
 *                   - subject: "Toán"
 *                     score: 8.7
 *               grades12:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     subject:
 *                       type: string
 *                     score:
 *                       type: number
 *                 example:
 *                   - subject: "Toán"
 *                     score: 9.0
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     certificateType:
 *                       type: string
 *                     score:
 *                       type: number
 *                     date:
 *                       type: string
 *                       format: date
 *                 example:
 *                   - certificateType: "IELTS"
 *                     score: 7.0
 *                     date: "2023-05-01"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     address:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *                     grades10:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           subject:
 *                             type: string
 *                           score:
 *                             type: number
 *                     grades11:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           subject:
 *                             type: string
 *                           score:
 *                             type: number
 *                     grades12:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           subject:
 *                             type: string
 *                           score:
 *                             type: number
 *                     certificates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           certificateType:
 *                             type: string
 *                           score:
 *                             type: number
 *                           date:
 *                             type: string
 *                             format: date
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thông tin thành công"
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy người dùng"
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await Auth.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  // Cập nhật các trường cho phép
  user.phone = req.body.phone || user.phone;
  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.address = req.body.address || user.address;
  user.profileImage = req.body.profileImage || user.profileImage;

  // Cập nhật điểm và chứng chỉ nếu có truyền lên (nếu không truyền thì giữ nguyên)
  if (req.body.grades10 !== undefined) user.grades10 = req.body.grades10;
  if (req.body.grades11 !== undefined) user.grades11 = req.body.grades11;
  if (req.body.grades12 !== undefined) user.grades12 = req.body.grades12;
  if (req.body.certificates !== undefined) user.certificates = req.body.certificates;

  await user.save();

  res.status(200).json({
    success: true,
    data: {
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      profileImage: user.profileImage,
      grades10: user.grades10,
      grades11: user.grades11,
      grades12: user.grades12,
      certificates: user.certificates
    },
    message: "Cập nhật thông tin thành công"
  });
});

// Lấy danh sách tất cả user (chỉ admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await Auth.find({}, '_id email firstName lastName role isPremium isEmailVerified createdAt isBlocked updatedAt');
  res.json({ status: 200, message: "Lấy danh sách user thành công", data: users });
});

// Lấy profile user theo id
const getUserProfileById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await Auth.findById(id).select('-passwordHash -verificationCode -verificationCodeExpires -emailVerificationToken');
  if (!user) {
    return res.status(404).json({ status: 404, message: "Không tìm thấy người dùng" });
  }
  res.json({ status: 200, message: "Lấy thông tin user thành công", data: user });
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Admin cập nhật thông tin user bất kỳ
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của user cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [guest, student, mentor, admin]
 *               isPremium:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật user thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     role:
 *                       type: string
 *                     isPremium:
 *                       type: boolean
 *                 message:
 *                   type: string
 *                   example: "Cập nhật user thành công"
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy người dùng"
 */
// @desc    Admin cập nhật thông tin user bất kỳ
// @route   PUT /api/users/:id
// @access  Private/Admin
const adminUpdateUser = asyncHandler(async (req, res) => {
  const user = await Auth.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  // Chỉ cập nhật các trường cho phép
  user.firstName = req.body.firstName ?? user.firstName;
  user.lastName = req.body.lastName ?? user.lastName;
  user.email = req.body.email ?? user.email;
  user.role = req.body.role ?? user.role;
  user.isPremium = req.body.isPremium ?? user.isPremium;

  await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isPremium: user.isPremium,
    },
    message: "Cập nhật user thành công"
  });
});

/**
 * @swagger
 * /api/users/{id}/block:
 *   patch:
 *     summary: Admin khóa hoặc mở khóa user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của user cần block/unblock
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isBlocked:
 *                 type: boolean
 *                 description: true để khóa, false để mở khóa
 *     responses:
 *       200:
 *         description: Trạng thái block user đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     isBlocked:
 *                       type: boolean
 *                 message:
 *                   type: string
 *                   example: "User đã bị khóa"
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy người dùng"
 */
// @desc    Admin khóa/mở khóa user
// @route   PATCH /api/users/:id/block
// @access  Private/Admin
const adminBlockUser = asyncHandler(async (req, res) => {
  const user = await Auth.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  // Đảo trạng thái block
  user.isBlocked = !user.isBlocked;
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      isBlocked: user.isBlocked,
    },
    message: user.isBlocked ? "User đã bị khóa" : "User đã được mở khóa"
  });
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Admin tạo user mới
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - firstName
 *               - lastName
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [guest, student, mentor, admin]
 *               isPremium:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tạo user thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     role:
 *                       type: string
 *                     isPremium:
 *                       type: boolean
 *                 message:
 *                   type: string
 *                   example: "Tạo user thành công, mật khẩu đã gửi về email"
 *       400:
 *         description: Tài khoản đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài khoản đã tồn tại"
 */
// @desc    Admin tạo user mới
// @route   POST /api/users
// @access  Private/Admin
const adminCreateUser = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, role, isPremium } = req.body;
  const userExists = await Auth.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Tài khoản đã tồn tại");
  }
  // Tạo mật khẩu ngẫu nhiên
  const password = Math.random().toString(36).slice(-8);
  // Tạo user, tự động xác thực email
  const user = await Auth.create({
    email,
    passwordHash: password,
    firstName,
    lastName,
    role: role || 'student',
    isPremium: !!isPremium,
    isEmailVerified: true,
    isBlocked: false
  });
  // Gửi mật khẩu về email
  const mailOptions = {
    to: email,
    subject: "Tài khoản của bạn đã được tạo",
    text: `Xin chào ${firstName} ${lastName},\n\nTài khoản của bạn đã được admin tạo trên hệ thống.\n\nEmail: ${email}\nMật khẩu: ${password}\n\nVui lòng đăng nhập và đổi mật khẩu sau khi đăng nhập.`,
    html: `<p>Xin chào <b>${firstName} ${lastName}</b>,</p><p>Tài khoản của bạn đã được admin tạo trên hệ thống.</p><ul><li>Email: <b>${email}</b></li><li>Mật khẩu: <b>${password}</b></li></ul><p>Vui lòng đăng nhập và đổi mật khẩu sau khi đăng nhập.</p>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Lỗi gửi email tạo tài khoản:", error);
    }
  });
  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isPremium: user.isPremium
    },
    message: "Tạo user thành công, mật khẩu đã gửi về email"
  });
});

/**
 * @swagger
 * /api/users/register-mentor:
 *   post:
 *     summary: Đăng ký mentor mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - mentorProfile
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               mentorProfile:
 *                 type: object
 *                 properties:
 *                   major:
 *                     type: string
 *                   experience:
 *                     type: string
 *                   bio:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   degrees:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         institution:
 *                           type: string
 *                         year:
 *                           type: number
 *                   languages:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       201:
 *         description: Đăng ký mentor thành công, chờ admin duyệt
 *       400:
 *         description: Email đã tồn tại hoặc dữ liệu không hợp lệ
 */
export const registerMentor = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, mentorProfile } = req.body;
  if (!email || !password || !firstName || !lastName || !mentorProfile) {
    res.status(400);
    throw new Error("Thiếu thông tin bắt buộc");
  }
  const userExists = await Auth.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email đã tồn tại");
  }
  const newUser = await Auth.create({
    email,
    passwordHash: password,
    firstName,
    lastName,
    role: "mentor",
    mentorProfile,
    mentorStatus: "pending",
    isEmailVerified: false
  });
  res.status(201).json({
    success: true,
    data: {
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      mentorStatus: newUser.mentorStatus
    },
    message: "Đăng ký mentor thành công. Tài khoản của bạn sẽ được duyệt bởi admin trước khi sử dụng."
  });
});

/**
 * @swagger
 * /api/mentors:
 *   get:
 *     summary: Lấy danh sách mentor (có thể filter theo status)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Lọc theo trạng thái duyệt
 *     responses:
 *       200:
 *         description: Lấy danh sách mentor thành công
 */
export const getMentors = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { role: 'mentor' };
  if (status) filter.mentorStatus = status;
  const mentors = await Auth.find(filter).select('-passwordHash -verificationCode -verificationCodeExpires -emailVerificationToken');
  res.json({ status: 200, message: "Lấy danh sách mentor thành công", data: mentors });
});

/**
 * @swagger
 * /api/mentors/{id}/approve:
 *   put:
 *     summary: Admin duyệt mentor
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID mentor
 *     responses:
 *       200:
 *         description: Mentor đã được duyệt
 *       404:
 *         description: Không tìm thấy mentor
 */
export const approveMentor = asyncHandler(async (req, res) => {
  const mentor = await Auth.findById(req.params.id);
  if (!mentor || mentor.role !== 'mentor') {
    return res.status(404).json({ status: 404, message: "Không tìm thấy mentor" });
  }
  mentor.mentorStatus = 'approved';
  mentor.isEmailVerified = true;
  await mentor.save();

  // Gửi email thông báo chấp nhận
  if (mentor.email) {
    const mailOptions = {
      to: mentor.email,
      subject: "Chúc mừng! Hồ sơ mentor của bạn đã được duyệt",
      text: `Xin chào ${mentor.firstName || ''} ${mentor.lastName || ''},\n\nHồ sơ đăng ký mentor của bạn đã được admin duyệt thành công.\nBạn có thể đăng nhập và sử dụng các chức năng mentor trên hệ thống.\n\nTrân trọng!`,
      html: `<p>Xin chào <b>${mentor.firstName || ''} ${mentor.lastName || ''}</b>,</p><p>Hồ sơ đăng ký mentor của bạn đã được <b>admin duyệt thành công</b>!</p><p>Bạn có thể đăng nhập và sử dụng các chức năng mentor trên hệ thống.</p><p>Trân trọng!</p>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Lỗi gửi email duyệt mentor:", error);
      }
    });
  }

  res.json({ status: 200, message: "Mentor đã được duyệt", data: mentor });
});

/**
 * @swagger
 * /api/mentors/{id}/reject:
 *   put:
 *     summary: Admin từ chối mentor
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID mentor
 *     responses:
 *       200:
 *         description: Mentor đã bị từ chối
 *       404:
 *         description: Không tìm thấy mentor
 */
export const rejectMentor = asyncHandler(async (req, res) => {
  const mentor = await Auth.findById(req.params.id);
  if (!mentor || mentor.role !== 'mentor') {
    return res.status(404).json({ status: 404, message: "Không tìm thấy mentor" });
  }
  mentor.mentorStatus = 'rejected';
  await mentor.save();

  // Lý do từ chối từ admin (nếu có)
  const reason = req.body.reason || '';

  // Gửi email thông báo từ chối
  if (mentor.email) {
    const mailOptions = {
      to: mentor.email,
      subject: "Thông báo từ chối đăng ký mentor",
      text: `Xin chào ${mentor.firstName || ''} ${mentor.lastName || ''},\n\nChúng tôi rất tiếc phải thông báo rằng hồ sơ đăng ký mentor của bạn đã bị từ chối.\n${reason ? 'Lý do: ' + reason + '\n' : ''}Nếu cần thêm thông tin, vui lòng liên hệ admin.\n\nTrân trọng.`,
      html: `<p>Xin chào <b>${mentor.firstName || ''} ${mentor.lastName || ''}</b>,</p><p>Chúng tôi rất tiếc phải thông báo rằng hồ sơ đăng ký mentor của bạn đã <b>bị từ chối</b>.</p>${reason ? `<p><b>Lý do:</b> ${reason}</p>` : ''}<p>Nếu cần thêm thông tin, vui lòng liên hệ admin.</p><p>Trân trọng.</p>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Lỗi gửi email từ chối mentor:", error);
      }
    });
  }

  res.json({ status: 200, message: "Mentor đã bị từ chối", data: mentor });
});

export { authUser, registerUser, forgotPassword, verifyCode, resetPassword, changePassword, verifyEmail, updateProfile, getAllUsers, getUserProfileById, adminUpdateUser, adminBlockUser, adminCreateUser };
