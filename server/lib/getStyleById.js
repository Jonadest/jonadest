import clientPromise from './mongodb'; // your MongoDB connection helper
import { ObjectId } from 'mongodb';

export async function getStyleById(id) {
  const client = await clientPromise;
  const db = client.db('clients');
  const style = await db
    .collection('styles')
    .findOne({ _id: new ObjectId(id) });
  return style;
}
