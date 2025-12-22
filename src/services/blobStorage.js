// Vercel Blob Storage adapter
const { put, del, list, head } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');
const logger = require('./services/logger');
const config = require('./config.vercel');

class BlobStorage {
  constructor() {
    this.token = config.blobToken;
    if (!this.token) {
      logger.warn('Vercel Blob token not configured - falling back to local storage');
    }
  }

  /**
   * Upload file to Vercel Blob
   * @param {string} filePath - Local file path
   * @param {string} remotePath - Remote blob path (e.g., 'templates/file.pdf')
   * @returns {Promise<{url: string, pathname: string}>}
   */
  async upload(filePath, remotePath) {
    try {
      if (!this.token) {
        throw new Error('Vercel Blob token not configured');
      }

      const fileBuffer = fs.readFileSync(filePath);
      const blob = await put(remotePath, fileBuffer, {
        access: 'public',
        token: this.token
      });

      logger.info('File uploaded to Vercel Blob', {
        remotePath,
        url: blob.url,
        size: fileBuffer.length
      });

      return blob;
    } catch (err) {
      logger.error('Vercel Blob upload error', {
        error: err.message,
        filePath,
        remotePath
      });
      throw err;
    }
  }

  /**
   * Delete file from Vercel Blob
   * @param {string} url - Blob URL
   */
  async delete(url) {
    try {
      if (!this.token) {
        throw new Error('Vercel Blob token not configured');
      }

      await del(url, { token: this.token });
      
      logger.info('File deleted from Vercel Blob', { url });
    } catch (err) {
      logger.error('Vercel Blob delete error', {
        error: err.message,
        url
      });
      throw err;
    }
  }

  /**
   * List files in Vercel Blob
   * @param {string} prefix - Path prefix (e.g., 'templates/')
   */
  async listFiles(prefix = '') {
    try {
      if (!this.token) {
        throw new Error('Vercel Blob token not configured');
      }

      const { blobs } = await list({
        prefix,
        token: this.token
      });

      return blobs;
    } catch (err) {
      logger.error('Vercel Blob list error', {
        error: err.message,
        prefix
      });
      throw err;
    }
  }

  /**
   * Get file metadata
   * @param {string} url - Blob URL
   */
  async getMetadata(url) {
    try {
      if (!this.token) {
        throw new Error('Vercel Blob token not configured');
      }

      const metadata = await head(url, { token: this.token });
      return metadata;
    } catch (err) {
      logger.error('Vercel Blob metadata error', {
        error: err.message,
        url
      });
      throw err;
    }
  }
}

// Export singleton instance
module.exports = new BlobStorage();
