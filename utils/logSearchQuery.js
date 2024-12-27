const SearchLog = require('../models/SearchLogs');

// Helper Function to Log Search Queries
const logSearchQuery = async (query, userId = null, ipAddress = null, resultsCount = 0) => {
    try {
      await SearchLog.create({
        query,
        userId,
        ipAddress,
        resultsCount,
        timestamps: new Date(),
      });
    } catch (error) {
      console.error('Error logging search query:', error);
    }
  };
  module.exports = logSearchQuery;