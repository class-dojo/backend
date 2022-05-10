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
    endpoint: 'http://localhost:9000',
    s3ForcePathStyle: true,
  });

  return s3.getSignedUrl('putObject', {
    Bucket: 'images',
    Key: 'images/dummy.jpg',
    Expires: 604800
  });
}


const bucket = 'source-images-aws'; // the bucketname without s3://
const photo  = 'Screenshot 2022-05-07 204424.png'; // the name of file

const config = new AWS.Config({
  accessKeyId: 'AKIAQ3BCCU7BW3JADYCO',
  secretAccessKey: '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',
  region: 'eu-west-1'
});
const client = new AWS.Rekognition(config);
const params = {
  Image: {
    S3Object: {
      Bucket: bucket,
      Name: photo
    },
  },
  Attributes: ['ALL']
};

const S3 = new AWS.S3(config);

client.detectFaces(params, function (err, response) {
  if (err) {
    console.error(err, err.stack);
  } else {
    console.log(response.FaceDetails);

    const output = {
      [photo]: response.FaceDetails
    };

    const fileParams = {
      Bucket: bucket,
      Key: 'output.json',
      Body: JSON.stringify(output)
    };

    S3.upload(fileParams, function (err: any, data: any) {
      if (err) {
        console.error(err, err.stack);
      } else {
        console.log(data);
      }
    });
  }
});




