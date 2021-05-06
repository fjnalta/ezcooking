"use strict";

// Generic Imports
const express = require('express');
const multer = require('multer');

// Setup Express Router
const router = express.Router();

// Configure Upload Destination
const upload = multer({dest: 'public/uploads/'});

// Import DbHandler
const dbHandler = new (require('./dbHandler'));

// Import Routes
const basicRoutes = new (require('./router/basicRoutes'))(dbHandler);
const adminRoutes = new (require('./router/adminRoutes'))(dbHandler);
const userRoutes = new (require('./router/userRoutes'))(dbHandler);
const dishRoutes = new (require('./router/dishRoutes'))(dbHandler);
const dataRoutes = new (require('./router/dataRoutes'))(dbHandler);

// Import Middleware
const keycloakMiddleware = new (require('./middleware/keycloakMiddleware'))(dbHandler);
const inputMiddleware = new (require('./middleware/inputMiddleware'));
const captchaMiddleware = new (require('./middleware/captchaMiddleware'));

// Basic Routes
router.get('/', basicRoutes.index);
router.get('/error', basicRoutes.error);

// Public Routes
router.get('/browse', basicRoutes.browse);
router.get('/browse/:category', dishRoutes.getSubCategories);
router.get('/browse/:category/sub/:subcategory', dishRoutes.getDishesFromSubCategory);
router.get('/dish', keycloakMiddleware.checkUserPermissions, dishRoutes.addDish);
router.get('/dish/:id', dishRoutes.getDish);
router.get('/dish/:id/edit', keycloakMiddleware.checkUserPermissions, keycloakMiddleware.checkUserDishPermissions, dishRoutes.editDish);

// User Routes
router.get('/myDishes', keycloakMiddleware.checkUserPermissions, dishRoutes.getDishes);
router.get('/settings', keycloakMiddleware.checkUserPermissions, userRoutes.getSettings);
router.get('/user/:id', keycloakMiddleware.checkUserPermissions, userRoutes.getUserInformation);

router.post('/dish', keycloakMiddleware.checkUserPermissions, upload.single('data'), dishRoutes.createDish);
router.post('/dish/:id', keycloakMiddleware.checkUserPermissions, keycloakMiddleware.checkUserDishPermissions, upload.single('data'), dishRoutes.updateDish);

router.delete('/dish/:id', keycloakMiddleware.checkUserPermissions, keycloakMiddleware.checkUserDishPermissions, dishRoutes.deleteDish);

// Admin Routes
router.get('/admin', keycloakMiddleware.checkUserPermissions, keycloakMiddleware.checkAdminPermission, adminRoutes.getAdmin);
router.get('/dish/:id/assign', keycloakMiddleware.checkUserPermissions, keycloakMiddleware.checkAdminPermission, adminRoutes.setDishOwner);

router.post('/category', upload.single('data'), keycloakMiddleware.checkUserPermissions, keycloakMiddleware.checkAdminPermission, inputMiddleware.handleAddCategoryInput, adminRoutes.addCategory);

// Data Routes
router.get('/units', keycloakMiddleware.checkUserPermissions, dataRoutes.getUnits);
router.get('/ingredients/:id', keycloakMiddleware.checkUserPermissions, dataRoutes.getIngredients);
router.get('/categories', keycloakMiddleware.checkUserPermissions, dataRoutes.getCategoryNames);
router.get('/categories/:id', keycloakMiddleware.checkUserPermissions, dataRoutes.getSubCategoryNames);


module.exports = router;