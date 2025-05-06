import pool from '../config/database.js';

export const getSpaceSettingsByNameFromDb = async (urlParam) => {
  const connection = await pool.getConnection();
  try {
    // Busca o espaço pelo nome
    const [spaces] = await connection.query(
      'SELECT id FROM spaces WHERE name = ? LIMIT 1',
      [urlParam]
    );

    if (spaces.length === 0) {
      return null; // Space não encontrado
    }

    const spaceId = spaces[0].id;

    // Busca o settings do espaço
    const [settings] = await connection.query(
      'SELECT settings FROM spaces_settings WHERE space_id = ? LIMIT 1',
      [spaceId]
    );

    if (settings.length === 0) {
      return null; // Settings não encontrado
    }

    return settings[0].settings; // Retorna o JSON
  } finally {
    connection.release();
  }
};
