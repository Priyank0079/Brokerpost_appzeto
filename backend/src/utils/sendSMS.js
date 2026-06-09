const http = require('http');

const sendSMSOTP = async (phoneNumber, otp) => {
  return new Promise((resolve) => {
    // Read credentials from environment variables
    let apiKeyRaw = process.env.SMS_API_KEY || '';
    let apiKey = apiKeyRaw;
    
    // If the user pasted the entire URL in the API_KEY field (as seen in .env), extract the key!
    if (apiKeyRaw.includes('http')) {
        try {
            const urlObj = new URL(apiKeyRaw);
            apiKey = urlObj.searchParams.get('APIKey') || apiKeyRaw;
        } catch (e) {
            console.error("Could not parse API key URL", e);
        }
    }

    const senderId = process.env.SMS_SENDER_ID || 'ASRNET';
    
    if (!apiKey) {
      console.warn('SMS credentials not fully configured. Falling back to console log.');
      console.log(`[SIMULATED SMS to ${phoneNumber}] OTP: ${otp}`);
      return resolve({ success: true, simulated: true });
    }

    // Use the exact DLT approved template format found in the user's .env example
    const message = `Your BrokersPost login OTP is ${otp}. Valid for 10 minutes. Don't share. - ${senderId}`;

    // Construct the correct SMS India Hub Push SMS URL format
    const params = new URLSearchParams({
      APIKey: apiKey,
      msisdn: phoneNumber,
      sid: senderId,
      msg: message,
      fl: '0',
      gwid: '2'
    });

    const apiUrl = `http://cloud.smsindiahub.in/vendorsms/pushsms.aspx?${params.toString()}`;

    console.log(`Sending SMS to ${phoneNumber}...`);

    http.get(apiUrl, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 400 || data.includes('Not Acceptable')) {
           console.error(`[SMS Error] Server responded with status ${res.statusCode}:`, data);
        }

        try {
          const parsedData = JSON.parse(data);
          // SMS India Hub typical JSON response: {"ErrorMessage":"Success","ErrorCode":"000","JobId":"..."}
          if (parsedData.ErrorCode === '000' || parsedData.ErrorMessage === 'Success') {
            console.log('SMS sent successfully:', parsedData);
            resolve({ success: true, data: parsedData });
          } else {
            console.error('Failed to send SMS:', parsedData);
            resolve({ success: false, error: parsedData }); 
          }
        } catch (e) {
            // Some endpoints return plain text like "API-XXXXXX" on success
            console.log('SMS response:', data);
            resolve({ success: true, data });
        }
      });
    }).on("error", (err) => {
      console.error("Error sending SMS:", err.message);
      resolve({ success: false, error: err.message });
    });
  });
};

module.exports = sendSMSOTP;
