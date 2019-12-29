"use strict";

// Generic Imports
const express = require('express');
const multer = require('multer');

// Setup Express Router
const router = express.Router();

// Configure Upload Destination
const upload = multer({dest: 'public/uploads/'});

// Import DbHandler
const DbHandler = require('./dbHandler');

// Import Middleware
const AuthMiddleware = require('./middleware/authMiddleware');
const InputMiddleware = require('./middleware/inputMiddleware');

// Import Routes
const BasicRoutes = require('./router/basicRoutes');
const AdminRoutes = require('./router/adminRoutes');
const UserRoutes = require('./router/userRoutes');
const DishRoutes = require('./router/dishRoutes');
const DataRoutes = require('./router/dataRoutes');

// Initialization
const dbHandler = new DbHandler();

const basicRoutes = new BasicRoutes(dbHandler);
const adminRoutes = new AdminRoutes(dbHandler);
const userRoutes = new UserRoutes(dbHandler);
const dishRoutes = new DishRoutes(dbHandler);
const dataRoutes = new DataRoutes(dbHandler);

const authMiddleware = new AuthMiddleware(dbHandler);
const inputMiddleware = new InputMiddleware(dbHandler);

// Basic Routes
router.get('/', authMiddleware.handleSession, basicRoutes.index);
router.get('/error', authMiddleware.handleSession, basicRoutes.error);

router.post('/login', basicRoutes.login);
router.post('/logout', authMiddleware.handleSession, basicRoutes.logout);
router.post('/register', inputMiddleware.handleRegistrationInput, userRoutes.register);

router.get('/browse', authMiddleware.handleSession, basicRoutes.browse);
router.get('/browse/:category', authMiddleware.handleSession, dishRoutes.getSubCategories);
router.get('/browse/:category/sub/:subcategory', authMiddleware.handleSession, dishRoutes.getDishesFromSubCategory);
router.get('/dish', authMiddleware.handleSession, authMiddleware.checkUserLogin, dishRoutes.addDish);
router.get('/dish/:id', authMiddleware.handleSession, dishRoutes.getDish);
router.get('/dish/:id/edit', authMiddleware.handleSession, authMiddleware.checkUserLogin, authMiddleware.checkUserDishPermissions, dishRoutes.editDish);
router.get('/myDishes', authMiddleware.handleSession, authMiddleware.checkUserLogin, dishRoutes.getDishes);
router.get('/settings', authMiddleware.handleSession, authMiddleware.checkUserLogin, userRoutes.getSettings);
router.get('/user/:id', authMiddleware.handleSession, authMiddleware.checkUserLogin, userRoutes.getUser);

router.post('/dish', upload.single('data'), authMiddleware.handleSession, authMiddleware.checkUserLogin, dishRoutes.createDish);
router.post('/dish/:id', upload.single('data'), authMiddleware.handleSession, authMiddleware.checkUserLogin, dishRoutes.updateDish);
router.post('/user/:id', authMiddleware.handleSession, authMiddleware.checkUserLogin, authMiddleware.checkUserPermissions, userRoutes.updateSettings);

router.delete('/dish/:id', authMiddleware.handleSession, authMiddleware.checkUserLogin, authMiddleware.checkUserDishPermissions, dishRoutes.deleteDish);

// Admin Routes
router.get('/admin', authMiddleware.handleSession, authMiddleware.checkUserLogin, authMiddleware.checkAdminPermission, adminRoutes.getAdmin);
router.get('/dish/:id/assign', authMiddleware.handleSession, authMiddleware.checkUserLogin, authMiddleware.checkAdminPermission, adminRoutes.setDishOwner);

router.post('/category', upload.single('data'), authMiddleware.handleSession, authMiddleware.checkUserLogin, authMiddleware.checkAdminPermission, inputMiddleware.handleAddCategoryInput, adminRoutes.addCategory);

// Data Routes
router.get('/units', authMiddleware.handleSession, authMiddleware.checkUserLogin, dataRoutes.getUnits);
router.get('/ingredients/:id', authMiddleware.handleSession, authMiddleware.checkUserLogin, dataRoutes.getIngredients);
router.get('/categories', authMiddleware.handleSession, authMiddleware.checkUserLogin, dataRoutes.getCategoryNames);
router.get('/categories/:id', authMiddleware.handleSession, authMiddleware.checkUserLogin, dataRoutes.getSubCategoryNames);


module.exports = router;