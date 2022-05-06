import app from './src/app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {  // initialize server
  const helo='hey';
  console.log(`I am up and running at http://localhost:${PORT}`);
});
