const fs = require('fs');
const data = require('./data.json');

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