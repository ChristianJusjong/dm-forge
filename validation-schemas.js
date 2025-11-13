// ==========================================
// DATA VALIDATION SCHEMAS
// Validates data structure and types
// ==========================================

/**
 * Campaign Data Schema
 */
const CampaignSchema = {
  code: {
    type: 'string',
    required: true,
    minLength: 8,
    maxLength: 8,
    pattern: /^[A-Z0-9]{4}-[A-Z0-9]{4}$/,
    validate: (value) => /^[A-Z0-9]{8}$/.test(value.replace('-', ''))
  },
  name: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 100
  },
  createdAt: {
    type: 'number',
    required: true,
    validate: (value) => value > 0 && value <= Date.now()
  },
  lastPlayed: {
    type: 'number',
    required: false,
    validate: (value) => value > 0 && value <= Date.now()
  },
  settings: {
    type: 'object',
    required: true,
    schema: {
      edition: {
        type: 'string',
        required: true
      },
      world: {
        type: 'string',
        required: true
      }
    }
  },
  party: {
    type: 'array',
    required: true,
    default: []
  },
  sessions: {
    type: 'array',
    required: true,
    default: []
  },
  partyConfirmed: {
    type: 'boolean',
    required: false,
    default: false
  }
};

/**
 * Character Data Schema
 */
const CharacterSchema = {
  id: {
    type: 'string',
    required: true
  },
  name: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 100
  },
  race: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 50
  },
  class: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 50
  },
  level: {
    type: 'number',
    required: true,
    min: 1,
    max: 20
  },
  hp: {
    type: 'number',
    required: true,
    min: 1,
    max: 999
  },
  maxHp: {
    type: 'number',
    required: true,
    min: 1,
    max: 999
  },
  ac: {
    type: 'number',
    required: true,
    min: 1,
    max: 99
  },
  proficiencyBonus: {
    type: 'number',
    required: true,
    min: 2,
    max: 6
  },
  strength: {
    type: 'number',
    required: true,
    min: 1,
    max: 30
  },
  dexterity: {
    type: 'number',
    required: true,
    min: 1,
    max: 30
  },
  constitution: {
    type: 'number',
    required: true,
    min: 1,
    max: 30
  },
  intelligence: {
    type: 'number',
    required: true,
    min: 1,
    max: 30
  },
  wisdom: {
    type: 'number',
    required: true,
    min: 1,
    max: 30
  },
  charisma: {
    type: 'number',
    required: true,
    min: 1,
    max: 30
  }
};

/**
 * Combatant Schema (Initiative Tracker)
 */
const CombatantSchema = {
  id: {
    type: 'string',
    required: true
  },
  name: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 100
  },
  initiative: {
    type: 'number',
    required: true,
    min: -10,
    max: 99
  },
  hp: {
    type: 'number',
    required: true,
    min: 0,
    max: 9999
  },
  maxHp: {
    type: 'number',
    required: true,
    min: 1,
    max: 9999
  },
  ac: {
    type: 'number',
    required: true,
    min: 1,
    max: 99
  },
  conditions: {
    type: 'array',
    required: false,
    default: []
  },
  xp: {
    type: 'number',
    required: false,
    min: 0,
    max: 999999
  },
  cr: {
    type: 'number',
    required: false,
    min: 0,
    max: 30
  }
};

/**
 * Session Notes Schema
 */
const SessionNotesSchema = {
  sessionNumber: {
    type: 'number',
    required: true,
    min: 1
  },
  date: {
    type: 'string',
    required: true
  },
  campaignCode: {
    type: 'string',
    required: true,
    minLength: 8,
    maxLength: 9
  },
  sections: {
    type: 'array',
    required: true,
    default: []
  }
};

/**
 * Validate value against field schema
 * @param {*} value - Value to validate
 * @param {Object} fieldSchema - Schema for the field
 * @param {string} fieldName - Name of field (for error messages)
 * @returns {Object} {valid: boolean, errors: Array, sanitized: *}
 */
