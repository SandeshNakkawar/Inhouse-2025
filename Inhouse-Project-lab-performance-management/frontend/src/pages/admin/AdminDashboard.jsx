import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, uploadStudentsCSV } from '../../services/adminService';
import { Users, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    try {
      setUploading(true);
      const response = await uploadStudentsCSV(file);
      if (response.success) {
        toast.success('Students uploaded successfully');
        // Refresh stats after successful upload
        fetchStats();
      } else {
        toast.error(response.message || 'Failed to upload students');
      }
    } catch (error) {
      console.error('Error uploading students data:', error);
      toast.error(error.message || 'Failed to upload students');
    } finally {
      setUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#155E95]">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <label
            htmlFor="csvUpload"
            className={`flex items-center px-4 py-2 bg-[#155E95] text-white rounded-lg cursor-pointer hover:bg-[#0f4a75] transition-colors duration-200 ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Students CSV
            <input
              id="csvUpload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* ... rest of your existing dashboard content ... */}
    </div>
  );
};

export default AdminDashboard; 