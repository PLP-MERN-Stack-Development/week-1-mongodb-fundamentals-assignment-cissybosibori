// insert_books.js - Script to populate MongoDB with sample book data

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

const books = [
  {
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    genre: 'Programming',
    published_year: 2018,
    price: 25,
    in_stock: true,
    pages: 472,
    publisher: 'No Starch Press'
  },
  {
    title: 'The Nature of Code',
    author: 'Daniel Shiffman',
    genre: 'Creative Coding',
    published_year: 2012,
    price: 30,
    in_stock: true,
    pages: 498,
    publisher: 'Self-published'
  },
  {
    title: '48 Laws of Power',
    author: 'Robert Greene',
    genre: 'Self-help',
    published_year: 1998,
    price: 20,
    in_stock: false,
    pages: 452,
    publisher: 'Viking Press'
  },
  {
    title: 'Fullstack Open',
    author: 'University of Helsinki',
    genre: 'Web Development',
    published_year: 2021,
    price: 0,
    in_stock: true,
    pages: 700,
    publisher: 'University of Helsinki'
  },
  {
    title: 'The Power of the Subconscious Mind',
    author: 'Joseph Murphy',
    genre: 'Spirituality',
    published_year: 1963,
    price: 18,
    in_stock: true,
    pages: 320,
    publisher: 'Pocket Books'
  },
  {
    title: 'The Brain',
    author: 'David Eagleman',
    genre: 'Science',
    published_year: 2015,
    price: 22,
    in_stock: true,
    pages: 256,
    publisher: 'Pantheon'
  },
  {
    title: 'The Defining Decade',
    author: 'Meg Jay',
    genre: 'Psychology',
    published_year: 2012,
    price: 19,
    in_stock: true,
    pages: 272,
    publisher: 'Twelve'
  },
  {
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    genre: 'Self-help',
    published_year: 1937,
    price: 15,
    in_stock: false,
    pages: 238,
    publisher: 'The Ralston Society'
  },
  {
    title: 'Harry Potter',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    published_year: 1997,
    price: 29,
    in_stock: true,
    pages: 309,
    publisher: 'Bloomsbury'
  },
  {
    title: 'Diary of a Wimpy Kid',
    author: 'Jeff Kinney',
    genre: 'Children',
    published_year: 2007,
    price: 12,
    in_stock: true,
    pages: 217,
    publisher: 'Amulet Books'
  },
  {
    title: 'It Ends With Us',
    author: 'Colleen Hoover',
    genre: 'Romance',
    published_year: 2016,
    price: 14,
    in_stock: true,
    pages: 384,
    publisher: 'Atria Books'
  }
];

async function insertBooks() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(`⚠️ Collection already has ${count} documents. Dropping collection...`);
      await collection.drop();
    }

    const result = await collection.insertMany(books);
    console.log(`✅ ${result.insertedCount} books inserted.`);

    const insertedBooks = await collection.find({}).toArray();
    console.log('\n📚 Inserted Books:');
    insertedBooks.forEach((book, i) => {
      console.log(`${i + 1}. "${book.title}" by ${book.author}`);
    });

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await client.close();
    console.log('🔌 Connection closed.');
  }
}

insertBooks();
