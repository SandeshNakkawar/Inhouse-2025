import { Student, Assessment, Batch, TeacherSubjectBatch } from '../models/index.js';
import { Op } from 'sequelize';

// Save or update assessment data
export const saveAssessment = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    
    const {
      studentRollNo, 
      experimentNo, 
      scheduledPerformanceDate, 
      actualPerformanceDate, 
      scheduledSubmissionDate, 
      actualSubmissionDate, 
      rppMarks, 
      spoMarks, 
      assignmentMarks, 
      id,
      finalAssignmentMarks,
      testMarks,
      theoryAttendanceMarks,
      finalMarks,
      unitTest1Marks,
      unitTest2Marks,
      unitTest3Marks,
      convertedUnitTestMarks
    } = req.body;

    // Enhanced validation for required fields
    if (!studentRollNo || typeof studentRollNo !== 'string' || studentRollNo.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Valid student roll number is required'
      });
    }

    if (experimentNo === undefined || experimentNo === null || 
        typeof experimentNo !== 'number' || experimentNo < 0 || experimentNo > 12) {
      return res.status(400).json({
        success: false,
        message: 'Valid experiment number (0-12) is required'
      });
    }

    // Validate marks if provided
    const validateMarks = (marks, fieldName, maxValue) => {
      if (marks !== undefined && marks !== null) {
        const numMarks = Number(marks);
        if (isNaN(numMarks) || numMarks < 0 || numMarks > maxValue) {
          throw new Error(`Invalid ${fieldName}. Must be between 0 and ${maxValue}`);
        }
        return numMarks;
      }
      return marks;
    };

    try {
      if (rppMarks !== undefined) validateMarks(rppMarks, 'RPP marks', 5);
      if (spoMarks !== undefined) validateMarks(spoMarks, 'SPO marks', 5);
      if (assignmentMarks !== undefined) validateMarks(assignmentMarks, 'Assignment marks', 10);
      if (finalAssignmentMarks !== undefined) validateMarks(finalAssignmentMarks, 'Final assignment marks', 60);
      if (theoryAttendanceMarks !== undefined) validateMarks(theoryAttendanceMarks, 'Theory attendance marks', 20);
      if (unitTest1Marks !== undefined) validateMarks(unitTest1Marks, 'Unit test 1 marks', 30);
      if (unitTest2Marks !== undefined) validateMarks(unitTest2Marks, 'Unit test 2 marks', 30);
      if (unitTest3Marks !== undefined) validateMarks(unitTest3Marks, 'Unit test 3 marks', 30);
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError.message
      });
    }

    // First check if the student exists
    const student = await Student.findOne({
      where: { rollNumber: studentRollNo },
      include: [{
        model: Batch,
        as: 'Batches'
      }]
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found with the provided roll number'
      });
    }

    console.log('Found student:', student.toJSON());
    console.log('Teacher ID from request:', req.user.teacherId);
    console.log('Student batches:', student.Batches ? student.Batches.map(b => b.toJSON()) : []);

    // Then check if the student is in any batches that this teacher can access
    const teacherBatches = await TeacherSubjectBatch.findAll({
      where: { 
        teacherId: req.user.teacherId,
        isActive: true
      },
      include: [{
        model: Batch,
        as: 'assignedBatch',
        required: true
      }]
    });

    console.log('Teacher batches found:', teacherBatches.length);
    if (teacherBatches.length > 0) {
      console.log('Teacher batches:', teacherBatches.map(tsb => ({
        batchId: tsb.batchId,
        batchName: tsb.assignedBatch ? tsb.assignedBatch.name : 'unknown',
        studentRollNo
      })));
    }

    // Check if any of the teacher's batches contain this student
    const hasPermission = teacherBatches.some(tsb => {
      const batch = tsb.assignedBatch;
      return batch && 
             studentRollNo >= batch.rollNumberStart && 
             studentRollNo <= batch.rollNumberEnd;
    });

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify assessments for this student'
      });
    }

    let assessment;
    
    if (id) {
      // Update existing assessment
      assessment = await Assessment.findByPk(id);
      
      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
      }
      
      // Update fields
      const updateData = {
        experimentNo,
        scheduledPerformanceDate,
        actualPerformanceDate,
        scheduledSubmissionDate,
        actualSubmissionDate,
        rppMarks,
        spoMarks,
        assignmentMarks,
        finalAssignmentMarks,
        testMarks,
        theoryAttendanceMarks,
        finalMarks,
        unitTest1Marks,
        unitTest2Marks,
        unitTest3Marks,
        convertedUnitTestMarks,
        teacherId: req.user.teacherId
      };
      
      // Remove undefined values
      Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
      );
      
      try {
        await assessment.update(updateData);
        console.log('Assessment updated:', assessment.toJSON());
      } catch (saveError) {
        console.error('Error updating assessment:', saveError);
        throw saveError;
      }
    } else {
      // Create new assessment
      try {
        assessment = await Assessment.create({
          studentRollNo,
          experimentNo,
          scheduledPerformanceDate,
          actualPerformanceDate,
          scheduledSubmissionDate,
          actualSubmissionDate,
          rppMarks,
          spoMarks,
          assignmentMarks,
          finalAssignmentMarks,
          testMarks,
          theoryAttendanceMarks,
          finalMarks,
          unitTest1Marks,
          unitTest2Marks,
          unitTest3Marks,
          convertedUnitTestMarks,
          teacherId: req.user.teacherId
        });
        console.log('Assessment created:', assessment.toJSON());
      } catch (createError) {
        console.error('Error creating assessment:', createError);
        throw createError;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Assessment saved successfully',
      id: assessment.id,
      data: assessment
    });
  } catch (error) {
    console.error('Error in saveAssessment:', error);
    
    // Enhanced error logging
    if (error.name === 'SequelizeValidationError') {
      console.error('Validation errors:', error.errors.map(e => ({
        field: e.path,
        message: e.message,
        value: e.value
      })));
    }
    
    if (error.parent) {
      console.error('Database error:', {
        message: error.parent.message,
        code: error.parent.code,
        sql: error.parent.sql
      });
    }
    
    // Send appropriate error response
    res.status(500).json({
      success: false,
      message: 'Error saving assessment',
      error: error.name === 'SequelizeValidationError' 
        ? 'Validation error: ' + error.errors.map(e => e.message).join(', ')
        : error.message
    });
  }
};

// Get all assessments for a student
export const getStudentAssessments = async (req, res) => {
  try {
    const { studentRollNo } = req.params;
    
    console.log('Fetching assessments for student:', studentRollNo);
    
    const assessments = await Assessment.findAll({
      where: { studentRollNo },
      order: [['experimentNo', 'ASC']]
    });
    
    console.log('Found assessments:', assessments.length);
    
    res.json({
      success: true,
      data: assessments
    });
  } catch (error) {
    console.error('Error fetching student assessments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student assessments',
      error: error.message
    });
  }
};

// Get all assessments for a batch
export const getBatchAssessments = async (req, res) => {
  try {
    const { batchId } = req.params;
    
    // Get the batch to find roll number range
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }
    
    // Get all assessments for students in this batch
    const assessments = await Assessment.findAll({
      include: [{
        model: Student,
        where: {
          rollNumber: {
            [Op.between]: [batch.rollNumberStart, batch.rollNumberEnd]
          }
        },
        required: true
      }],
      order: [
        ['studentRollNo', 'ASC'],
        ['experimentNo', 'ASC']
      ]
    });
    
    res.json(assessments);
  } catch (error) {
    console.error('Error fetching batch assessments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching batch assessments',
      error: error.message
    });
  }
}; 