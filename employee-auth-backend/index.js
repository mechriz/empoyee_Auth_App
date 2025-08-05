const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const metaRoutes = require('./routes/metaRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/meta', metaRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Employee Auth System Backend is Running');
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
