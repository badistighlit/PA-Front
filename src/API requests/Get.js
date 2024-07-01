import axios from 'axios';

const url = 'https://code-n-share-api-gateway.vercel.app';
const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IktXYTRYblpwLTQ4TmFucEV1aVBYRiJ9.eyJpc3MiOiJodHRwczovL2NvZGVuc2hhcmUudXMuYXV0aDAuY29tLyIsInN1YiI6ImY2NDRGdEJZZWx4UlNJdnE3UDdSMUU4cGIySkI4NVd0QGNsaWVudHMiLCJhdWQiOiJodHRwczovL2NvZGVuc2hhcmUudXMuYXV0aDAuY29tL2FwaS92Mi8iLCJpYXQiOjE3MTk4NzIyOTQsImV4cCI6MTcxOTk1ODY5NCwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOmluc2lnaHRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6bG9nc191c2VycyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgdXBkYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgcmVhZDphbm9tYWx5X2Jsb2NrcyBkZWxldGU6YW5vbWFseV9ibG9ja3MgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyBjcmVhdGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiBkZWxldGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiByZWFkOmN1c3RvbV9kb21haW5zIGRlbGV0ZTpjdXN0b21fZG9tYWlucyBjcmVhdGU6Y3VzdG9tX2RvbWFpbnMgdXBkYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIGRlbGV0ZTpicmFuZGluZyByZWFkOmxvZ19zdHJlYW1zIGNyZWF0ZTpsb2dfc3RyZWFtcyBkZWxldGU6bG9nX3N0cmVhbXMgdXBkYXRlOmxvZ19zdHJlYW1zIGNyZWF0ZTpzaWduaW5nX2tleXMgcmVhZDpzaWduaW5nX2tleXMgdXBkYXRlOnNpZ25pbmdfa2V5cyByZWFkOmxpbWl0cyB1cGRhdGU6bGltaXRzIGNyZWF0ZTpyb2xlX21lbWJlcnMgcmVhZDpyb2xlX21lbWJlcnMgZGVsZXRlOnJvbGVfbWVtYmVycyByZWFkOmVudGl0bGVtZW50cyByZWFkOmF0dGFja19wcm90ZWN0aW9uIHVwZGF0ZTphdHRhY2tfcHJvdGVjdGlvbiByZWFkOm9yZ2FuaXphdGlvbnNfc3VtbWFyeSBjcmVhdGU6YXV0aGVudGljYXRpb25fbWV0aG9kcyByZWFkOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgdXBkYXRlOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgZGVsZXRlOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgcmVhZDpvcmdhbml6YXRpb25zIHVwZGF0ZTpvcmdhbml6YXRpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVycyByZWFkOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGRlbGV0ZTpvcmdhbml6YXRpb25fbWVtYmVycyBjcmVhdGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIHVwZGF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyByZWFkOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgY3JlYXRlOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyByZWFkOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIGRlbGV0ZTpwaG9uZV9wcm92aWRlcnMgY3JlYXRlOnBob25lX3Byb3ZpZGVycyByZWFkOnBob25lX3Byb3ZpZGVycyB1cGRhdGU6cGhvbmVfcHJvdmlkZXJzIGRlbGV0ZTpwaG9uZV90ZW1wbGF0ZXMgY3JlYXRlOnBob25lX3RlbXBsYXRlcyByZWFkOnBob25lX3RlbXBsYXRlcyB1cGRhdGU6cGhvbmVfdGVtcGxhdGVzIGNyZWF0ZTplbmNyeXB0aW9uX2tleXMgcmVhZDplbmNyeXB0aW9uX2tleXMgdXBkYXRlOmVuY3J5cHRpb25fa2V5cyBkZWxldGU6ZW5jcnlwdGlvbl9rZXlzIHJlYWQ6c2Vzc2lvbnMgZGVsZXRlOnNlc3Npb25zIHJlYWQ6cmVmcmVzaF90b2tlbnMgZGVsZXRlOnJlZnJlc2hfdG9rZW5zIGNyZWF0ZTpzZWxmX3NlcnZpY2VfcHJvZmlsZXMgcmVhZDpzZWxmX3NlcnZpY2VfcHJvZmlsZXMgdXBkYXRlOnNlbGZfc2VydmljZV9wcm9maWxlcyBkZWxldGU6c2VsZl9zZXJ2aWNlX3Byb2ZpbGVzIGNyZWF0ZTpzc29fYWNjZXNzX3RpY2tldHMgcmVhZDpmb3JtcyB1cGRhdGU6Zm9ybXMgZGVsZXRlOmZvcm1zIGNyZWF0ZTpmb3JtcyByZWFkOmZsb3dzIHVwZGF0ZTpmbG93cyBkZWxldGU6Zmxvd3MgY3JlYXRlOmZsb3dzIHJlYWQ6Zmxvd3NfdmF1bHQgdXBkYXRlOmZsb3dzX3ZhdWx0IGRlbGV0ZTpmbG93c192YXVsdCBjcmVhdGU6Zmxvd3NfdmF1bHQgcmVhZDpjbGllbnRfY3JlZGVudGlhbHMgY3JlYXRlOmNsaWVudF9jcmVkZW50aWFscyB1cGRhdGU6Y2xpZW50X2NyZWRlbnRpYWxzIGRlbGV0ZTpjbGllbnRfY3JlZGVudGlhbHMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJhenAiOiJmNjQ0RnRCWWVseFJTSXZxN1A3UjFFOHBiMkpCODVXdCJ9.Ej0ELtzlohfYYENuD9T9uGJSDEt6qZ-FLWy9OvpmDH6xJHisqgAcwMPw1efU6mJqNP0OWWSwMDuTpD5bMvY5dGvtRSyFwZFryq8rrIW_sF_PLEcl6KhG7hLFtRzrTLrPXzjgO-tuIsR0qAQYfszu3zpL_o7Ajt9OAqGc-r2mXg5mjSZSQiB72IyhXxWUP61hXQtNhCh-vP30vD1HbLAFaUkRZc8_a2tSwLbwgG2Ljqa5jToZa3PXMMnxeKbz2nAqmB6D24IOeAuV6NsFmSQHgQAFWlPlYBeKTS8tkJc56sTICt4wETxvzu8wLjc1g1Ii-QIY9BHR7KhA9vbz7E3PDw'
const config = {
  headers: {
    'Authorization': `Bearer ${token}`
  },
  data:""
};

