const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
  all(callback) {
    db.query(`SELECT *
    FROM students
    ORDER BY name ASC`, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows)
    })
  },
  create(data, callback) {
    const query = `
      INSERT INTO students (
        avatar_url,
        name,
        email,
        birth_date,
        school_year,
        workload,
        teacher_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `
    const values = [
      data.avatar_url,
      data.name,
      data.email,
      date(data.birth_date).iso,
      data.school_year,
      data.workload,
      data.teacher
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows[0])
    })
  },
  find(id, callback) {
    db.query(`
      SELECT students.*, teachers.name AS teacher_name
      FROM students
      LEFT JOIN teachers ON (students.teacher_id = teachers.id)
      WHERE students.id = $1`, [id], (err, results) => {
      if (err) throw `Database error! ${err}`
      callback(results.rows[0])
      })
  },
  update(data, callback) {
    const query = `
      UPDATE students SET
        avatar_url = ($1),
        name = ($2),
        email = ($3),
        birth_date = ($4),
        school_year = ($5),
        workload = ($6),
        teacher_id = ($7)
      WHERE id = $8
    `

    const values = [
      data.avatar_url,
      data.name,
      data.email,
      date(data.birth_date).iso,
      data.school_year,
      data.workload,
      data.teacher,
      data.id
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback()
    })
  },
  delete(id, callback) {
    db.query(`DELETE FROM students WHERE id = $1`, [id], (err, results) => {
      if (err) throw `Database error! ${err}`
      
      return callback()
    })
  },
  teachersSelectOptions(callback) {
    db.query(`SELECT name, id FROM teachers`, (err, results) => {
      if (err) throw `Database error! ${err}`
      
      callback(results.rows)
    })
  },
  paginate(params) {
    const { filter, limit, offset, callback } = params


    let query = '',
        filterQuery = '',
        totalQuery = `(
          SELECT count(*) FROM students
        ) AS total`

    if (filter) {

      filterQuery = `${query}
      WHERE students.name ILIKE '%${filter}%'
      OR students.email ILIKE '%${filter}%'
      `

      totalQuery = `(
        SELECT count(*) FROM students
        ${filterQuery}
      ) AS total`
    }

    query = `
    SELECT students.*, ${totalQuery}
    FROM students
    ${filterQuery}
    LIMIT $1 OFFSET $2
    `

    db.query(query, [limit, offset], (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows)
    })

  }
}