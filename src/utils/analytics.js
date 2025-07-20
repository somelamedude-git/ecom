const { BetaAnalyticsDataClient } = require('@google-analytics/data')
const credentials = require('../ecom-463615-f093b93e963e.json')

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  },
})

const propertyId = process.env.GA4_PROPERTY_ID

const getStats = async () => {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
    metrics: [
      { name: 'sessions' },
      { name: 'newUsers' },
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'engagedSessions' },
      { name: 'ecommercePurchases' },
      { name: 'transactions' },
      { name: 'itemsPurchased' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
      { name: 'engagementRate' },
    ],
  })

  const rows = response.rows?.[0]?.metricValues || []

  return {
    sessions: rows[0]?.value || '0',
    newUsers: rows[1]?.value || '0',
    activeUsers: rows[2]?.value || '0',
    screenPageViews: rows[3]?.value || '0',
    engagedSessions: rows[4]?.value || '0',
    ecommercePurchases: rows[5]?.value || '0',
    transactions: rows[6]?.value || '0',
    itemsPurchased: rows[7]?.value || '0',
    averageSessionDuration: rows[8]?.value || '0',
    bounceRate: rows[9]?.value || '0',
    engagementRate: rows[10]?.value || '0',
  }
}

module.exports = {
  getStats,
}
