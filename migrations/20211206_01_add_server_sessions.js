const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn("users", "is_disabled", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    });
    await queryInterface.createTable("sessions", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("users", "is_disabled");
    await queryInterface.dropTable("sessions");
  },
};
