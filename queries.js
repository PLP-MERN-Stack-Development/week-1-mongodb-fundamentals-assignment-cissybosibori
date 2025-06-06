
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function runQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. Find all books in a specific genre
    const genre = 'Self-help';
    const booksInGenre = await collection.find(
      { genre },
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).toArray();
    console.log(`\nBooks in genre "${genre}":`, booksInGenre);

    // 2. Find books published after a certain year
    const year = 2010;
    const booksAfterYear = await collection.find(
      { published_year: { $gt: year } },
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).toArray();
    console.log(`\nBooks published after ${year}:`, booksAfterYear);

    // 3. Find books by a specific author
    const author = 'J.K. Rowling';
    const booksByAuthor = await collection.find(
      { author },
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).toArray();
    console.log(`\nBooks by author "${author}":`, booksByAuthor);

    // 4. Update the price of a specific book
    const titleToUpdate = 'Fullstack Open'
    const newPrice = 10.00;
    const updateResult = await collection.updateOne(
      { title: titleToUpdate },
      { $set: { price: newPrice } }
    );
    console.log(`\nUpdated price for "${titleToUpdate}":`, updateResult.modifiedCount === 1 ? 'Success' : 'Failed');

    // 5. Delete a book by its title 
    const titleToDelete = 'Diary of a Wimpy Kid';
    const deleteResult = await collection.deleteOne({ title: titleToDelete });
    console.log(`\nDeleted "${titleToDelete}":`, deleteResult.deletedCount === 1 ? 'Success' : 'Failed');

    // --- Advanced Queries ---

    // 6. Find books that are both in stock and published after 2010
    const booksInStockAfter2010 = await collection.find(
      { in_stock: true, published_year: { $gt: 2010 } },
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).toArray();
    console.log('\nBooks in stock and published after 2010:', booksInStockAfter2010);

    // 7. Sorting by price ascending
    const booksSortedAsc = await collection.find(
      {},
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).sort({ price: 1 }).toArray();
    console.log('\nBooks sorted by price (ascending):', booksSortedAsc);

    // 8. Sorting by price descending
    const booksSortedDesc = await collection.find(
      {},
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).sort({ price: -1 }).toArray();
    console.log('\nBooks sorted by price (descending):', booksSortedDesc);

    // 9. Pagination: get page 2 with 5 books per page (skip first 5)
    const page = 2;
    const pageSize = 5;
    const paginatedBooks = await collection.find(
      {},
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    )
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    console.log(`\nBooks page ${page} (5 books per page):`, paginatedBooks);

    // --- Aggregation Pipelines ---

    // 10. Average price of books by genre
    const avgPriceByGenre = await collection.aggregate([
      { $group: { _id: '$genre', averagePrice: { $avg: '$price' } } }
    ]).toArray();
    console.log('\nAverage price by genre:', avgPriceByGenre);

    // 11. Author with the most books
    const topAuthor = await collection.aggregate([
      { $group: { _id: '$author', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray();
    console.log('\nAuthor with the most books:', topAuthor);

    // 12. Group books by publication decade and count
    const booksByDecade = await collection.aggregate([
      {
        $group: {
          _id: {
            decade: {
              $multiply: [{ $floor: { $divide: ['$published_year', 10] } }, 10]
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.decade': 1 } }
    ]).toArray();
    console.log('\nBooks grouped by publication decade:', booksByDecade);

    // --- Indexing ---

    // 13. Create an index on title
    await collection.createIndex({ title: 1 });
    console.log('\nIndex created on "title" field');

    // 14. Create compound index on author and published_year
    await collection.createIndex({ author: 1, published_year: 1 });
    console.log('Compound index created on "author" and "published_year" fields');

    // 15. Demonstrate explain() with and without index
    // Run a query to find by title with explain
    const explainWithoutIndex = await collection.find({ title: 'The Power of Habit' }).explain('executionStats');
    console.log('\nExplain plan for find by title (with indexes):');
    console.log(JSON.stringify(explainWithoutIndex.executionStats, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

runQueries();
