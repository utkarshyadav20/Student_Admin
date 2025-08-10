const pool = require('../db');

const getStudents = (async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const search = req.query.search || "";
    const limit = 22;
    const offset = (page - 1) * limit;
    const isSorted = req.query.isSorted;
    const course = req.query.course || "";
    let countQuery;
    let studentsQuery;
    const queryParams = [];
    const countParams = [];

    const SortingPattern = isSorted === 'false' ? 'DESC' : 'ASC';

    if (course) {
      if (search) {
        const searchTerm = `%${search}%`;
        countQuery = `SELECT COUNT(*) FROM students
         WHERE (name ILIKE $1 OR email ILIKE $1 OR mobile ILIKE $1) AND (
         course=$2
         )
        `;
        countParams.push(searchTerm, course);

        studentsQuery = `
        SELECT students.email, students.name, students.course, students.mobile,
        students.city, students.state, students.country, students.address,
        students.image, students.about_student, students.added_at, students.edited_at,
        courses."isActive"
        FROM students 
        JOIN courses ON courses.course = students.course
        WHERE (students.name ILIKE $1 OR students.email ILIKE $1 OR students.mobile ILIKE $1)
        AND students.course = $2
        ORDER BY students.name ${SortingPattern}
        LIMIT $3 OFFSET $4
      `;
        queryParams.push(searchTerm, course, limit, offset);
      }
      else {
        countQuery = 'SELECT COUNT(*) FROM students WHERE course=$1';
        countParams.push(course);
        studentsQuery = `
        SELECT students.email, students.name, students.course, students.mobile,
        students.city, students.state, students.country, students.address,
        students.image, students.about_student, students.added_at, students.edited_at,
        courses."isActive"
        FROM students 
        JOIN courses ON courses.course = students.course
        WHERE courses.course=$1
        ORDER BY name ${SortingPattern}
        LIMIT $2 OFFSET $3
        
      `;
        queryParams.push(course, limit, offset);
      }

    }
    else {
      if (search) {

        const searchTerm = `%${search}%`;
        countQuery = `SELECT COUNT(*) FROM students
         WHERE name ILIKE $1 OR email ILIKE $1 OR mobile ILIKE $1
        `;
        countParams.push(searchTerm);

        studentsQuery = `
        SELECT students.email, students.name, students.course, students.mobile,
        students.city, students.state, students.country, students.address,
        students.image, students.about_student, students.added_at, students.edited_at,
        courses."isActive"
        FROM students 
        JOIN courses ON courses.course = students.course
        WHERE name ILIKE $1 OR email ILIKE $1 OR mobile ILIKE $1
        ORDER BY name ${SortingPattern}
        LIMIT $2 OFFSET $3
      `;
        queryParams.push(searchTerm, limit, offset);
      }
      else {
        countQuery = 'SELECT COUNT(*) FROM students';
        studentsQuery = `
        SELECT students.email, students.name, students.course, students.mobile,
        students.city, students.state, students.country, students.address,
        students.image, students.about_student, students.added_at, students.edited_at,
        courses."isActive"
        FROM students 
        JOIN courses ON courses.course = students.course
        ORDER BY name ${SortingPattern}
        LIMIT $1 OFFSET $2
        
      `;
        queryParams.push(limit, offset);
      }
    }



    const totalResult = await pool.query(countQuery, countParams);
    const studentsResult = await pool.query(studentsQuery, queryParams);
    const totalStudents = parseInt(totalResult.rows[0].count, 10);

    res.json({
      students: studentsResult.rows,
      totalStudents,
      currentPage: page,
      totalPages: Math.ceil(totalStudents / limit),
    });
  } catch (err) {
    console.error('DATABASE ERROR in GET /students:', err);
    res.status(500).json({ msg: 'Server error while fetching students', error: err.message });
  }
})

const addStudents = (async (req, res) => {
  const {
    name, email, mobile, course,
    city, state, country, address, about_student, image
  } = req.body; 
  // console.log(req.body);
  // console.log(image);
  const imageBuffer = image ? Buffer.from(image, 'base64') : null;
  const curTime = new Date();
  try {
    const result = await pool.query(`
      INSERT INTO students (name, email, mobile, course, city, state, country, address, about_student,image,added_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `, [name, email, mobile, course, city, state, country, address, about_student, imageBuffer, curTime]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ mslogg: 'Error adding student', error: err.message });
  }
})



const getStudent = async (req, res) => {
  const currentEmail = req.params.email;

  try {
    const studentResult = await pool.query(
      'SELECT * FROM students WHERE email = $1',
      [currentEmail]
    );
    res.json(studentResult.rows[0]);
  } catch (err) {
    console.error('DATABASE ERROR in GET /student/:email', err);
    res.status(500).json({
      msg: 'Server error while fetching one student',
      error: err.message,
    });
  }
};



const editStudent = async (req, res) => {
  const {
    name, email: newEmail, mobile, course,
    city, state, country, address, about_student, image
  } = req.body;
  const currentEmail = req.params.email;
  const curTime = new Date();
  try {
    if (newEmail !== currentEmail) {

      const emailExists = await pool.query(
        'SELECT * FROM students WHERE email = $1',
        [newEmail]
      );
      if (emailExists.rows.length > 0) {
        return res.status(400).json({ msg: 'Email already exists. Please use a different one.' });
      }
    }

let imageBuffer = null;
    if (typeof image === 'string') {
      imageBuffer = Buffer.from(image, 'base64');
    }
    
    const result = await pool.query(
      `UPDATE students SET
        name = $1, email = $2, mobile = $3, course = $4,
        city = $5, state = $6, country = $7, address = $8,
        about_student = $9, image = $10, edited_at=$11
      WHERE email = $12
      RETURNING *`,
      [
        name, newEmail, mobile, course,
        city, state, country, address, about_student,
        imageBuffer, curTime, currentEmail
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating student:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


const deleteStudent = (async (req, res) => {
  try {
    const studentEmail = req.params.email;
    const result = await pool.query('DELETE FROM students WHERE email = $1 RETURNING *', [studentEmail]);

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: 'Student not found with that email' });
    }

    res.json({ msg: 'Student deleted successfully' });
  } catch (err) {
    console.error('Error deleting student:', err.message);
    res.status(500).json({ msg: 'Server error while deleting student', error: err.message });
  }
})


module.exports = { getStudents, addStudents, editStudent, deleteStudent, getStudent }