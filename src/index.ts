import 'dotenv/config';

const PORT = parseInt(process.env.PORT || '3000', 10);

console.log(`Deepgent starting on port ${PORT}`);

process.exit(0);
