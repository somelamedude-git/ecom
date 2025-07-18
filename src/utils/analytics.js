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
    const response = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [
            { name: 'ecommercePurchases' },
            { name: 'transactions' },
            { name: 'itemsPurchased' },
        ],
    })

    const rows = response.rows?.[0]?.metricValues || []

    return {
        ecommercePurchases: rows[0]?.value || '0',
        transactions: rows[1]?.value || '0',
        itemsPurchased: rows[2]?.value || '0',
    }
}

module.exports = {
    getStats
}