import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  rollNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 20]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  year: {
    type: DataTypes.ENUM('SE', 'TE', 'BE'),
    allowNull: false
  },
  division: {
    type: DataTypes.ENUM('9', '10', '11'),
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Computer Engineering'
  },
  attendanceMarks: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 20
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  timestamps: true,
  paranoid: true // Enable soft deletes
});

export default Student;