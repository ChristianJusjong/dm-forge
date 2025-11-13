// ==========================================
// INPUT SANITIZATION UTILITIES
// Protects against XSS (Cross-Site Scripting) attacks
// ==========================================

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for HTML insertion
 */
function escapeHTML(str) {
  if (typeof str !== 'string') {
    return '';
  }

  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Strip all HTML tags from a string
 * @param {string} str - String to strip
 * @returns {string} String without HTML tags
 */
function stripHTML(str) {
  if (typeof str !== 'string') {
    return '';
  }

  const div = document.createElement('div');
  div.innerHTML = str;
  return div.textContent || div.innerText || '';
}

/**
 * Sanitize user input for safe storage and display
 * Removes dangerous characters and potential script injections
 * @param {string} input - User input to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized string
 */
function sanitizeInput(input, options = {}) {
  if (typeof input !== 'string') {
    return '';
  }

  const {
    allowLineBreaks = true,
    maxLength = 10000,
    stripTags = true
  } = options;

  let sanitized = input;

  // Trim whitespace
  sanitized = sanitized.trim();

  // Enforce max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Remove or escape HTML tags
  if (stripTags) {
    sanitized = stripHTML(sanitized);
  } else {
    sanitized = escapeHTML(sanitized);
  }

  // Preserve line breaks if allowed
  if (!allowLineBreaks) {
    sanitized = sanitized.replace(/[\r\n]+/g, ' ');
  }

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  return sanitized;
}

/**
 * Sanitize campaign name
 * @param {string} name - Campaign name
 * @returns {string} Sanitized campaign name
 */
function sanitizeCampaignName(name) {
  return sanitizeInput(name, {
    allowLineBreaks: false,
    maxLength: 100,
    stripTags: true
  });
}

/**
 * Sanitize username
 * @param {string} username - Username
 * @returns {string} Sanitized username
 */
function sanitizeUsername(username) {
  let sanitized = sanitizeInput(username, {
    allowLineBreaks: false,
    maxLength: 50,
    stripTags: true
  });

  // Only allow alphanumeric, underscore, hyphen, and spaces
  sanitized = sanitized.replace(/[^a-zA-Z0-9_\- ]/g, '');

  return sanitized;
}

/**
 * Sanitize email address
 * @param {string} email - Email address
 * @returns {string} Sanitized email
 */
function sanitizeEmail(email) {
  let sanitized = sanitizeInput(email, {
    allowLineBreaks: false,
    maxLength: 254, // RFC 5321
    stripTags: true
  });

  // Basic email format validation
  sanitized = sanitized.toLowerCase();

  return sanitized;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Sanitize session notes (allows more formatting)
 * @param {string} notes - Session notes
 * @returns {string} Sanitized notes
 */
function sanitizeNotes(notes) {
  return sanitizeInput(notes, {
    allowLineBreaks: true,
    maxLength: 50000,
    stripTags: true
  });
}

/**
 * Sanitize NPC name
 * @param {string} name - NPC name
 * @returns {string} Sanitized NPC name
 */
function sanitizeNPCName(name) {
  return sanitizeInput(name, {
    allowLineBreaks: false,
    maxLength: 100,
    stripTags: true
  });
}

/**
 * Sanitize character name
 * @param {string} name - Character name
 * @returns {string} Sanitized character name
 */
function sanitizeCharacterName(name) {
  return sanitizeInput(name, {
    allowLineBreaks: false,
    maxLength: 100,
    stripTags: true
  });
}

/**
 * Validate and sanitize password
 * @param {string} password - Password to validate
 * @returns {Object} {valid: boolean, sanitized: string, errors: Array}
 */
function validatePassword(password) {
  const errors = [];

  if (typeof password !== 'string') {
    return { valid: false, sanitized: '', errors: ['Password must be a string'] };
  }

  // Don't sanitize password (preserve special characters)
  // But do trim whitespace
  const sanitized = password.trim();

  // Check length
  if (sanitized.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (sanitized.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  // Check complexity
  const hasUppercase = /[A-Z]/.test(sanitized);
  const hasLowercase = /[a-z]/.test(sanitized);
  const hasNumber = /[0-9]/.test(sanitized);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(sanitized);

  const complexityCount = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  if (complexityCount < 3) {
    errors.push('Password must contain at least 3 of: uppercase, lowercase, numbers, special characters');
  }

  // Check for common weak passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'admin', 'letmein', 'welcome', 'password123'];
  if (commonPasswords.includes(sanitized.toLowerCase())) {
    errors.push('Password is too common - please choose a stronger password');
  }

  return {
    valid: errors.length === 0,
    sanitized: sanitized,
    errors: errors
  };
}

/**
 * Sanitize number input
 * @param {*} value - Value to sanitize as number
 * @param {Object} options - Min/max constraints
 * @returns {number} Sanitized number
 */
function sanitizeNumber(value, options = {}) {
  const { min = -Infinity, max = Infinity, defaultValue = 0 } = options;

  const num = Number(value);

  if (isNaN(num)) {
    return defaultValue;
  }

  return Math.min(Math.max(num, min), max);
}

/**
 * Sanitize integer input
 * @param {*} value - Value to sanitize as integer
 * @param {Object} options - Min/max constraints
 * @returns {number} Sanitized integer
 */
function sanitizeInteger(value, options = {}) {
  const num = sanitizeNumber(value, options);
  return Math.floor(num);
}

/**
 * Create safe text node (for DOM insertion)
 * Use this instead of innerHTML when possible
 * @param {string} text - Text to create node from
 * @returns {Text} Text node
 */
function createSafeTextNode(text) {
  return document.createTextNode(text || '');
}

/**
 * Safely set element text content
 * @param {HTMLElement} element - Element to set text on
 * @param {string} text - Text to set
 */
function setSafeTextContent(element, text) {
  if (element && element.textContent !== undefined) {
    element.textContent = text || '';
  }
}

/**
 * Safely set element HTML (with escaping)
 * Only use when you need to preserve formatting
 * @param {HTMLElement} element - Element to set HTML on
 * @param {string} html - HTML to set (will be escaped)
 */
function setSafeHTML(element, html) {
  if (element) {
    element.innerHTML = escapeHTML(html || '');
  }
}

/**
 * Check if a string contains potential XSS attacks
 * @param {string} str - String to check
 * @returns {boolean} True if suspicious content detected
 */
function containsXSS(str) {
  if (typeof str !== 'string') {
    return false;
  }

  const xssPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick, onload, etc.
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /eval\(/gi,
    /expression\(/gi,
    /vbscript:/gi,
    /data:text\/html/gi
  ];

  return xssPatterns.some(pattern => pattern.test(str));
}

/**
 * Log suspicious input attempts
 * @param {string} input - Suspicious input
 * @param {string} field - Field name
 */
function logSuspiciousInput(input, field) {
  console.warn(`⚠️ Suspicious input detected in ${field}:`, input.substring(0, 100));

  // Could send to analytics/monitoring service here
  // trackSecurityEvent('xss_attempt', { field, input: input.substring(0, 100) });
}

/**
 * Sanitize and validate user input with XSS detection
 * @param {string} input - Input to sanitize
 * @param {string} fieldName - Name of the field (for logging)
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized input
 */
function sanitizeAndValidate(input, fieldName = 'unknown', options = {}) {
  if (containsXSS(input)) {
    logSuspiciousInput(input, fieldName);

    // Optionally show warning to user
    if (options.warnUser) {
      alert(`⚠️ Invalid characters detected in ${fieldName}. HTML tags and scripts are not allowed.`);
    }
  }

  return sanitizeInput(input, options);
}

// Make functions globally available
if (typeof window !== 'undefined') {
  window.escapeHTML = escapeHTML;
  window.stripHTML = stripHTML;
  window.sanitizeInput = sanitizeInput;
  window.sanitizeCampaignName = sanitizeCampaignName;
  window.sanitizeUsername = sanitizeUsername;
  window.sanitizeEmail = sanitizeEmail;
  window.isValidEmail = isValidEmail;
  window.sanitizeNotes = sanitizeNotes;
  window.sanitizeNPCName = sanitizeNPCName;
  window.sanitizeCharacterName = sanitizeCharacterName;
  window.validatePassword = validatePassword;
  window.sanitizeNumber = sanitizeNumber;
  window.sanitizeInteger = sanitizeInteger;
  window.createSafeTextNode = createSafeTextNode;
  window.setSafeTextContent = setSafeTextContent;
  window.setSafeHTML = setSafeHTML;
  window.containsXSS = containsXSS;
  window.logSuspiciousInput = logSuspiciousInput;
  window.sanitizeAndValidate = sanitizeAndValidate;
}
