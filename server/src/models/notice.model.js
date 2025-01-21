module.exports = (sequelize, Sequelize) => {
    const Notice = sequelize.define('Notice', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      admin_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'administradores',
          key: 'id'
        }
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      contenido: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      importante: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    }, {
      tableName: 'avisos',
      timestamps: false
    });
  
    return Notice;
  };