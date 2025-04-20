import { useState, useEffect } from 'react';
import { getToken } from '../../lib/auth';
import { deleteStudent, getAllStudents } from '../../services/adminService';
import { Trash2, Users, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('stats'); // 'students' or 'stats'
  const [deletingStudentId, setDeletingStudentId] = useState(null);
  const [showStudentList, setShowStudentList] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      // Fetch students with marks
      const studentsData = await getAllStudents();
      setStudents(studentsData);
      
      // Fetch dashboard stats
      const statsResponse = await fetch('http://localhost:3000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch dashboard statistics');
      }
      
      const statsData = await statsResponse.json();
      setStats(statsData);
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingStudentId(studentId);
      await deleteStudent(studentId);
      
      // Remove the deleted student from the state
      setStudents(students.filter(student => student.student.id !== studentId));
      
      // Update stats
      if (stats) {
        setStats({
          ...stats,
          counts: {
            ...stats.counts,
            students: stats.counts.students - 1
          }
        });
      }
      
      toast.success('Student deleted successfully');
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    } finally {
      setDeletingStudentId(null);
    }
  };

  const handleStudentCardClick = () => {
    navigate('/admin/students');
  };

  const handleBackToDashboard = () => {
    setShowStudentList(false);
  };

  const renderStudentList = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Student List</h2>
        <button
          onClick={handleBackToDashboard}
          className="flex items-center text-[#155E95] hover:text-[#0f4a75] transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#155E95]"></div>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
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
              {students.map((studentData) => (
                <tr key={studentData.student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{studentData.student.rollNumber}</td>
                  <td className="px-4 py-2 border-b">{studentData.student.name || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{studentData.student.email}</td>
                  <td className="px-4 py-2 border-b">{studentData.student.year || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{studentData.student.division || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleDeleteStudent(studentData.student.id)}
                      disabled={deletingStudentId === studentData.student.id}
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
      )}
    </div>
  );

  const renderStatsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
        onClick={handleStudentCardClick}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#155E95]" />
            Total Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-[#155E95]">
            {stats?.counts?.students || 0}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#155E95]" />
            Total Teachers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-[#155E95]">
            {stats?.counts?.teachers || 0}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#155E95]" />
            Total Batches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-[#155E95]">
            {stats?.counts?.batches || 0}
          </p>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#155E95]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#155E95] mb-6">Admin Dashboard</h1>
      {showStudentList ? renderStudentList() : renderStatsTab()}
    </div>
  );
}

export default AdminDashboard;