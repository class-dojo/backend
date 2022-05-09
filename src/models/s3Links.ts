import AWS from 'aws-sdk';


export function generateS3PutLink () {
  const credentials = {
    accessKeyId: 'root',
    secretAccessKey: 'toor1234',
    region: 'eu-west-1',
  };

  AWS.config.update({credentials});
  const s3 = new AWS.S3({
    // apiVersion: '2006-03-01',
    signatureVersion: 'v4',
    endpoint: 'http://localhost:9000'
  });

  return s3.getSignedUrl('putObject', {
    Bucket: 'images',
    Key: 'images/dummy.jpg',
    Expires: 604800
  });
}

