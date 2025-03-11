const express = require('express');
const router = express.Router();
const {getMenu,addPizza} = require('../controllers/menuController');

router.get('/',getMenu);
router.get('/',addPizza);

module.exports = router;