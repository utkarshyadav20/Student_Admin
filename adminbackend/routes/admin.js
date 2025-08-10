const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { login } = require('../controllers/login');
const { getStudents,getStudent, editStudent, deleteStudent, addStudents } = require('../controllers/studentroutes');
const { logout } = require('../controllers/logout');
const { tokenCheck } = require('../controllers/tokenCheck');
const {  addCourse, deleteCourse, getCourses, editCourse, toggleStatus, getallCourses } = require('../controllers/courses');
const { getCountries } = require('../controllers/countries');
const { getStates } = require('../controllers/states');
require('dotenv').config();

router.post('/login', login );
router.get('/students',auth,getStudents);
router.post('/students',auth,addStudents);
router.put('/students/:email',auth,editStudent);
router.get('/students/:email',auth,getStudent);
router.delete('/students/:email',auth,deleteStudent);
router.post('/logout',auth,logout)
router.get('/token-check',auth,tokenCheck);


router.get('/courses',auth,getCourses);
router.get('/coursesAll',auth,getallCourses);
router.put('/courses/:course',auth,editCourse);
router.put('/courses/status/:course',auth,toggleStatus)
router.post('/courses/add',auth,addCourse);
router.delete('/courses/delete',auth,deleteCourse);
router.get('/country',auth,getCountries);


router.get('/state',auth,getStates);



module.exports = router;