export const getAllFilesForUser = async (username) => {
  try {
    const response = await axios.get(`${url}/files/AllFilesForUser/${username}`, config);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching files: ", error);
    throw error;
  }
};


export const getFeedForUser = async (username) => {
  try {
    const response = await axios.get(`${url}/files/FeedForUser/${username}`, config);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching files: ", error);
    throw error;
  }
};


export const getUserFollowers = async (username) => {
  try {
    const response = await axios.get(`${url}/followers/${username}/followers`, config);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching files: ", error);
    throw error;
  }
};

export const getUserFollowing = async (username) => {
  try {
    const response = await axios.get(`${url}/followers/${username}/following`, config);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching files: ", error);
    throw error;
  }
};

export const createFile = async (body) => {
  try {
    console.log(body)
    config.data = body
    console.log(config)
    const response = await axios.post(`https://code-n-share-api-files.vercel.app/CreateFile`, config);
    console.log(response.result)
  } catch (error) {
    console.error("Error creating file: ", error);
    throw error;
  }
};

export const executeFile = async (fileId) => {
    try {
      console.log(fileId)
        const response = await axios.get(`https://code-n-share-api-files.vercel.app/executeFile/${fileId}`, config);
        
        console.log("execution resulatttttttttttt"+response.data.result)
        return response.data.result;
      } catch (error) {
        console.error("Error resultat file: ", error);
        throw error
  }};

