import { User, Teacher, Student, Batch, Subject, TeacherSubjectBatch } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

async function setupTestData() {
  try {
    // Find or create test teacher user
    let teacherUser = await User.findOne({ where: { email: 'bob@example.com' } });
    let teacher;

    if (!teacherUser) {
      teacherUser = await User.create({
        id: uuidv4(),
        email: 'bob@example.com',
        password: await bcrypt.hash('teacher123', 10),
        role: 'teacher'
      });
      console.log('Created teacher user:', teacherUser.id);

      // Create teacher profile
      teacher = await Teacher.create({
        id: uuidv4(),
        userId: teacherUser.id,
        name: 'Bob Wilson',
        email: 'bob@example.com',
        department: 'Computer Science',
        isActive: true
      });
      console.log('Created teacher profile:', teacher.id);
    } else {
      teacher = await Teacher.findOne({ where: { userId: teacherUser.id } });
      console.log('Using existing teacher:', teacher.id);
    }

    // Find or create test student user
    let studentUser = await User.findOne({ where: { email: 'student@example.com' } });
    let student;

    if (!studentUser) {
      studentUser = await User.create({
        id: uuidv4(),
        email: 'student@example.com',
        password: await bcrypt.hash('student123', 10),
        role: 'student'
      });
      console.log('Created student user:', studentUser.id);

      // Create student profile
      student = await Student.create({
        id: uuidv4(),
        userId: studentUser.id,
        name: 'John Doe',
        email: 'student@example.com',
        rollNumber: '23101',
        year: 'SE',
        division: '9',
        department: 'Computer Science'
      });
      console.log('Created student profile:', student.id);
    } else {
      student = await Student.findOne({ where: { userId: studentUser.id } });
      console.log('Using existing student:', student.id);
    }

    // Find or create subject
    let [subject] = await Subject.findOrCreate({
      where: { code: 'CS301' },
      defaults: {
        id: uuidv4(),
        name: 'Data Structures',
        code: 'CS301',
        description: 'Introduction to Data Structures and Algorithms'
      }
    });
    console.log('Using subject:', subject.id);

    // Find or create batch
    let [batch] = await Batch.findOrCreate({
      where: { name: 'SE-A', year: 'SE', division: '9' },
      defaults: {
        id: uuidv4(),
        name: 'SE-A',
        year: 'SE',
        division: '9',
        rollNumberStart: 23101,
        rollNumberEnd: 23120,
        day: 'Monday',
        time: '10:00 AM - 12:00 PM',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-12-31')
      }
    });
    console.log('Using batch:', batch.id);

    // Find or create teacher-subject-batch assignment
    let [assignment] = await TeacherSubjectBatch.findOrCreate({
      where: {
        teacherId: teacher.id,
        subjectId: subject.id,
        batchId: batch.id
      },
      defaults: {
        id: uuidv4(),
        teacherId: teacher.id,
        subjectId: subject.id,
        batchId: batch.id,
        division: '9',
        academicYear: '2024-2025',
        isActive: true
      }
    });
    console.log('Using teacher-subject-batch assignment:', assignment.id);

    // Associate student with batch if not already associated
    const studentBatches = await student.getBatches();
    if (!studentBatches.find(b => b.id === batch.id)) {
      await student.addBatch(batch);
      console.log('Associated student with batch');
    } else {
      console.log('Student already associated with batch');
    }

    console.log('Test data setup completed successfully');

  } catch (error) {
    console.error('Error setting up test data:', error);
    if (error.parent) {
      console.error('Database error:', {
        message: error.parent.message,
        code: error.parent.code,
        sql: error.parent.sql
      });
    }
  }
}

// Run the setup
setupTestData(); 