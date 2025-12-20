import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
// Increase JSON body limit to handle base64 image uploads from dashboard
// (set generously to avoid 413 errors even for base64 previews)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    logger.info('HTTP request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - startTime,
      ip: req.ip,
    });
  });
  next();
});

// Data files paths
const usersFile = path.join(__dirname, 'data', 'users.json');
const sellersFile = path.join(__dirname, 'data', 'sellers.json');
const packagesDir = path.join(__dirname, 'data', 'packages');
const reviewsFile = path.join(__dirname, 'data', 'reviews.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

if (!fs.existsSync(packagesDir)) {
  fs.mkdirSync(packagesDir, { recursive: true });
}

// Helper functions to read/write JSON files
const readUsersFile = () => {
  try {
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    logger.error('Error reading users file', { message: error.message });
    return [];
  }
};

const writeUsersFile = (data) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    logger.error('Error writing users file', { message: error.message });
  }
};

const readSellersFile = () => {
  try {
    if (fs.existsSync(sellersFile)) {
      const data = fs.readFileSync(sellersFile, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    logger.error('Error reading sellers file', { message: error.message });
    return [];
  }
};

const writeSellersFile = (data) => {
  try {
    fs.writeFileSync(sellersFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    logger.error('Error writing sellers file', { message: error.message });
  }
};

const readPackagesFile = (sellerId) => {
  try {
    const packageFile = path.join(packagesDir, `${sellerId}.json`);
    if (fs.existsSync(packageFile)) {
      const data = fs.readFileSync(packageFile, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    logger.error('Error reading packages file', { message: error.message, sellerId });
    return [];
  }
};

const writePackagesFile = (sellerId, data) => {
  try {
    const packageFile = path.join(packagesDir, `${sellerId}.json`);
    fs.writeFileSync(packageFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    logger.error('Error writing packages file', { message: error.message, sellerId });
  }
};

const readReviewsFile = () => {
  try {
    if (fs.existsSync(reviewsFile)) {
      const data = fs.readFileSync(reviewsFile, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    logger.error('Error reading reviews file', { message: error.message });
    return [];
  }
};

// Helper: find sellerId by packageId
const findSellerIdByPackageId = (packageId) => {
  try {
    const files = fs.readdirSync(packagesDir);
    for (const file of files) {
      const sellerId = path.basename(file, '.json');
      const packages = readPackagesFile(sellerId);
      if (packages.find(p => p.id === packageId)) {
        return sellerId;
      }
    }
  } catch (error) {
    logger.error('Error finding sellerId by packageId', { message: error.message, packageId });
  }
  return null;
};

const writeReviewsFile = (data) => {
  try {
    fs.writeFileSync(reviewsFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    logger.error('Error writing reviews file', { message: error.message });
  }
};

// ==================== CUSTOMER ROUTES ====================

// Register customer
app.post('/api/customers/register', (req, res) => {
  try {
    const { username, name, email, phone, password, confirmPassword } = req.body;

    // Validation
    if (!username || !name || !email || !phone || !password) {
      logger.warn('Customer register validation failed', { username, email });
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    if (password !== confirmPassword) {
      logger.warn('Customer register password mismatch', { username, email });
      return res.status(400).json({ error: 'Password tidak cocok' });
    }

    const users = readUsersFile();

    // Check if user already exists
    if (users.find(u => u.username === username)) {
      logger.warn('Customer register username already used', { username });
      return res.status(400).json({ error: 'Username sudah digunakan' });
    }

    if (users.find(u => u.email === email)) {
      logger.warn('Customer register email already used', { email });
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    // Create new user
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      name,
      email,
      phone,
      password, // In production, hash this!
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsersFile(users);
    logger.info('Customer registered', { userId: newUser.id, username });

    res.json({ 
      success: true, 
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    logger.error('Customer register failed', { message: error.message });
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Login customer
app.post('/api/customers/login', (req, res) => {
  try {
    const { username, password } = req.body;

    const users = readUsersFile();
    const user = users.find(u => u.username === username);

    if (!user) {
      logger.warn('Customer login username not found', { username });
      return res.status(401).json({ error: 'Username tidak ditemukan' });
    }

    if (user.password !== password) {
      logger.warn('Customer login wrong password', { username });
      return res.status(401).json({ error: 'Password salah' });
    }

    logger.info('Customer login success', { userId: user.id, username });
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    logger.error('Customer login failed', { message: error.message });
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// ==================== SELLER ROUTES ====================

// Register seller
app.post('/api/sellers/register', (req, res) => {
  try {
    const { username, storeName, email, phone, password, confirmPassword } = req.body;

    // Validation
    if (!username || !storeName || !email || !phone || !password) {
      logger.warn('Seller register validation failed', { username, email });
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    if (password !== confirmPassword) {
      logger.warn('Seller register password mismatch', { username, email });
      return res.status(400).json({ error: 'Password tidak cocok' });
    }

    const sellers = readSellersFile();

    // Check if seller already exists
    if (sellers.find(s => s.username === username)) {
      logger.warn('Seller register username already used', { username });
      return res.status(400).json({ error: 'Username sudah digunakan' });
    }

    if (sellers.find(s => s.email === email)) {
      logger.warn('Seller register email already used', { email });
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    // Create new seller
    const newSeller = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      storeName,
      email,
      phone,
      password, // In production, hash this!
      createdAt: new Date().toISOString()
    };

    sellers.push(newSeller);
    writeSellersFile(sellers);

    // Create default package for the seller
    const defaultPackage = {
      id: Math.random().toString(36).substr(2, 9),
      sellerId: newSeller.id,
      storeName: storeName,
      location: '',
      category: '',
      price: 0,
      originalValue: 0,
      available: 0,
      pickupTime: '',
      description: '',
      image: '',
      createdAt: new Date().toISOString()
    };

    writePackagesFile(newSeller.id, [defaultPackage]);
    logger.info('Seller registered', { sellerId: newSeller.id, username, storeName });

    res.json({
      success: true,
      seller: {
        id: newSeller.id,
        username: newSeller.username,
        storeName: newSeller.storeName,
        email: newSeller.email,
        phone: newSeller.phone,
        createdAt: newSeller.createdAt
      }
    });
  } catch (error) {
    logger.error('Seller register failed', { message: error.message });
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Login seller
app.post('/api/sellers/login', (req, res) => {
  try {
    const { username, password } = req.body;

    const sellers = readSellersFile();
    const seller = sellers.find(s => s.username === username);

    if (!seller) {
      logger.warn('Seller login username not found', { username });
      return res.status(401).json({ error: 'Username tidak ditemukan' });
    }

    if (seller.password !== password) {
      logger.warn('Seller login wrong password', { username });
      return res.status(401).json({ error: 'Password salah' });
    }

    logger.info('Seller login success', { sellerId: seller.id, username });
    res.json({
      success: true,
      seller: {
        id: seller.id,
        username: seller.username,
        storeName: seller.storeName,
        email: seller.email,
        phone: seller.phone,
        createdAt: seller.createdAt
      }
    });
  } catch (error) {
    logger.error('Seller login failed', { message: error.message });
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get seller packages
app.get('/api/sellers/:sellerId/packages', (req, res) => {
  try {
    const packages = readPackagesFile(req.params.sellerId);
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Update seller package
app.put('/api/sellers/:sellerId/packages/:packageId', (req, res) => {
  try {
    const { sellerId, packageId } = req.params;
    const packageData = req.body;

    const packages = readPackagesFile(sellerId);
    const index = packages.findIndex(p => p.id === packageId);

    if (index === -1) {
      logger.warn('Package not found', { sellerId, packageId });
      return res.status(404).json({ error: 'Package tidak ditemukan' });
    }

    packages[index] = { ...packages[index], ...packageData };
    writePackagesFile(sellerId, packages);
    logger.info('Package updated', {
      sellerId,
      packageId,
      price: packages[index].price,
      originalValue: packages[index].originalValue,
      available: packages[index].available,
    });

    res.json({ success: true, package: packages[index] });
  } catch (error) {
    logger.error('Update package failed', { message: error.message, sellerId: req.params.sellerId });
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get package reviews
app.get('/api/packages/:packageId/reviews', (req, res) => {
  try {
    const { packageId } = req.params;
    const reviews = readReviewsFile().filter(r => r.packageId === packageId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Create a review for a package (and seller)
app.post('/api/packages/:packageId/reviews', (req, res) => {
  try {
    const { packageId } = req.params;
    const { name, rating, comment, sellerId: sellerIdBody } = req.body;

    if (!name || !rating || !comment) {
      logger.warn('Review validation failed', { packageId, name });
      return res.status(400).json({ error: 'name, rating, dan comment wajib diisi' });
    }

    const numericRating = Number(rating);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      logger.warn('Review rating invalid', { packageId, rating: numericRating });
      return res.status(400).json({ error: 'rating harus 1-5' });
    }

    // Resolve sellerId either from payload or by looking up package ownership
    const sellerId = sellerIdBody || findSellerIdByPackageId(packageId);

    const reviews = readReviewsFile();
    const newReview = {
      id: Math.random().toString(36).substr(2, 9),
      packageId,
      sellerId: sellerId || null,
      name,
      rating: numericRating,
      comment,
      createdAt: new Date().toISOString()
    };

    reviews.push(newReview);
    writeReviewsFile(reviews);
    logger.info('Review created', { reviewId: newReview.id, packageId, sellerId: newReview.sellerId });

    res.json({ success: true, review: newReview });
  } catch (error) {
    logger.error('Create review failed', { message: error.message, packageId: req.params.packageId });
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get reviews by seller
app.get('/api/sellers/:sellerId/reviews', (req, res) => {
  try {
    const { sellerId } = req.params;
    const reviews = readReviewsFile().filter(r => r.sellerId === sellerId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Update seller profile
app.put('/api/sellers/:sellerId/profile', (req, res) => {
  try {
    const { sellerId } = req.params;
    const updates = req.body;

    const sellers = readSellersFile();
    const index = sellers.findIndex(s => s.id === sellerId);

    if (index === -1) {
      return res.status(404).json({ error: 'Seller tidak ditemukan' });
    }

    sellers[index] = { ...sellers[index], ...updates };
    writeSellersFile(sellers);

    res.json({ success: true, seller: sellers[index] });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Delete seller account
app.delete('/api/sellers/:sellerId', (req, res) => {
  try {
    const { sellerId } = req.params;

    const sellers = readSellersFile();
    const filteredSellers = sellers.filter(s => s.id !== sellerId);
    writeSellersFile(filteredSellers);

    // Delete seller's packages file
    const packageFile = path.join(packagesDir, `${sellerId}.json`);
    if (fs.existsSync(packageFile)) {
      fs.unlinkSync(packageFile);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get all sellers (for package display)
app.get('/api/sellers', (req, res) => {
  try {
    const sellers = readSellersFile();
    // Don't send passwords
    const safeSellers = sellers.map(({ password, ...rest }) => rest);
    res.json(safeSellers);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
  });
  res.status(500).json({ error: 'Server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`GoodBite Server running on http://localhost:${PORT}`);
  logger.info(`Data files stored in: ${path.join(__dirname, 'data')}`);
});
