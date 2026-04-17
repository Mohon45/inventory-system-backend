// { status: 'success'|'fail'|'error', data: any, message?: string }
const httpResponse = (status, data, message) => ({ status, data, message });

module.exports = { httpResponse };
