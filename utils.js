const data = require('./data.json');

module.exports = {
  findTeacher: function(params) {
    const { id } = params;

    const foundTeacher = data.teachers.find(function(teacher) {
      return teacher.id == id;
    })

    return foundTeacher;
  }
}