const data = require('./data.json');

module.exports = {
  age: function(timestamp) {
    const today = new Date();
    const birthDate = new Date(timestamp);

    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if((month < 0 ) || (month == 0 && today.getDate() <= birthDate.getDate()))
      age -= 1;

    return age;
  },
  findTeacher: function(params) {
    const { id } = params;

    const foundTeacher = data.teachers.find(function(teacher) {
      return teacher.id == id;
    })

    return foundTeacher;
  },
  findStudent: function(params) {
    const { id } = params;

    const foundStudent = data.students.find(function(student) {
      return student.id == id;
    })

    return foundStudent;
  },
  date: function(timestamp) {
    const date = new Date(timestamp);
    
    const year = date.getUTCFullYear()
    const month = `0${date.getUTCMonth() + 1}`.slice(-2)
    const day = `0${date.getUTCDate()}`.slice(-2)

    return {
      day,
      month, 
      year,
      iso: `${year}-${month}-${day}`,
      birthDay: `${month}/${day}`
    };
  },
  graduation: function(education_level) {
    switch (education_level) {
      case 'school': return 'High School';
      case 'university': return 'University Education';
      case 'master': return 'Master degree';
      case 'doctorate': return 'Doctorate degree';
    }
  }
}