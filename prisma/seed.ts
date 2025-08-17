import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting to seed database...');

  // Clear existing data
  await prisma.bookProgressEntry.deleteMany();
  await prisma.courseProgressEntry.deleteMany();
  await prisma.book.deleteMany();
  await prisma.course.deleteMany();
  await prisma.focusSlot.deleteMany();
  await prisma.quest.deleteMany();
  await prisma.appState.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create initial app state
  const appState = await prisma.appState.create({
    data: {
      id: 1,
      streak: 0,
      focus: [],
    },
  });
  console.log('📱 Created initial app state');

  // Create sample quests
  const quests = [
    // Core CS
    {
      title: 'Learn Data Structures',
      xp: 100,
      type: 'topic' as const,
      category: 'Core CS',
    },
    {
      title: 'Master Algorithms',
      xp: 150,
      type: 'topic' as const,
      category: 'Core CS',
    },
    {
      title: 'Understand Big O Notation',
      xp: 75,
      type: 'topic' as const,
      category: 'Core CS',
    },
    {
      title: 'Study Graph Theory',
      xp: 120,
      type: 'topic' as const,
      category: 'Core CS',
    },
    {
      title: 'Learn Dynamic Programming',
      xp: 150,
      type: 'topic' as const,
      category: 'Core CS',
    },
    {
      title: 'Build a Sorting Algorithm',
      xp: 80,
      type: 'project' as const,
      category: 'Core CS',
    },
    {
      title: 'Implement a Binary Tree',
      xp: 90,
      type: 'project' as const,
      category: 'Core CS',
    },

    // Systems
    {
      title: 'Learn Operating Systems',
      xp: 120,
      type: 'topic' as const,
      category: 'Systems',
    },
    {
      title: 'Study Process Management',
      xp: 100,
      type: 'topic' as const,
      category: 'Systems',
    },
    {
      title: 'Understand Memory Management',
      xp: 110,
      type: 'topic' as const,
      category: 'Systems',
    },
    {
      title: 'Learn File Systems',
      xp: 90,
      type: 'topic' as const,
      category: 'Systems',
    },
    {
      title: 'Build a Simple Shell',
      xp: 130,
      type: 'project' as const,
      category: 'Systems',
    },

    // Networking
    {
      title: 'Learn Computer Networks',
      xp: 120,
      type: 'topic' as const,
      category: 'Networking',
    },
    {
      title: 'Study TCP/IP Protocol',
      xp: 100,
      type: 'topic' as const,
      category: 'Networking',
    },
    {
      title: 'Understand HTTP/HTTPS',
      xp: 80,
      type: 'topic' as const,
      category: 'Networking',
    },
    {
      title: 'Learn DNS',
      xp: 70,
      type: 'topic' as const,
      category: 'Networking',
    },
    {
      title: 'Build a Chat Application',
      xp: 140,
      type: 'project' as const,
      category: 'Networking',
    },

    // Databases
    {
      title: 'Learn SQL Fundamentals',
      xp: 100,
      type: 'topic' as const,
      category: 'Databases',
    },
    {
      title: 'Study Database Design',
      xp: 120,
      type: 'topic' as const,
      category: 'Databases',
    },
    {
      title: 'Understand ACID Properties',
      xp: 90,
      type: 'topic' as const,
      category: 'Databases',
    },
    {
      title: 'Learn NoSQL Databases',
      xp: 110,
      type: 'topic' as const,
      category: 'Databases',
    },
    {
      title: 'Build a Simple Database',
      xp: 150,
      type: 'project' as const,
      category: 'Databases',
    },

    // Distributed Systems
    {
      title: 'Learn Distributed Systems',
      xp: 150,
      type: 'topic' as const,
      category: 'Distributed',
    },
    {
      title: 'Study CAP Theorem',
      xp: 80,
      type: 'topic' as const,
      category: 'Distributed',
    },
    {
      title: 'Understand Consensus Algorithms',
      xp: 120,
      type: 'topic' as const,
      category: 'Distributed',
    },
    {
      title: 'Learn Microservices',
      xp: 130,
      type: 'topic' as const,
      category: 'Distributed',
    },
    {
      title: 'Study Load Balancing',
      xp: 100,
      type: 'topic' as const,
      category: 'Distributed',
    },
    {
      title: 'Build a Distributed Cache',
      xp: 160,
      type: 'project' as const,
      category: 'Distributed',
    },
    {
      title: 'Implement Leader Election',
      xp: 140,
      type: 'project' as const,
      category: 'Distributed',
    },
    {
      title: 'Create a Service Mesh',
      xp: 180,
      type: 'project' as const,
      category: 'Distributed',
    },

    // Software Engineering
    {
      title: 'Learn Design Patterns',
      xp: 120,
      type: 'topic' as const,
      category: 'Software Engineering',
    },
    {
      title: 'Study SOLID Principles',
      xp: 100,
      type: 'topic' as const,
      category: 'Software Engineering',
    },
    {
      title: 'Understand Clean Code',
      xp: 90,
      type: 'topic' as const,
      category: 'Software Engineering',
    },
    {
      title: 'Learn Testing Strategies',
      xp: 110,
      type: 'topic' as const,
      category: 'Software Engineering',
    },
    {
      title: 'Build a CI/CD Pipeline',
      xp: 130,
      type: 'project' as const,
      category: 'Software Engineering',
    },
    {
      title: 'Create a Code Review Process',
      xp: 80,
      type: 'project' as const,
      category: 'Software Engineering',
    },

    // Performance & Debugging
    {
      title: 'Learn Performance Profiling',
      xp: 110,
      type: 'topic' as const,
      category: 'Performance & Debugging',
    },
    {
      title: 'Study Memory Leaks',
      xp: 90,
      type: 'topic' as const,
      category: 'Performance & Debugging',
    },
    {
      title: 'Understand CPU Profiling',
      xp: 100,
      type: 'topic' as const,
      category: 'Performance & Debugging',
    },
    {
      title: 'Learn Debugging Techniques',
      xp: 80,
      type: 'topic' as const,
      category: 'Performance & Debugging',
    },
    {
      title: 'Optimize a Slow Algorithm',
      xp: 120,
      type: 'project' as const,
      category: 'Performance & Debugging',
    },

    // Security
    {
      title: 'Learn Web Security',
      xp: 120,
      type: 'topic' as const,
      category: 'Security',
    },
    {
      title: 'Study OWASP Top 10',
      xp: 100,
      type: 'topic' as const,
      category: 'Security',
    },
    {
      title: 'Understand Cryptography',
      xp: 130,
      type: 'topic' as const,
      category: 'Security',
    },
    {
      title: 'Learn Authentication',
      xp: 110,
      type: 'topic' as const,
      category: 'Security',
    },
    {
      title: 'Build a Secure API',
      xp: 140,
      type: 'project' as const,
      category: 'Security',
    },

    // Architecture & Leadership
    {
      title: 'Learn System Design',
      xp: 150,
      type: 'topic' as const,
      category: 'Architecture & Leadership',
    },
    {
      title: 'Study Scalability Patterns',
      xp: 130,
      type: 'topic' as const,
      category: 'Architecture & Leadership',
    },
    {
      title: 'Understand Technical Leadership',
      xp: 120,
      type: 'topic' as const,
      category: 'Architecture & Leadership',
    },
    {
      title: 'Learn Code Review Best Practices',
      xp: 80,
      type: 'topic' as const,
      category: 'Architecture & Leadership',
    },
    {
      title: 'Design a Scalable System',
      xp: 180,
      type: 'project' as const,
      category: 'Architecture & Leadership',
    },
    {
      title: 'Lead a Technical Project',
      xp: 160,
      type: 'project' as const,
      category: 'Architecture & Leadership',
    },

    // Math (Optional)
    {
      title: 'Review Linear Algebra',
      xp: 100,
      type: 'topic' as const,
      category: 'Math (Optional)',
    },
    {
      title: 'Study Calculus',
      xp: 120,
      type: 'topic' as const,
      category: 'Math (Optional)',
    },
    {
      title: 'Learn Probability',
      xp: 90,
      type: 'topic' as const,
      category: 'Math (Optional)',
    },
    {
      title: 'Understand Statistics',
      xp: 110,
      type: 'topic' as const,
      category: 'Math (Optional)',
    },
    {
      title: 'Solve Math Problems',
      xp: 80,
      type: 'project' as const,
      category: 'Math (Optional)',
    },
  ];

  for (const quest of quests) {
    await prisma.quest.create({
      data: quest,
    });
  }

  console.log('✅ Created', quests.length, 'quests');

  // Create sample books
  const books = [
    {
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
      total_pages: 416,
      current_page: 0,
      status: 'backlog' as const,
      category: 'Software Engineering',
      description:
        'The classic book on design patterns in software development.',
      tags: ['design-patterns', 'software-engineering', 'object-oriented'],
    },
    {
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      total_pages: 464,
      current_page: 0,
        status: 'backlog' as const,
      category: 'Software Engineering',
      description: 'Learn how to write clean, maintainable code.',
      tags: ['clean-code', 'software-engineering', 'best-practices'],
    },
    {
      title: 'The Pragmatic Programmer: Your Journey to Mastery',
      author: 'David Thomas, Andrew Hunt',
      total_pages: 352,
      current_page: 0,
        status: 'backlog' as const,
      category: 'Software Engineering',
      description: 'Essential insights for becoming a better programmer.',
      tags: ['programming', 'career-development', 'best-practices'],
    },
    {
      title: "System Design Interview: An Insider's Guide",
      author: 'Alex Xu',
      total_pages: 320,
      current_page: 0,
      status: 'backlog' as const,
      category: 'Architecture & Leadership',
      description: 'Master system design interviews with real-world examples.',
      tags: ['system-design', 'interviews', 'architecture'],
    },
    {
      title:
        'Database Design for Mere Mortals: A Hands-On Guide to Relational Database Design',
      author: 'Michael J. Hernandez',
      total_pages: 672,
      current_page: 0,
        status: 'backlog' as const,
      category: 'Databases',
      description: 'Learn database design fundamentals.',
      tags: ['databases', 'design', 'relational'],
    },
  ];

  for (const book of books) {
    await prisma.book.create({
      data: book,
    });
  }

  console.log('📚 Created', books.length, 'books');

  // Create sample courses
  const courses = [
    {
      title: 'CS50: Introduction to Computer Science',
      platform: 'edX',
      url: 'https://cs50.edx.org/',
      total_units: 12,
      completed_units: 0,
          status: 'backlog' as const,
      category: 'Core CS',
      description:
        "Harvard's introduction to computer science and programming.",
      tags: ['computer-science', 'programming', 'python', 'c'],
    },
    {
      title: 'Algorithms, Part I',
      platform: 'Coursera',
      url: 'https://www.coursera.org/learn/algorithms-part1',
      total_units: 6,
      completed_units: 0,
        status: 'backlog' as const,
      category: 'Core CS',
      description:
        "Princeton's algorithms course covering fundamental data structures.",
      tags: ['algorithms', 'data-structures', 'java'],
    },
    {
      title: 'System Design Interview',
      platform: 'InterviewBit',
      url: 'https://www.interviewbit.com/system-design-interview/',
      total_units: 20,
      completed_units: 0,
      status: 'backlog' as const,
      category: 'Architecture & Leadership',
      description: 'Comprehensive system design interview preparation.',
      tags: ['system-design', 'interviews', 'architecture'],
    },
    {
      title: 'Web Security Fundamentals',
      platform: 'OWASP',
      url: 'https://owasp.org/www-project-web-security-testing-guide/',
      total_units: 15,
      completed_units: 0,
        status: 'backlog' as const,
      category: 'Security',
      description: 'Learn web application security from OWASP.',
      tags: ['security', 'web-development', 'owasp'],
    },
    {
      title: 'Docker and Kubernetes: The Complete Guide',
      platform: 'Udemy',
      url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/',
      total_units: 25,
      completed_units: 0,
      status: 'backlog' as const,
      category: 'Distributed',
      description: 'Master containerization and orchestration.',
      tags: ['docker', 'kubernetes', 'devops', 'containers'],
    },
  ];

  for (const course of courses) {
    await prisma.course.create({
      data: course,
    });
  }

  console.log('🎓 Created', courses.length, 'courses');

  // Create initial focus slot
  await prisma.focusSlot.create({
    data: {
      quest_id: null,
      book_id: null,
      course_id: null,
    },
  });

  console.log('🎯 Created initial focus slot');

  // Calculate total XP
  const totalXp = quests.reduce((sum, quest) => sum + quest.xp, 0);
  console.log('🎯 Total XP available:', totalXp);

  // Show quests by category
  const questsByCategory = quests.reduce(
    (acc, quest) => {
      acc[quest.category] = (acc[quest.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  console.log('\n📊 Quests by category:');
  Object.entries(questsByCategory).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} quests`);
  });

  console.log('\n🚀 Database seeding completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
