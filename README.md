## s3-tile-storage
 
A module to extend [express-tile-cache](https://github.com/CGastrell/express-tile-cache) tile storage to use remote S3 backend. 


## Overview

**s3-tile-storage** creates a remote storage for tiles. Read the express-tile-cache documentation on how storage is implemented.

    
    var s3storage = require("s3-tile-storage");



## Installation 

    npm install s3-tile-storage --save

## Usage

Create a new instance of the storage object with S3 configuration and assign it to a tile source configuration:

    var express = require("express"),
      tilecache = require("express-tile-cache"),
      s3storage = require("s3-tile-storage"),
      app = express();

    var argenmapcache = s3storage({
      accessKeyId: "AWS-ACCESS-KEY",
      secretAccessKey: "AWS-SECRET-KEY",
      region: "your-region",
      bucket: "some-already-created-bucket",
    });

    var argenmaptiles = {
      urlTemplate: "http://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0",
      storage: argenmapcache
    }

    app.use(tilecache(argenmaptiles));


## Inner workings

Uses [AWS-SDK](https://www.npmjs.com/package/aws-sdk) to instance S3 object and upload. You need to have access to an AWS account and have a configured and working S3 bucket.


## API

### Module

The **s3-tile-storage** module returns a function. 

    var s3storage = require("s3-tile-storage");

#### s3-tile-storage.save(stream, filename, callback)

**Arguments**

* `stream` - **Required**. A **readable stream**. This usually comes from a request you're trying to cache.

* `filename` - **Required**. A **string**. The filename for the tile. express-tile-cache hashes every tilename, but if you want to extend/modify this module, this is where you set the name (key in AWS lexicon) the file is going to have.

* `callback` - **Required** {Function}. This function will bring back the properties reported by S3 after uploading the file:

  * Location: 'https://bucketName.s3.amazonaws.com/filename.ext',
  * Bucket: 'bucketName',
  * Key: 'filename.ext',
  * ETag: 'bf2acbedf84207d696c8da7dbb205b9f-5'

#### s3-tile-storage.get(tileurl)

Gets the provided tile and serves it.


#License 

The MIT License (MIT)

Copyright (c) 2014, 2015 Shovel apps, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.