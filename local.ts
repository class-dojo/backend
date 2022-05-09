import app from './src/app';
import {generateS3PutLink} from './src/models/s3Links';

const PORT = process.env.PORT || 5000;

const link = generateS3PutLink();

console.log(link);

app.listen(PORT, () => {  // initialize server
  console.log(`I am up and running at http://localhost:${PORT}`);
});
