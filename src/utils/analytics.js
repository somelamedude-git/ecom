const { BetaAnalyticsDataClient } = require('@google-analytics/data')
const credentials = require('../ecom-463615-f093b93e963e.json')

const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
    },
})

const propertyId = process.env.GA4_PROPERTY_ID

const getTotalUsers = async () => {
    const response = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [{ name: 'totalUsers' }],
    })

    return response.rows?.[0]?.metricValues?.[0]?.value || '0'
}

module.exports = {
    getTotalUsers
}