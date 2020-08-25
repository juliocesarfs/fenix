const fs = require('fs');
const data = require('./data.json');
const { graduation, date, age, findTeacher } = require('./utils');

exports.index = function(req, res) {

  let teachers = data.teachers.map(function(teacher) {
    const newTeacher = {
      ...teacher,
      expertises: teacher.expertises.split(',')
    } 

    return newTeacher;
  });


  return res.render('teachers/index', { teachers });
}

exports.post = function(req, res) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == '')
      return res.send('Please fill all fields');
  }

  let { avatar_url, name, birth, education_level, class_type, expertises } = req.body;

  const created_at = Date.now();
  const id = Number(data.teachers.length + 1);
  birth = Date.parse(birth);

  data.teachers.push({
    id,
    avatar_url,
    name,
    birth,
    education_level,
    class_type,
    expertises,
    created_at
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send('Write file error!');

    return res.redirect('teachers');
  })
}

exports.show = function(req, res) {
  const foundTeacher = findTeacher(req.params);

  if(!foundTeacher) return res.send('Teacher not found!');

  const teacher = {
    ...foundTeacher,
    age: age(foundTeacher.birth),
    expertises: foundTeacher.expertises.split(','),
    education_level: graduation(foundTeacher.education_level),
    created_at: new Intl.DateTimeFormat('eng-US').format(foundTeacher.created_at)
  }
  
  return res.render('teachers/show', { teacher });
}

exports.edit = function(req, res) {
  const foundTeacher = findTeacher(req.params);

  if(!foundTeacher) return res.send('Teacher not found!');

  const teacher = {
    ...foundTeacher,
    birth: date(foundTeacher.birth),
  }

  return res.render('teachers/edit', { teacher });
}

exports.put = function(req, res) {
  const { id } = req.body
  const foundTeacher = findTeacher(req.body)

  if(!foundTeacher) return res.send("teacher not found!")

  const teacher = {
    ...foundTeacher,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(foundTeacher.id)
  }

  data.teachers[teacher.id - 1] = teacher;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send('Write file error!')

    return res.redirect(`/teachers/${id}`)
  })

}

exports.delete = function(req, res) {
  const { id } = req.body;

  const filteredTeachers = data.teachers.filter(function(teacher) {
    return teacher.id != id;
  })

  data.teachers = filteredTeachers;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send('Write file error!')
  
    return res.redirect('/teachers');
  })
}
