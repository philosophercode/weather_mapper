// Load environment variables FIRST - this must be the first import
import './config/env.js';

import { createApp } from './app.js';

const PORT = process.env.PORT || 3000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

