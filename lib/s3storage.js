'use strict';
var debug = require('debug')('s3storage');
var AWS = require("aws-sdk");
var s3Stream = require("s3-upload-stream");
var superagent = require('superagent');

module.exports = s3Storage;

function s3Storage(config) {
  if(!config) {
    throw new Error('s3storage needs S3 config object');
  }
  
  if(!(this instanceof s3Storage)) {
    return new s3Storage(config);
  }

  this.config = config;
}


/**
 * Returns stream provided by superagent with file from S3
 */

s3Storage.prototype.get = function(location) {
  return superagent.get(location);
}


/**
 * Stores a file in S3 and callk callback with upload details
 * @param {Stream} inputStream. Stream to upload from.
 * @param {Function} callback. Function to call with upload details
 *   - {Error} err. Null if nothing bad happened
 *   - {Function} details. Upload details as received from S3.
 *       {
 *         Location: 'https://bucketName.s3.amazonaws.com/filename.ext',
 *         Bucket: 'bucketName',
 *         Key: 'filename.ext',
 *         ETag: '"bf2acbedf84207d696c8da7dbb205b9f-5"'
 *       }
 */
s3Storage.prototype.save = function(inputStream, s3Key, callback) {

  var _this = this;

  // Set the client to be used for the upload.
  AWS.config.update(_this.config);
  s3Stream.client(new AWS.S3());

  var uploadStream = new s3Stream.upload({
    "Bucket": _this.config.bucket,
    "Key": s3Key,
    "ACL": "public-read"
  });

  uploadStream.once('uploaded', function(details) {
    debug("File %s stored succesfully on bucket %s.", details.Key, details.Bucket);
    callback(null, details);
  });
  //this.uploadStream.maxPartSize(2048);

  uploadStream.on('error', function(error) {
    debug("Error:");
    debug(error);
    callback(error);
  });

  uploadStream.on('part', function(details) {
    /* Handle progress. Example details object:
    {
      ETag: '"f9ef956c83756a80ad62f54ae5e7d34b"',
      PartNumber: 5,
      receivedSize: 29671068,
      uploadedSize: 29671068
    }
    */
  });

  debug("Started piping to S3");
  inputStream.pipe(uploadStream);

}
