require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Question = require('./models/Question');

const sampleQuestions = [
  {
    questionText: 'What is the worst-case time complexity of binary search on a sorted array of size n?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 1,
    category: 'Algorithms',
  },
  {
    questionText: 'Which HTTP status code indicates that a request succeeded and a new resource was created?',
    options: ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'],
    correctAnswer: 1,
    category: 'Web Development',
  },
  {
    questionText: 'In React, which hook is used to perform side effects such as fetching data or setting up timers?',
    options: ['useState', 'useMemo', 'useEffect', 'useCallback'],
    correctAnswer: 2,
    category: 'React',
  },
  {
    questionText: 'Which data structure operates on a First-In, First-Out (FIFO) basis?',
    options: ['Stack', 'Queue', 'Binary Tree', 'Hash Table'],
    correctAnswer: 1,
    category: 'Data Structures',
  },
  {
    questionText: 'In MongoDB, what is the default field name used as the primary key for every document?',
    options: ['id', 'pk', '_id', 'uid'],
    correctAnswer: 2,
    category: 'Databases',
  },
  {
    questionText: 'Which of the following SQL clauses is used to filter grouped records?',
    options: ['WHERE', 'GROUP BY', 'HAVING', 'ORDER BY'],
    correctAnswer: 2,
    category: 'Databases',
  },
  {
    questionText: 'What does the "typeof null" expression evaluate to in JavaScript?',
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correctAnswer: 2,
    category: 'JavaScript',
  },
  {
    questionText: 'In Node.js, which module is built-in for handling file system operations?',
    options: ['http', 'fs', 'path', 'os'],
    correctAnswer: 1,
    category: 'Node.js',
  },
  {
    questionText: 'Which HTTP method is considered idempotent and is typically used to replace an existing resource?',
    options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
    correctAnswer: 1,
    category: 'Web Development',
  },
  {
    questionText: 'What is the primary purpose of an index in a database table or collection?',
    options: [
      'To encrypt stored data',
      'To reduce disk storage usage',
      'To speed up data retrieval queries',
      'To enforce foreign key naming rules',
    ],
    correctAnswer: 2,
    category: 'Databases',
  },
  {
    questionText: 'Which protocol is used to securely transmit data over the web using TLS encryption?',
    options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
    correctAnswer: 2,
    category: 'Networking',
  },
  {
    questionText: 'In Git, which command creates a new branch and switches to it immediately?',
    options: [
      'git branch new-branch',
      'git checkout -b new-branch',
      'git merge new-branch',
      'git init new-branch',
    ],
    correctAnswer: 1,
    category: 'Tools',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: 'password123',
        role: 'admin',
      });
      console.log('Created admin account: admin@example.com / password123');
    }

    const studentEmail = 'student@example.com';
    const existingStudent = await User.findOne({ email: studentEmail });
    if (!existingStudent) {
      await User.create({
        name: 'Demo Student',
        email: studentEmail,
        password: 'password123',
        role: 'student',
      });
      console.log('Created student account: student@example.com / password123');
    }

    const count = await Question.countDocuments();
    if (count === 0) {
      await Question.insertMany(sampleQuestions);
      console.log(`Inserted ${sampleQuestions.length} sample questions`);
    } else {
      console.log(`Database already has ${count} questions. Skipping question seed.`);
    }

    await mongoose.disconnect();
    console.log('Seeding complete');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
