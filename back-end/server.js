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

import cors from 'cors';


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



const specs = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));