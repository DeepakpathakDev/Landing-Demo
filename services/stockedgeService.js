const axios = require('axios');

class StockEdgeService {
    constructor() {
        this.baseUrl = 'https://api.stockedge.com/Api/DailyDashboardApi';
        this.headers = {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Origin': 'https://stockedge.com',
            'Referer': 'https://stockedge.com/'
        };
    }

    async fetchCorporateAnnouncements(page = 1, pageSize = 19) {
        try {
            console.log(`Fetching corporate announcements for page ${page} with pageSize ${pageSize}...`);
            const response = await axios.get(`${this.baseUrl}/GetCorporateAnnouncementDailyInfo/2?page=${page}&pageSize=${pageSize}&lang=en`, {
                headers: this.headers
            });
            
            if (!response.data || !Array.isArray(response.data)) {
                throw new Error('Invalid response format from API');
            }

            const announcements = response.data.map(item => ({
                date: item.Date,
                companyName: item.SecurityName,
                subject: item.Subject || 'N/A',
                type: item.TypeOfAnnouncement?.replace('_', ' ') || 'General',
                fileUrl: item.FileURL,
                securityId: item.SecurityID,
                exchange: item.Exchange,
                typeOfMeeting: item.TypeOfMeeting,
                dateOfMeeting: item.DateOfMeeting,
                id: item.ID,
                securitySlug: item.SecuritySlug
            }));

            // Calculate pagination values
            const totalRecords = response.headers['x-total-count'] || announcements.length;
            const totalPages = Math.ceil(totalRecords / pageSize);

            console.log(`Returning ${announcements.length} records out of ${totalRecords} total records`);
            
            return {
                data: announcements,
                total: totalRecords,
                page,
                pageSize,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            };
        } catch (error) {
            console.error('Error fetching corporate announcements:', error);
            throw error;
        }
    }

    async fetchIntradayPrices(listingId, date) {
        try {
            console.log(`Fetching intraday prices for listing ID ${listingId} on date ${date}...`);
            
            // Format date to YYYY-MM-DD
            const formattedDate = new Date(date).toISOString().split('T')[0];
            const url = `https://api.stockedge.com/Api/IntraDayPriceDashboardApi/GetIntradayPrices_V2/${listingId}?FromDate=${formattedDate}T00:00:00&ToDate=${formattedDate}T00:00:00&lang=en`;
            
            console.log('Fetching from URL:', url);
            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            
            if (!response.data || !Array.isArray(response.data)) {
                throw new Error('Invalid response format from API');
            }

            // Transform the data to match our expected format
            const transformedData = response.data.map(item => ({
                Date: item.Dt,
                Open: item.O,
                High: item.H,
                Low: item.L,
                Close: item.C,
                TradeQuantity: item.TQ
            }));

            console.log(`Received ${transformedData.length} intraday price records`);
            return transformedData;
        } catch (error) {
            console.error('Error fetching intraday prices:', error);
            throw error;
        }
    }
}

module.exports = new StockEdgeService(); 