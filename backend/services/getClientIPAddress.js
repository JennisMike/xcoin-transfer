/**
 * Gets the client's real IP address from the request
 * Handles various proxy configurations and edge cases
 *
 * @param {Object} req - Express/Node.js request object
 * @returns {string} The client's IP address
 */
const getClientIpAddress = (req) => {
  // Check for Cloudflare
  const cfConnectingIp = req.headers["cf-connecting-ip"];
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    // Extract the first IP which should be the client
    const ips = forwardedFor.split(",").map((ip) => ip.trim());
    return ips[0];
  }

  // Check for True-Client-IP header (Akamai and others)
  const trueClientIp = req.headers["true-client-ip"];
  if (trueClientIp) {
    return trueClientIp;
  }

  // Check for X-Real-IP (often used by NGINX)
  const realIp = req.headers["x-real-ip"];
  if (realIp) {
    return realIp;
  }

  // Check Express's req.ip if available (usually populated in Express apps)
  if (req.ip) {
    return req.ip;
  }

  // Fall back to the socket's remote address
  if (req.connection) {
    return req.connection.remoteAddress;
  }

  if (req.socket) {
    return req.socket.remoteAddress;
  }

  // Some older Node.js versions use this
  if (req.connection && req.connection.socket) {
    return req.connection.socket.remoteAddress;
  }

  // Unable to determine IP
  return null;
};

module.exports = getClientIpAddress;
