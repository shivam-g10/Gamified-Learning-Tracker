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
      description:
        'Master fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs. Understand their implementation, time complexity, and when to use each one.',
      xp: 100,
      type: 'topic' as const,
      category: 'Core CS',
    },
    {
      title: 'Master Algorithms',
      description:
        'Study algorithm design techniques like divide and conquer, dynamic programming, greedy algorithms, and backtracking. Learn to analyze time and space complexity.',
      xp: 150,
      type: 'topic' as const,
      category: 'Core CS',
    },
    {
      title: 'Understand Big O Notation',
      description:
        'Learn asymptotic analysis and Big O notation to evaluate algorithm efficiency. Master worst-case, best-case, and average-case complexity analysis.',
      xp: 75,
      type: 'topic' as const,
      category: 'Core CS',
    },
    {
      title: 'Study Graph Theory',
      description:
        'Explore graph representations, traversal algorithms (DFS/BFS), shortest path algorithms, minimum spanning trees, and graph coloring problems.',
      xp: 120,
      type: 'topic' as const,
      category: 'Core CS',
    },
    {
      title: 'Learn Dynamic Programming',
      description:
        'Master dynamic programming techniques for solving optimization problems. Practice with classic problems like knapsack, longest common subsequence, and edit distance.',
      xp: 150,
      type: 'topic' as const,
      category: 'Core CS',
    },
    {
      title: 'Build a Sorting Algorithm',
      description:
        'Implement and compare different sorting algorithms including bubble sort, merge sort, quick sort, and heap sort. Analyze their performance characteristics.',
      xp: 80,
      type: 'project' as const,
      category: 'Core CS',
    },
    {
      title: 'Implement a Binary Tree',
      description:
        'Build a binary tree data structure with operations for insertion, deletion, traversal, and balancing. Implement AVL or Red-Black tree variants.',
      xp: 90,
      type: 'project' as const,
      category: 'Core CS',
    },

    // Systems
    {
      title: 'Learn Operating Systems',
      description:
        'Study OS concepts including process management, memory management, file systems, device drivers, and system calls. Understand how OS provides abstraction layers.',
      xp: 120,
      type: 'topic' as const,
      category: 'Systems',
    },
    {
      title: 'Study Process Management',
      description:
        'Learn about process creation, scheduling, synchronization, and communication. Understand context switching, process states, and inter-process communication.',
      xp: 100,
      type: 'topic' as const,
      category: 'Systems',
    },
    {
      title: 'Understand Memory Management',
      description:
        'Study virtual memory, paging, segmentation, memory allocation strategies, and garbage collection. Learn about memory leaks and optimization techniques.',
      xp: 110,
      type: 'topic' as const,
      category: 'Systems',
    },
    {
      title: 'Learn File Systems',
      description:
        'Understand file system design, directory structures, file allocation methods, and file system consistency. Study journaling and crash recovery.',
      xp: 90,
      type: 'topic' as const,
      category: 'Systems',
    },
    {
      title: 'Build a Simple Shell',
      description:
        'Create a command-line shell with basic features like command execution, piping, redirection, and job control. Implement built-in commands and signal handling.',
      xp: 130,
      type: 'project' as const,
      category: 'Systems',
    },

    // Networking
    {
      title: 'Learn Computer Networks',
      description:
        'Study network architecture, protocols, and layers. Understand the OSI model, TCP/IP stack, and how data flows through networks.',
      xp: 120,
      type: 'topic' as const,
      category: 'Networking',
    },
    {
      title: 'Study TCP/IP Protocol',
      description:
        'Master TCP/IP fundamentals including IP addressing, subnetting, routing, TCP connection management, and UDP characteristics.',
      xp: 100,
      type: 'topic' as const,
      category: 'Networking',
    },
    {
      title: 'Understand HTTP/HTTPS',
      description:
        'Learn HTTP methods, status codes, headers, cookies, sessions, and security. Understand how HTTPS provides encryption and authentication.',
      xp: 80,
      type: 'topic' as const,
      category: 'Networking',
    },
    {
      title: 'Learn DNS',
      description:
        'Study Domain Name System including DNS hierarchy, record types, resolution process, caching, and security considerations like DNSSEC.',
      xp: 70,
      type: 'topic' as const,
      category: 'Networking',
    },
    {
      title: 'Build a Chat Application',
      description:
        'Create a real-time chat application using WebSockets or similar technology. Implement user authentication, message persistence, and real-time updates.',
      xp: 140,
      type: 'project' as const,
      category: 'Networking',
    },

    // Databases
    {
      title: 'Learn SQL Fundamentals',
      description:
        'Master SQL basics including SELECT, INSERT, UPDATE, DELETE, JOINs, aggregations, and subqueries. Practice with real database schemas.',
      xp: 100,
      type: 'topic' as const,
      category: 'Databases',
    },
    {
      title: 'Study Database Design',
      description:
        'Learn normalization, entity-relationship modeling, indexing strategies, and query optimization. Understand ACID properties and transaction management.',
      xp: 120,
      type: 'topic' as const,
      category: 'Databases',
    },
    {
      title: 'Understand ACID Properties',
      description:
        'Master Atomicity, Consistency, Isolation, and Durability. Learn about transaction isolation levels, locks, and concurrency control mechanisms.',
      xp: 90,
      type: 'topic' as const,
      category: 'Databases',
    },
    {
      title: 'Learn NoSQL Databases',
      description:
        'Explore different NoSQL database types including document stores, key-value stores, column-family databases, and graph databases.',
      xp: 110,
      type: 'topic' as const,
      category: 'Databases',
    },
    {
      title: 'Build a Simple Database',
      description:
        'Implement a basic database engine with support for basic CRUD operations, simple queries, and transaction management. Focus on core concepts.',
      xp: 150,
      type: 'project' as const,
      category: 'Databases',
    },

    // Distributed Systems
    {
      title: 'Learn Distributed Systems',
      description:
        'Study distributed system principles including consistency, availability, partition tolerance, and fault tolerance. Understand the challenges of distributed computing.',
      xp: 150,
      type: 'topic' as const,
      category: 'Distributed',
    },
    {
      title: 'Study CAP Theorem',
      description:
        'Understand the CAP theorem trade-offs between consistency, availability, and partition tolerance. Learn how different systems make these trade-offs.',
      xp: 80,
      type: 'topic' as const,
      category: 'Distributed',
    },
    {
      title: 'Understand Consensus Algorithms',
      description:
        'Study consensus algorithms like Paxos, Raft, and Byzantine Fault Tolerance. Learn how distributed systems achieve agreement in the presence of failures.',
      xp: 120,
      type: 'topic' as const,
      category: 'Distributed',
    },
    {
      title: 'Learn Microservices',
      description:
        'Study microservices architecture including service decomposition, communication patterns, data consistency, and deployment strategies.',
      xp: 130,
      type: 'topic' as const,
      category: 'Distributed',
    },
    {
      title: 'Study Load Balancing',
      description:
        'Learn load balancing strategies, algorithms, and techniques for distributing traffic across multiple servers. Understand health checks and failover.',
      xp: 100,
      type: 'topic' as const,
      category: 'Distributed',
    },
    {
      title: 'Build a Distributed Cache',
      description:
        'Implement a distributed caching system with features like consistent hashing, replication, and cache invalidation. Handle node failures gracefully.',
      xp: 160,
      type: 'project' as const,
      category: 'Distributed',
    },
    {
      title: 'Implement Leader Election',
      description:
        'Build a leader election mechanism for distributed systems. Handle network partitions, node failures, and ensure only one leader exists.',
      xp: 140,
      type: 'project' as const,
      category: 'Distributed',
    },
    {
      title: 'Create a Service Mesh',
      description:
        'Implement a service mesh for managing service-to-service communication. Include features like service discovery, load balancing, and observability.',
      xp: 180,
      type: 'project' as const,
      category: 'Distributed',
    },

    // Software Engineering
    {
      title: 'Learn Design Patterns',
      description:
        'Master common design patterns including creational, structural, and behavioral patterns. Understand when and how to apply each pattern.',
      xp: 120,
      type: 'topic' as const,
      category: 'Software Engineering',
    },
    {
      title: 'Study SOLID Principles',
      description:
        'Learn SOLID principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.',
      xp: 100,
      type: 'topic' as const,
      category: 'Software Engineering',
    },
    {
      title: 'Understand Clean Code',
      description:
        'Learn principles of writing clean, readable, and maintainable code. Study naming conventions, function design, and code organization.',
      xp: 90,
      type: 'topic' as const,
      category: 'Software Engineering',
    },
    {
      title: 'Learn Testing Strategies',
      description:
        'Master different testing approaches including unit testing, integration testing, and test-driven development. Learn mocking and test organization.',
      xp: 110,
      type: 'topic' as const,
      category: 'Software Engineering',
    },
    {
      title: 'Build a CI/CD Pipeline',
      description:
        'Create a continuous integration and deployment pipeline using tools like Jenkins, GitHub Actions, or GitLab CI. Automate testing and deployment.',
      xp: 130,
      type: 'project' as const,
      category: 'Software Engineering',
    },
    {
      title: 'Create a Code Review Process',
      description:
        'Establish a code review process including guidelines, checklists, and tools. Implement automated checks and review workflows.',
      xp: 80,
      type: 'project' as const,
      category: 'Software Engineering',
    },

    // Performance & Debugging
    {
      title: 'Learn Performance Profiling',
      description:
        'Master performance profiling tools and techniques. Learn to identify bottlenecks, measure performance, and optimize critical code paths.',
      xp: 110,
      type: 'topic' as const,
      category: 'Performance & Debugging',
    },
    {
      title: 'Study Memory Leaks',
      description:
        'Learn to identify, debug, and prevent memory leaks. Use tools like Valgrind, AddressSanitizer, and memory profilers.',
      xp: 90,
      type: 'topic' as const,
      category: 'Performance & Debugging',
    },
    {
      title: 'Understand CPU Profiling',
      description:
        'Master CPU profiling techniques to identify performance bottlenecks. Learn to use tools like perf, gprof, and flame graphs.',
      xp: 100,
      type: 'topic' as const,
      category: 'Performance & Debugging',
    },
    {
      title: 'Learn Debugging Techniques',
      description:
        'Study systematic debugging approaches including logging, breakpoints, core dumps, and remote debugging. Learn to reproduce and isolate issues.',
      xp: 80,
      type: 'topic' as const,
      category: 'Performance & Debugging',
    },
    {
      title: 'Optimize a Slow Algorithm',
      description:
        'Take an existing slow algorithm and optimize it through algorithmic improvements, data structure changes, and implementation optimizations.',
      xp: 120,
      type: 'project' as const,
      category: 'Performance & Debugging',
    },

    // Security
    {
      title: 'Learn Web Security',
      description:
        'Study web application security including OWASP Top 10 vulnerabilities, secure coding practices, and security testing methodologies.',
      xp: 120,
      type: 'topic' as const,
      category: 'Security',
    },
    {
      title: 'Study OWASP Top 10',
      description:
        'Master the OWASP Top 10 web application security risks. Learn to identify, prevent, and remediate each vulnerability type.',
      xp: 100,
      type: 'topic' as const,
      category: 'Security',
    },
    {
      title: 'Understand Cryptography',
      description:
        'Study cryptographic fundamentals including symmetric/asymmetric encryption, hashing, digital signatures, and key management.',
      xp: 130,
      type: 'topic' as const,
      category: 'Security',
    },
    {
      title: 'Learn Authentication',
      description:
        'Master authentication mechanisms including passwords, multi-factor authentication, OAuth, JWT, and session management.',
      xp: 110,
      type: 'topic' as const,
      category: 'Security',
    },
    {
      title: 'Build a Secure API',
      description:
        'Create a REST API with comprehensive security measures including authentication, authorization, input validation, and rate limiting.',
      xp: 140,
      type: 'project' as const,
      category: 'Security',
    },

    // Architecture & Leadership
    {
      title: 'Learn System Design',
      description:
        'Master system design principles including scalability, reliability, and maintainability. Study design patterns and trade-offs.',
      xp: 150,
      type: 'topic' as const,
      category: 'Architecture & Leadership',
    },
    {
      title: 'Study Scalability Patterns',
      description:
        'Learn scalability patterns including horizontal scaling, caching, load balancing, database sharding, and asynchronous processing.',
      xp: 130,
      type: 'topic' as const,
      category: 'Architecture & Leadership',
    },
    {
      title: 'Understand Technical Leadership',
      description:
        'Study technical leadership skills including architecture decisions, team mentoring, code quality standards, and technical strategy.',
      xp: 120,
      type: 'topic' as const,
      category: 'Architecture & Leadership',
    },
    {
      title: 'Learn Code Review Best Practices',
      description:
        'Master effective code review techniques including constructive feedback, automated checks, and review process optimization.',
      xp: 80,
      type: 'topic' as const,
      category: 'Architecture & Leadership',
    },
    {
      title: 'Design a Scalable System',
      description:
        'Design a system that can handle millions of users. Consider scalability, reliability, and operational aspects in your design.',
      xp: 180,
      type: 'project' as const,
      category: 'Architecture & Leadership',
    },
    {
      title: 'Lead a Technical Project',
      description:
        'Take leadership of a technical project including planning, coordination, risk management, and delivery. Mentor team members.',
      xp: 160,
      type: 'project' as const,
      category: 'Architecture & Leadership',
    },

    // Math (Optional)
    {
      title: 'Review Linear Algebra',
      description:
        'Review linear algebra fundamentals including vectors, matrices, eigenvalues, eigenvectors, and their applications in computer science.',
      xp: 100,
      type: 'topic' as const,
      category: 'Math (Optional)',
    },
    {
      title: 'Study Calculus',
      description:
        'Study calculus concepts including limits, derivatives, integrals, and their applications in algorithms and machine learning.',
      xp: 120,
      type: 'topic' as const,
      category: 'Math (Optional)',
    },
    {
      title: 'Learn Probability',
      description:
        'Master probability concepts including random variables, distributions, expectation, and their applications in algorithms and data analysis.',
      xp: 90,
      type: 'topic' as const,
      category: 'Math (Optional)',
    },
    {
      title: 'Understand Statistics',
      description:
        'Learn statistical concepts including hypothesis testing, confidence intervals, regression, and their applications in data science.',
      xp: 110,
      type: 'topic' as const,
      category: 'Math (Optional)',
    },
    {
      title: 'Solve Math Problems',
      description:
        'Practice solving mathematical problems relevant to computer science including combinatorics, number theory, and optimization.',
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
