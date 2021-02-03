const fs = require('fs')
const data = require('../data.json')
const { graduation, date, age, findStudent } = require('../utils')

exports.index = function(req, res) {
  return res.render('students/index', { students: data.students })
}

exports.post = function(req, res) {
  const keys = Object.keys(req.body)

  for (key of keys) {
    if (req.body[key] == '')
      return res.send('Please fill all fields')
  }

  let { avatar_url, name, birth, email, school_year, workload } = req.body;

  const id = Number(data.students.length + 1)
  birth = Date.parse(birth)

  data.students.push({
    id,
    avatar_url,
    name,
    birth,
    email,
    school_year,
    workload
  })

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send('Write file error!')

    return res.redirect('students');
  })
}

exports.show = function(req, res) {
  const foundStudent = findStudent(req.params)

  if (!foundStudent) return res.send('Student not found!')

  const student = {
    ...foundStudent,
    age: age(foundStudent.birth)
  }

  return res.render('students/show', { student })
}

exports.edit = function(req, res) {
  const foundStudent = findStudent(req.params)

  if (!foundStudent) return res.send('Student not found!')

  const student = {
    ...foundStudent,
    birth: date(foundStudent.birth).iso
  }

  return res.render('students/edit', { student })
}

exports.put = function(req, res) {
  const { id } = req.body
  const foundStudent = findStudent(req.body)

  if (!foundStudent) return res.sned('student not found!')

  const student = {
    ...foundStudent,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(foundStudent.id)
  }

  data.students[student.id - 1] = student

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send('Write file error!')

    return res.redirect(`/students/${id}`)
  })
}

exports.delete = function(req, res) {
  const { id } = req.body;

  const filteredStudents = data.students.filter(function(student) {
    return student.id != id
  })

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send('Write file error!')

    return res.redirect('/students')
  })
}