
module.exports = {
  age(timestamp) {
    const today = new Date();
    const birthDate = new Date(timestamp);

    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if((month < 0 ) || (month == 0 && today.getDate() <= birthDate.getDate()))
      age -= 1;

    return age;
  },
  findTeacher(params) {
    const { id } = params;

    const foundTeacher = data.teachers.find(function(teacher) {
      return teacher.id == id;
    })

    return foundTeacher;
  },
  findStudent(params) {
    const { id } = params;

    const foundStudent = data.students.find(function(student) {
      return student.id == id;
    })

    return foundStudent;
  },
  date(timestamp) {
    const date = new Date(timestamp);
    
    const year = date.getUTCFullYear()
    const month = `0${date.getUTCMonth() + 1}`.slice(-2)
    const day = `0${date.getUTCDate()}`.slice(-2)

    return {
      day,
      month, 
      year,
      iso: `${year}-${month}-${day}`,
      birthDay: `${month}/${day}`,
      format: `${day}/${month}/${year}`
    };
  },
  graduation(education_level) {
    switch (education_level) {
      case 'school': return 'High School';
      case 'university': return 'University Education';
      case 'master': return 'Master degree';
      case 'doctorate': return 'Doctorate degree';
    }
  },
  grade(school_year) {
    switch (school_year) {
      case '5EF': return '5th year of Elementary School';
      case '6EF': return '6th year of Elementary School';
      case '7EF': return '7th year of Elementary School';
      case '8EF': return '8th year of Elementary School';
      case '9EF': return '9th year of Elementary School';
      case '1EM': return '1st year of High School';
      case '2EM': return '2nd year of High School';
      case '3EM': return '3rd year of High School';
    }
  },
  separateSubjects(objects) {
    let object = objects.map(function(object){
      const newObject = {
          ...object,
          subjects_taught: object.subjects_taught.split(',')
      }
      return newObject;
    });

    return object
  }
}