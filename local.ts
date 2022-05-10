import app from './src/app';

// no need for env variable as this is only needed for local dev
const PORT = 5000;

app.listen(PORT, () => {  // initialize server
  console.log(`I am up and running at http://localhost:${PORT}`);
});
