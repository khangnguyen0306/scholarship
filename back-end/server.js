import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import { createDefaultAdmin } from './utils/InitAccount.js';
import UserRoute from './routes/User.route.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './swaggerConfig.js';
import SchoolRoute from './routes/School.route.js';
import ScholarshipRoute from './routes/Scholarship.route.js';
import PaymentRoute from './routes/Payment.route.js';
import ScholarshipRequirementRoute from './routes/ScholarshipRequirement.route.js';
import CertificateTypeRoute from './routes/CertificateType.route.js';
import ScholarshipMatchRoute from './routes/Scholarship.match.route.js';
import BlogRoute from './routes/Blog.route.js';
import CommentRoute from './routes/Comment.route.js';
import ApplicationRoute from './routes/Application.route.js';
import MentorRoute from './routes/Mentor.route.js';
import cors from 'cors';
import MentorRequestRoute from './routes/mentorRequest.routes.js';
import ChatRoomRoute from './routes/chatRoom.routes.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Message from './models/Message.model.js';
import UploadRoute from './routes/upload.route.js';
import RatingRoute from './routes/rating.route.js';

// const { notFound, errorHandler } = require('./middleware/errorMiddleware');

        // import productRoutes from './routes/productRoutes.js';
// import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();
createDefaultAdmin();
app.use('/api/users', UserRoute);
app.use('/api/schools', SchoolRoute);
app.use('/api/scholarships', ScholarshipRoute);
app.use('/api/payments', PaymentRoute);
app.use('/api/scholarship-requirements', ScholarshipRequirementRoute);
app.use('/api/certificate-types', CertificateTypeRoute);
app.use('/api/scholarships', ScholarshipMatchRoute);
app.use('/api/blogs', BlogRoute);
app.use('/api/comments', CommentRoute);
app.use('/api/applications', ApplicationRoute);
app.use('/api/mentors', MentorRoute);
app.use('/api/mentor-requests', MentorRequestRoute);
app.use('/api/chat-rooms', ChatRoomRoute);
app.use('/api/upload', UploadRoute);
app.use('/api/ratings', RatingRoute);

const specs = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send_message', async (data) => {
    const { roomId, senderId, content, type = 'text', fileUrl, fileName, emoji } = data;
    const message = await Message.create({
      roomId,
      senderId,
      type,
      content,
      fileUrl,
      fileName,
      emoji
    });
    const populatedMsg = await message.populate('senderId', '_id');
    io.to(roomId).emit('receive_message', populatedMsg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));