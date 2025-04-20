import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllStudents, deleteStudent } from '../../services/adminService';
import { Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingStudentId, setDeletingStudentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await getAllStudents();
        if (response.success) {
          setStudents(response.data);
        } else {
          setError('Failed to fetch students');
        }
      } catch (err) {
        setError(err.message || 'Error fetching students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingStudentId(studentId);
      await deleteStudent(studentId);
      
      // Remove the deleted student from the state
      setStudents(students.filter(student => student.id !== studentId));
      
      toast.success('Student deleted successfully');
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    } finally {
      setDeletingStudentId(null);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#155E95]">Student List</h1>
        <button
          onClick={handleBackToDashboard}
          className="flex items-center text-[#155E95] hover:text-[#0f4a75] transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Roll Number</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Year</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Division</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{student.rollNumber}</td>
                  <td className="px-4 py-2 border-b">{student.name || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{student.user.email}</td>
                  <td className="px-4 py-2 border-b">{student.year || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{student.division || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      disabled={deletingStudentId === student.id}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200 disabled:opacity-50"
                      title="Delete Student"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-2 text-center text-gray-500">No student records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentList; 