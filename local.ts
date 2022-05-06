import app from './src/app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {  // initialize server
  const hello = 'asdfsdf';
  console.log(`I am up and running at http://localhost:${PORT}`);
});
