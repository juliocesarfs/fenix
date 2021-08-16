const { date, age, separateSubjects, grade } = require('../../lib/utils')
const Student = require('../models/Student')

module.exports = {
  index(req, res) {
    let { filter, page, limit } = req.query

    page = page || 1
    limit = limit || 2
    let offset = limit * (page - 1)

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(students) {
        const pagination = {
          total: (students[0]) ? Math.ceil(students[0].total/limit) : 0,
          page
        }

        return res.render('students/index', { students, pagination, filter })
      }
    }
    
    Student.paginate(params)
  },
  create(req, res) {
    Student.teachersSelectOptions((options) => {
      return res.render('students/create', { teachersOptions: options });
    })
  },
  post(req, res) {
    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == '')
        return res.send('Please, fill all fields');
    }

    Student.create(req.body, (student) => {
      return res.redirect(`/students/${student.id}`)
    })
  },
  show(req, res) {
    Student.find(req.params.id, (student) => {
      if (!student) return res.send('Student not found!')

      student.age = age(student.birth_date)
      student.birth_date = date(student.birth_date).format
      student.school_year = grade(student.school_year)

      return res.render('students/show', { student })
    })
    
  },
  edit(req, res) {

    Student.find(req.params.id, (student) => {
      if (!student) return res.send('Student not found!')

      student.birth_date = date(student.birth_date).iso

      Student.studentsSelectOptions((options) => {
        return res.render('students/edit', { student, studentsOptions: options })
      })
    })
  },
  put(req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == '')
        return res.send('Please, fill all fields');
    }
    
    Student.update(req.body, () => {
      return res.redirect(`students/${req.body.id}`)
    })
  },
  delete(req, res) {
    Student.delete(req.body.id, () => {
      return res.redirect('/students')
    })
  },
}