function validateField(value, fieldSchema, fieldName = 'field') {
  const errors = [];
  let sanitized = value;

  // Check required
  if (fieldSchema.required && (value === null || value === undefined)) {
    errors.push(`${fieldName} is required`);
    return { valid: false, errors, sanitized: fieldSchema.default };
  }

  // Use default if not provided and not required
  if ((value === null || value === undefined) && fieldSchema.default !== undefined) {
    return { valid: true, errors: [], sanitized: fieldSchema.default };
  }

  // Skip validation if optional and not provided
  if (!fieldSchema.required && (value === null || value === undefined)) {
    return { valid: true, errors: [], sanitized: value };
  }

  // Type check
  const actualType = Array.isArray(value) ? 'array' : typeof value;
  if (actualType !== fieldSchema.type) {
    errors.push(`${fieldName} must be ${fieldSchema.type}, got ${actualType}`);
    return { valid: false, errors, sanitized: fieldSchema.default };
  }

  // String validations
  if (fieldSchema.type === 'string') {
    if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
      errors.push(`${fieldName} must be at least ${fieldSchema.minLength} characters`);
    }
    if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
      errors.push(`${fieldName} must be at most ${fieldSchema.maxLength} characters`);
      sanitized = value.substring(0, fieldSchema.maxLength);
    }
    if (fieldSchema.pattern && !fieldSchema.pattern.test(value)) {
      errors.push(`${fieldName} format is invalid`);
    }
  }

  // Number validations
  if (fieldSchema.type === 'number') {
    if (isNaN(value)) {
      errors.push(`${fieldName} must be a valid number`);
      return { valid: false, errors, sanitized: fieldSchema.default || 0 };
    }
    if (fieldSchema.min !== undefined && value < fieldSchema.min) {
      errors.push(`${fieldName} must be at least ${fieldSchema.min}`);
      sanitized = fieldSchema.min;
    }
    if (fieldSchema.max !== undefined && value > fieldSchema.max) {
      errors.push(`${fieldName} must be at most ${fieldSchema.max}`);
      sanitized = fieldSchema.max;
    }
  }

  // Custom validation function
  if (fieldSchema.validate && typeof fieldSchema.validate === 'function') {
    if (!fieldSchema.validate(value)) {
      errors.push(`${fieldName} failed custom validation`);
    }
  }

  // Nested object validation
  if (fieldSchema.type === 'object' && fieldSchema.schema) {
    const nestedResult = validateObject(value, fieldSchema.schema);
    if (!nestedResult.valid) {
      errors.push(...nestedResult.errors);
    }
    sanitized = nestedResult.sanitized;
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized
  };
}

/**
 * Validate entire object against schema
 * @param {Object} data - Data to validate
 * @param {Object} schema - Schema to validate against
 * @returns {Object} {valid: boolean, errors: Array, sanitized: Object}
 */
function validateObject(data, schema) {
  const errors = [];
  const sanitized = {};

  // Validate each field in schema
  for (const [fieldName, fieldSchema] of Object.entries(schema)) {
    const value = data[fieldName];
    const result = validateField(value, fieldSchema, fieldName);

    if (!result.valid) {
      errors.push(...result.errors);
    }

    sanitized[fieldName] = result.sanitized;
  }

  // Warn about extra fields not in schema
  for (const key of Object.keys(data)) {
    if (!schema[key]) {
      console.warn(`Warning: Unexpected field "${key}" not in schema`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized
  };
}

/**
 * Validate campaign data
 * @param {Object} campaign - Campaign data to validate
 * @returns {Object} {valid: boolean, errors: Array, sanitized: Object}
 */
function validateCampaign(campaign) {
  return validateObject(campaign, CampaignSchema);
}

/**
 * Validate character data
 * @param {Object} character - Character data to validate
 * @returns {Object} {valid: boolean, errors: Array, sanitized: Object}
 */
function validateCharacter(character) {
  return validateObject(character, CharacterSchema);
}

/**
 * Validate combatant data
 * @param {Object} combatant - Combatant data to validate
 * @returns {Object} {valid: boolean, errors: Array, sanitized: Object}
 */
function validateCombatant(combatant) {
  return validateObject(combatant, CombatantSchema);
}

/**
 * Validate session notes data
 * @param {Object} notes - Session notes data to validate
 * @returns {Object} {valid: boolean, errors: Array, sanitized: Object}
 */
function validateSessionNotes(notes) {
  return validateObject(notes, SessionNotesSchema);
}

/**
 * Validate and sanitize campaign before saving
 * @param {Object} campaign - Campaign data
 * @returns {Object} Sanitized campaign or throws error
 */
function validateAndSanitizeCampaign(campaign) {
  const result = validateCampaign(campaign);

  if (!result.valid) {
    console.error('Campaign validation failed:', result.errors);
    throw new Error(`Invalid campaign data: ${result.errors.join(', ')}`);
  }

  return result.sanitized;
}

/**
 * Validate and sanitize character before saving
 * @param {Object} character - Character data
 * @returns {Object} Sanitized character or throws error
 */
function validateAndSanitizeCharacter(character) {
  const result = validateCharacter(character);

  if (!result.valid) {
    console.error('Character validation failed:', result.errors);
    throw new Error(`Invalid character data: ${result.errors.join(', ')}`);
  }

  return result.sanitized;
}

/**
 * Safe validate - returns sanitized data with warnings instead of errors
 * @param {Object} data - Data to validate
 * @param {Object} schema - Schema to validate against
 * @returns {Object} Sanitized data (always returns valid object)
 */
function safeValidate(data, schema) {
  const result = validateObject(data, schema);

  if (!result.valid) {
    console.warn('Validation warnings:', result.errors);
  }

  return result.sanitized;
}

// Make functions globally available
if (typeof window !== 'undefined') {
  window.CampaignSchema = CampaignSchema;
  window.CharacterSchema = CharacterSchema;
  window.CombatantSchema = CombatantSchema;
  window.SessionNotesSchema = SessionNotesSchema;

  window.validateField = validateField;
  window.validateObject = validateObject;
  window.validateCampaign = validateCampaign;
  window.validateCharacter = validateCharacter;
  window.validateCombatant = validateCombatant;
  window.validateSessionNotes = validateSessionNotes;
  window.validateAndSanitizeCampaign = validateAndSanitizeCampaign;
  window.validateAndSanitizeCharacter = validateAndSanitizeCharacter;
  window.safeValidate = safeValidate;
}
