const pool = require('../db');

const getallCourses = (async (req, res) => {
    try {
        const getCoursesQuery = 'SELECT * FROM COURSES WHERE "isActive"=true ORDER BY course ASC';

        const courses = await pool.query(getCoursesQuery);

        res.json({
            courses: courses.rows
        })
    } catch (err) {
        console.error('DATABASE ERROR in GET  /students/courses', err);
        res.status(500).json({ msg: 'Server error while fetching courses', error: err.message });
    }
});



const getCourses = (async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const search = req.query.search || "";
        const limit = 10;
        const offset = (page - 1) * limit;
        const isSorted = req.query.isSorted;


        let countQuery;
        let coursesQuery;
        const queryParams = [];
        const countParams = [];

        const SortingPattern = isSorted === 'false' ? 'DESC' : 'ASC';
        if (search) {
            if (isSorted === 'false') {
                const searchTerm = `%${search}%`;
                countQuery = `SELECT COUNT(*) FROM courses
                     WHERE course ILIKE $1
                    `;
                countParams.push(searchTerm);

                coursesQuery = `
                    SELECT * FROM courses 
                    WHERE course ILIKE $1
                    ORDER BY course DESC
                    LIMIT $2 OFFSET $3
                                          `;
                queryParams.push(searchTerm, limit, offset);
            }
            else {
                const searchTerm = `%${search}%`;
                countQuery = `SELECT COUNT(*) FROM courses
                              WHERE course ILIKE $1
                                                      `;
                countParams.push(searchTerm);

                coursesQuery = `SELECT * FROM courses 
                                    WHERE course ILIKE $1
                                    ORDER BY course ASC
                                    LIMIT $2 OFFSET $3
                                `;
                queryParams.push(searchTerm, limit, offset);

            }

        } else {
            countQuery = 'SELECT COUNT(*) FROM courses';
            coursesQuery = `
                    SELECT * FROM courses
                    ORDER BY course ${SortingPattern}
                    LIMIT $1 OFFSET $2
                          `;
            queryParams.push(limit, offset);
        }

        const totalResult = await pool.query(countQuery, countParams);
        const coursesResult = await pool.query(coursesQuery, queryParams);
        const totalCourses = parseInt(totalResult.rows[0].count, 10);

        res.json({
            courses: coursesResult.rows,
            totalCourses,
            currentPage: page,
            totalPages: Math.ceil(totalCourses / limit),
        });
    } catch (err) {
        console.error('DATABASE ERROR in GET  /students/courses', err);
        res.status(500).json({ msg: 'Server error while fetching courses', error: err.message });
    }
});




const addCourse = async (req, res) => {
    try {
        const  {course}  = req.body;
        const trimmedCourse = req.body.course.replace(/\s+/g, "");

        if (!course) {
            return res.status(400).json({ msg: 'Course name is required' });
        }
        const checkCourse = await pool.query('SELECT * FROM COURSES WHERE course = $1', [trimmedCourse]);
        if (checkCourse.rows.length > 0) {
            return res.status(400).json({ msg: 'Course already exists. Please use a different one.' });
        }
        const curTime = new Date();

        const query = 'INSERT INTO COURSES (course,added_at) VALUES ($1,$2) RETURNING *';
        const result = await pool.query(query, [course, curTime]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding course', err);
        res.status(500).json({
            msg: 'Server Error while adding course',
            error: err.message,
        });
    }
};

const deleteCourse = (async (req, res) => {
    try {
        const {course} = req.body;
        await pool.query('DELETE FROM COURSES WHERE course = $1 RETURNING *', [course]);
         res.json({ msg: 'Course deleted successfully' });

    } catch (err) {
        console.error("Error Deleting Courses", err);
        res.status(500).json({ msg: 'Server error while deleting Courses', error: err.message });
    }
})



const editCourse = (async (req, res) => {
    try {
        const coursetoEdit = req.params.course;
        const  newCourse  = req.body.newCourse;
        if(!newCourse){
                return res.status(400).json({ msg: 'Course name is required' })
        }
        if (coursetoEdit !== newCourse) {
            const courseExist = await pool.query(
                'SELECT * FROM COURSES WHERE course = $1',
                [newCourse]
            );
            if (courseExist.rows.length > 0) {
                return res.status(400).json({ msg: 'Course already exists. Please add a different one.' });
            }
        }
        const curTime=new Date();
        const result = await pool.query('UPDATE courses SET course=$1 ,edited_at=$2 WHERE course=$3  RETURNING *', [newCourse,curTime, coursetoEdit]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error Editing Courses", err);
        res.status(500).json({ msg: 'Server error while editing Courses', error: err.message });
    }
})



const toggleStatus = (async (req, res) => {
    try {
        const { newStatus } = req.body;
        const courseTotoggle = req.params.course;

        const result = await pool.query('Update courses SET "isActive"=$1 WHERE course=$2 RETURNING *', [newStatus, courseTotoggle])
        res.json(result.rows[0])
    } catch (err) {
        console.error("Error Changing Course Status", err);
        res.status(500).json({ msg: 'Server error while changing Courses Status', error: err.message });
    }
})


module.exports = { getCourses, addCourse, deleteCourse, editCourse, toggleStatus ,getallCourses}