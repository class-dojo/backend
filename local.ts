import app from './src/app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {  // initialize server
  console.log(`I am up and running at http://localhost:${PORT}`);
});
