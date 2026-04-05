const express = require('express');
const router = express.Router();
const { getDashboard, getActivity, getProgress, getMentorDashboard, getCounselorDashboard } = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', protect, getDashboard);
router.get('/activity', protect, getActivity);
router.get('/progress', protect, getProgress);
router.get('/mentor', protect, getMentorDashboard);
router.get('/counselor', protect, getCounselorDashboard);

module.exports = router;
