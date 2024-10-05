const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Patient = sequelize.define('Patient', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    symptoms: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokenNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    admissionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Patient;
};
