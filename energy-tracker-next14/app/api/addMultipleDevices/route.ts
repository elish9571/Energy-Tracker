// Add new devices correctly to the database

import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { devices } = req.body;
      const client = await clientPromise;
      const db = client.db('dbelish');
      const collection = db.collection('devices');
      
      // Insert multiple devices into the MongoDB collection
      const result = await collection.insertMany(devices);
      
      res.status(200).json({ message: 'Devices added successfully', result });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add devices', error });
    }
  } else {
    res.status(404).json({ message: 'Route not found' });
  }
}