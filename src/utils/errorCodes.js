/**
 * MARK-II Error Codes
 * Merkezi hata yönetimi ve standardize edilmiş HTTP status kodları
 */

const ERROR_CODES = {
  // Authentication Errors (401)
  AUTH: {
    NO_SESSION: {
      code: 'AUTH_001',
      message: 'Oturum bulunamadı. Lütfen giriş yapın.',
      status: 401
    },
    INVALID_CREDENTIALS: {
      code: 'AUTH_002',
      message: 'Kullanıcı adı veya şifre hatalı.',
      status: 401
    },
    SESSION_EXPIRED: {
      code: 'AUTH_003',
      message: 'Oturum süresi dolmuş. Lütfen tekrar giriş yapın.',
      status: 401
    }
  },

  // Authorization Errors (403)
  AUTHZ: {
    FORBIDDEN: {
      code: 'AUTHZ_001',
      message: 'Bu işlemi yapmaya yetkili değilsiniz.',
      status: 403
    },
    ADMIN_ONLY: {
      code: 'AUTHZ_002',
      message: 'Bu işlem sadece yönetici tarafından yapılabilir.',
      status: 403
    },
    IP_RESTRICTED: {
      code: 'AUTHZ_003',
      message: 'Bu işlem sadece local makineden yapılabilir.',
      status: 403
    },
    INSUFFICIENT_ROLE: {
      code: 'AUTHZ_004',
      message: 'Yetkiniz bu işlemi yapmaya yetmiyor.',
      status: 403
    }
  },

  // Validation Errors (400)
  VALIDATION: {
    MISSING_FIELD: {
      code: 'VAL_001',
      message: 'Gerekli alan eksik: {field}',
      status: 400
    },
    INVALID_FORMAT: {
      code: 'VAL_002',
      message: '{field} formatı hatalı.',
      status: 400
    },
    MISSING_FILE: {
      code: 'VAL_003',
      message: 'Dosya yüklemesi gerekli.',
      status: 400
    },
    INVALID_JSON: {
      code: 'VAL_004',
      message: 'JSON formatı hatalı: {field}',
      status: 400
    }
  },

  // Resource Errors (404)
  RESOURCE: {
    NOT_FOUND: {
      code: 'RES_001',
      message: '{resource} bulunamadı.',
      status: 404
    },
    TEMPLATE_NOT_FOUND: {
      code: 'RES_002',
      message: 'Şablon bulunamadı.',
      status: 404
    },
    REPORT_NOT_FOUND: {
      code: 'RES_003',
      message: 'Rapor bulunamadı.',
      status: 404
    }
  },

  // Database Errors (500)
  DATABASE: {
    CONNECTION_ERROR: {
      code: 'DB_001',
      message: 'Veritabanı bağlantı hatası.',
      status: 500
    },
    QUERY_ERROR: {
      code: 'DB_002',
      message: 'Veritabanı sorgusu başarısız.',
      status: 500
    },
    TRANSACTION_ERROR: {
      code: 'DB_003',
      message: 'İşlem başarısız oldu.',
      status: 500
    }
  },

  // File Errors (400/500)
  FILE: {
    UPLOAD_ERROR: {
      code: 'FILE_001',
      message: 'Dosya yükleme başarısız.',
      status: 400
    },
    READ_ERROR: {
      code: 'FILE_002',
      message: 'Dosya okuma başarısız.',
      status: 500
    },
    WRITE_ERROR: {
      code: 'FILE_003',
      message: 'Dosya yazma başarısız.',
      status: 500
    },
    INVALID_TYPE: {
      code: 'FILE_004',
      message: 'Geçersiz dosya türü. Yalnızca PDF dosyası kabul edilir.',
      status: 400
    }
  },

  // PDF Processing Errors (500)
  PDF: {
    PROCESSING_ERROR: {
      code: 'PDF_001',
      message: 'PDF işleme hatası.',
      status: 500
    },
    RENDERING_ERROR: {
      code: 'PDF_002',
      message: 'PDF oluşturma hatası.',
      status: 500
    },
    CORRUPTION_ERROR: {
      code: 'PDF_003',
      message: 'PDF dosyası bozuk.',
      status: 400
    }
  },

  // Server Errors (500)
  SERVER: {
    INTERNAL_ERROR: {
      code: 'SRV_001',
      message: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
      status: 500
    },
    PORT_IN_USE: {
      code: 'SRV_002',
      message: 'Port zaten kullanımda.',
      status: 500
    }
  }
};

/**
 * Error oluştur ve döndür
 * @param {string} errorKey - ERROR_CODES içinde anahtar (ör: 'AUTH.NO_SESSION')
 * @param {Object} replacements - Message içinde {field} gibi değerleri değiştirmek için
 */
function createError(errorKey, replacements = {}) {
  const keys = errorKey.split('.');
  let error = ERROR_CODES;
  
  for (const key of keys) {
    error = error[key];
    if (!error) {
      console.error(`Invalid error key: ${errorKey}`);
      return {
        code: 'SRV_001',
        message: 'Bilinmeyen hata oluştu.',
        status: 500
      };
    }
  }

  // Message içinde {field} gibi değerleri değiştir
  let message = error.message;
  for (const [key, value] of Object.entries(replacements)) {
    message = message.replace(`{${key}}`, value);
  }

  return {
    code: error.code,
    message,
    status: error.status
  };
}

/**
 * Error response gönder
 */
function sendError(res, errorKey, replacements = {}) {
  const error = createError(errorKey, replacements);
  return res.status(error.status).json({
    error: error.message,
    code: error.code
  });
}

module.exports = {
  ERROR_CODES,
  createError,
  sendError
};
