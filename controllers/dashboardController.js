const pool = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    
    let dateFilter = '';
    let params = [];
    
    if (fromDate && toDate) {
      dateFilter = 'WHERE date BETWEEN $1 AND $2';
      params = [fromDate, toDate];
    } else {
      dateFilter = 'WHERE date = CURRENT_DATE';
    }

    // Get autoclave data
    const autoclaveQuery = `
      SELECT operator, type_of_media, COUNT(*) as cycles, SUM(CAST(SPLIT_PART(media_total, ':', 1) AS INTEGER)) as total_hours
      FROM autoclave_cycles ${dateFilter}
      GROUP BY operator, type_of_media
    `;
    const autoclaveData = await pool.query(autoclaveQuery, params);

    // Get media batch data
    const batchQuery = `
      SELECT operator, SUM(bottles) as total_bottles
      FROM media_batches ${dateFilter}
      GROUP BY operator
    `;
    const batchData = await pool.query(batchQuery, params);

    // Get subculture data
    const subcultureQuery = `
      SELECT operator, SUM(vessels_used) as total_vessels, SUM(shoots_transferred) as total_shoots
      FROM subculturing ${dateFilter.replace('date', 'transfer_date')}
      GROUP BY operator
    `;
    const subcultureData = await pool.query(subcultureQuery, params);

    // Get incubation data
    const incubationQuery = `
      SELECT operator, SUM(vessels_count) as total_vessels, SUM(shoots_count) as total_shoots
      FROM incubation ${dateFilter.replace('date', 'subculture_date')}
      GROUP BY operator
    `;
    const incubationData = await pool.query(incubationQuery, params);

    res.json({
      autoclave: autoclaveData.rows,
      batches: batchData.rows,
      subculture: subcultureData.rows,
      incubation: incubationData.rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboardStats };
