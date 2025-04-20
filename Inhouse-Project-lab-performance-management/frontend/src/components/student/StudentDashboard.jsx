import React, { useState, useEffect } from 'react';
import { Card } from "../ui";
import { User, GraduationCap, Award, BookOpen, Calendar, Clock, Mail, Hash, Building2, Users, CheckCircle, BookOpenCheck, ChevronRight } from "lucide-react";
import { getCurrentStudent, getStudentBatch } from '../../services/studentService';
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        console.log('Fetching student data...');
        const response = await getCurrentStudent();
        console.log('Response:', response);
        
        // Fetch batch details
        let batchData = null;
        try {
          const batchResponse = await getStudentBatch();
          console.log('Batch response:', batchResponse);
          batchData = batchResponse;
        } catch (batchErr) {
          console.error('Error fetching batch data:', batchErr);
          // Continue without batch data
        }
        
        if (response && response.data) {
          // Transform the API response to match the expected structure
          const transformedData = {
            profile: {
              rollNumber: response.data.rollNumber || 'N/A',
              name: response.data.name || 'N/A',
              email: response.data.email || 'N/A',
              department: response.data.department || 'N/A',
              year: response.data.year || 'N/A',
              division: response.data.division || 'N/A',
              attendanceMarks: response.data.attendanceMarks || 0
            },
            summary: {
              totalAssessments: response.data.assessments?.length || 0,
              completedAssessments: response.data.assessments?.filter(a => a.assignmentMarks !== null).length || 0,
              totalAttendance: response.data.attendanceMarks || 0,
              subjects: batchData ? [
                { 
                  id: batchData.id, 
                  name: batchData.subjectName || 'Unnamed Subject', 
                  teacher: batchData.teacher?.name || 'Not assigned' 
                }
              ] : []
            },
            unitTests: {
              subjects: batchData ? [
                { 
                  id: batchData.id, 
                  name: batchData.subjectName || 'Unnamed Subject', 
                  unitTest1: response.data.performance?.find(p => p.type === 'unitTest1')?.marks || 0,
                  unitTest2: response.data.performance?.find(p => p.type === 'unitTest2')?.marks || 0,
                  unitTest3: response.data.performance?.find(p => p.type === 'unitTest3')?.marks || 0
                }
              ] : []
            }
          };
          
          setStudent(transformedData);
          setError(null);
        } else {
          setError('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError(err.message || 'Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleSubjectClick = (subjectId) => {
    navigate(`/student/subject/${subjectId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No student data available
      </div>
    );
  }

  const completionPercentage = student.summary?.totalAssessments > 0 
    ? (student.summary.completedAssessments / student.summary.totalAssessments) * 100 
    : 0;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Student Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Student Profile Card */}
        <Card className="p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 transition-transform duration-300 hover:rotate-12">
              <User className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Student Profile</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 group">
              <Hash className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Roll No: {student.profile?.rollNumber || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <User className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Name: {student.profile?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <Mail className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Email: {student.profile?.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <Building2 className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Department: {student.profile?.department || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <GraduationCap className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Year: {student.profile?.year || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <Users className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Division: {student.profile?.division || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <Calendar className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-300" />
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Attendance: {student.profile?.attendanceMarks || 0} marks</span>
            </div>
          </div>
        </Card>

        {/* Subjects Card */}
        <Card className="p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br from-white to-purple-50 border-t-4 border-t-purple-500">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 transition-transform duration-300 hover:rotate-12">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">My Subjects</h2>
          </div>
          
          {student.summary?.subjects?.length > 0 ? (
            <div className="space-y-3">
              {student.summary.subjects.map((subject) => (
                <div 
                  key={subject.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-white border border-purple-100 hover:bg-purple-50 hover:border-purple-200 cursor-pointer transition-all duration-200"
                  onClick={() => handleSubjectClick(subject.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                      <BookOpenCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{subject.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {subject.teacher}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-purple-400" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No subjects assigned yet.</p>
            </div>
          )}
        </Card>

        {/* Unit Test Marks Card */}
        <Card className="p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600 transition-transform duration-300 hover:rotate-12">
              <Award className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Unit Test Marks</h2>
          </div>
          
          {student.unitTests?.subjects?.length > 0 ? (
            <div className="space-y-4">
              {student.unitTests.subjects.map((subject) => (
                <div 
                  key={subject.id} 
                  className="p-3 rounded-lg bg-orange-50 group hover:bg-orange-100 transition-colors duration-300 cursor-pointer"
                  onClick={() => handleSubjectClick(subject.id)}
                >
                  <h3 className="font-medium text-orange-700 mb-2">{subject.name}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center p-2 rounded-md bg-white">
                      <span className="text-xs text-gray-500">Unit Test 1</span>
                      <span className="font-semibold text-orange-600 group-hover:text-orange-700 transition-colors duration-300">{subject.unitTest1 || 0}/30</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-md bg-white">
                      <span className="text-xs text-gray-500">Unit Test 2</span>
                      <span className="font-semibold text-orange-600 group-hover:text-orange-700 transition-colors duration-300">{subject.unitTest2 || 0}/30</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-md bg-white">
                      <span className="text-xs text-gray-500">Unit Test 3</span>
                      <span className="font-semibold text-orange-600 group-hover:text-orange-700 transition-colors duration-300">{subject.unitTest3 || 0}/30</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No unit test data available.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard; 