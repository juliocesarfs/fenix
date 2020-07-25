const fs = require('fs');
const data = require('./data.json');
const { age, findTeacher } = require('./utils');

exports.post = function(req, res) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == '')
      return res.send('Please fill all fields');
  }

  let { avatar_url, name, birth, education_level, class_type, expertises } = req.body;

  const created_at = Date.now();
  const id = Number(data.instructors.length + 1);
  birth = Date.parse(birth);

  data.instructors.push({
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
    created_at: new Intl.DateTimeFormat('eng-US').format(foundTeacher.created_at)
  }
  
  return res.render('teachers/show', { teacher });
}

exports.edit = function(req, res) {
  const foundTeacher = findTeacher(req.params);

  return res.send(foundTeacher);
}