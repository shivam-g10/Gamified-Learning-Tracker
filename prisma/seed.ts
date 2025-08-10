import { PrismaClient, QuestType } from '@prisma/client'

const prisma = new PrismaClient()

const quests = [
  // Core CS
  {
    title: "Implement: list, stack, queue, deque, heap, tree, trie, graph (Rust)",
    xp: 60,
    type: QuestType.topic,
    category: "Core CS"
  },
  {
    title: "Algorithms: mergesort, quicksort, heap sort, binary search, BFS/DFS",
    xp: 40,
    type: QuestType.topic,
    category: "Core CS"
  },
  {
    title: "Algorithms: Dijkstra, A*, Kruskal/Prim, Topological Sort",
    xp: 60,
    type: QuestType.topic,
    category: "Core CS"
  },
  {
    title: "Implement dynamic programming problems (Knapsack, LIS, Edit Distance)",
    xp: 50,
    type: QuestType.topic,
    category: "Core CS"
  },
  {
    title: "Complexity analysis: time, space, amortized",
    xp: 30,
    type: QuestType.topic,
    category: "Core CS"
  },
  {
    title: "Build a Rust 'algorithms library' crate with tested DS/Algo implementations",
    xp: 70,
    type: QuestType.project,
    category: "Core CS"
  },
  {
    title: "Write a Big-O cheat sheet with examples from your own systems",
    xp: 20,
    type: QuestType.bonus,
    category: "Core CS"
  },

  // Systems
  {
    title: "OS internals: threads vs processes, schedulers; simulate page replacement",
    xp: 50,
    type: QuestType.topic,
    category: "Systems"
  },
  {
    title: "Signals, syscalls, and context switching explained via a Rust demo",
    xp: 40,
    type: QuestType.topic,
    category: "Systems"
  },
  {
    title: "Filesystem basics: inodes, journaling, mounts",
    xp: 30,
    type: QuestType.topic,
    category: "Systems"
  },
  {
    title: "Write a minimal shell in Rust that supports pipes, redirects, and built-ins",
    xp: 70,
    type: QuestType.project,
    category: "Systems"
  },
  {
    title: "Profile a Rust app with `perf` + flamegraph; document 2 optimizations",
    xp: 35,
    type: QuestType.bonus,
    category: "Systems"
  },

  // Networking
  {
    title: "TCP vs UDP deep dive; handshake, teardown, reliability",
    xp: 35,
    type: QuestType.topic,
    category: "Networking"
  },
  {
    title: "HTTP/1.1 vs HTTP/2 vs HTTP/3 tradeoffs",
    xp: 30,
    type: QuestType.topic,
    category: "Networking"
  },
  {
    title: "Build a minimal TCP + HTTP/1.1 server in Rust (no frameworks)",
    xp: 70,
    type: QuestType.project,
    category: "Networking"
  },
  {
    title: "Write a concurrent WebSocket chat server in Rust",
    xp: 60,
    type: QuestType.project,
    category: "Networking"
  },
  {
    title: "Simulate packet loss and latency in a test network",
    xp: 25,
    type: QuestType.bonus,
    category: "Networking"
  },

  // Databases
  {
    title: "Indexing, MVCC, transactions: notes + runnable demo with SQLite or sled",
    xp: 45,
    type: QuestType.topic,
    category: "Databases"
  },
  {
    title: "Query planning & execution: EXPLAIN in Postgres",
    xp: 30,
    type: QuestType.topic,
    category: "Databases"
  },
  {
    title: "Write a log-structured mini-KV store with compaction",
    xp: 80,
    type: QuestType.project,
    category: "Databases"
  },
  {
    title: "Implement a basic SQL parser & executor for a subset of SQL",
    xp: 70,
    type: QuestType.project,
    category: "Databases"
  },
  {
    title: "Postgres tuning for high-traffic workloads",
    xp: 25,
    type: QuestType.bonus,
    category: "Databases"
  },

  // Distributed
  {
    title: "Raft paper: summary + invariants in plain English",
    xp: 25,
    type: QuestType.topic,
    category: "Distributed"
  },
  {
    title: "Gossip protocol basics: SWIM, memberlist",
    xp: 25,
    type: QuestType.topic,
    category: "Distributed"
  },
  {
    title: "CAP theorem & consistency models",
    xp: 30,
    type: QuestType.topic,
    category: "Distributed"
  },
  {
    title: "Implement Raft-based KV store (leader election, log, commit)",
    xp: 120,
    type: QuestType.project,
    category: "Distributed"
  },
  {
    title: "Cluster membership via Gossip simulation",
    xp: 70,
    type: QuestType.project,
    category: "Distributed"
  },
  {
    title: "Distributed secrets manager with Raft + Gossip + encryption",
    xp: 150,
    type: QuestType.project,
    category: "Distributed"
  },
  {
    title: "Chaos: partitions, leader crash, duplicate msgs; write postmortems",
    xp: 40,
    type: QuestType.bonus,
    category: "Distributed"
  },
  {
    title: "Implement vector clocks and causal ordering",
    xp: 35,
    type: QuestType.bonus,
    category: "Distributed"
  },

  // Software Engineering
  {
    title: "Implement 8 design patterns in Rust + TypeScript with examples",
    xp: 60,
    type: QuestType.topic,
    category: "Software Engineering"
  },
  {
    title: "Clean Code principles applied to a Rust service",
    xp: 40,
    type: QuestType.topic,
    category: "Software Engineering"
  },
  {
    title: "Refactoring patterns for large codebases",
    xp: 35,
    type: QuestType.topic,
    category: "Software Engineering"
  },
  {
    title: "Refactor an existing service; add tests; document tradeoffs (ADR)",
    xp: 80,
    type: QuestType.project,
    category: "Software Engineering"
  },
  {
    title: "Build a feature flag service with multi-language SDKs",
    xp: 90,
    type: QuestType.project,
    category: "Software Engineering"
  },
  {
    title: "Property-based tests + integration tests for a core module",
    xp: 40,
    type: QuestType.bonus,
    category: "Software Engineering"
  },

  // Performance & Debugging
  {
    title: "Debugging concurrency issues: race conditions, deadlocks",
    xp: 35,
    type: QuestType.topic,
    category: "Performance & Debugging"
  },
  {
    title: "Memory profiling & leak hunting in Rust",
    xp: 30,
    type: QuestType.topic,
    category: "Performance & Debugging"
  },
  {
    title: "Benchmark harness: latency, throughput, p95, p99; improve one metric",
    xp: 50,
    type: QuestType.project,
    category: "Performance & Debugging"
  },
  {
    title: "Implement distributed caching with invalidation strategy",
    xp: 70,
    type: QuestType.project,
    category: "Performance & Debugging"
  },
  {
    title: "Add tracing & distributed logs to a multi-service app",
    xp: 35,
    type: QuestType.bonus,
    category: "Performance & Debugging"
  },

  // Security
  {
    title: "OWASP Top 10 review; apply 3 mitigations to an app",
    xp: 40,
    type: QuestType.topic,
    category: "Security"
  },
  {
    title: "TLS basics & certificate management",
    xp: 30,
    type: QuestType.topic,
    category: "Security"
  },
  {
    title: "Keys: rotation, signed URLs, encrypted-at-rest + audit log",
    xp: 70,
    type: QuestType.project,
    category: "Security"
  },
  {
    title: "Implement RBAC (Role-Based Access Control) in a Rust API",
    xp: 50,
    type: QuestType.project,
    category: "Security"
  },
  {
    title: "Security audit of one of your old projects",
    xp: 25,
    type: QuestType.bonus,
    category: "Security"
  },

  // Architecture & Leadership
  {
    title: "System design tradeoffs: monolith vs microservices vs modular monolith",
    xp: 35,
    type: QuestType.topic,
    category: "Architecture & Leadership"
  },
  {
    title: "Event-driven architecture patterns",
    xp: 30,
    type: QuestType.topic,
    category: "Architecture & Leadership"
  },
  {
    title: "Mentor a junior through a feature: spec → PR → deploy",
    xp: 60,
    type: QuestType.project,
    category: "Architecture & Leadership"
  },
  {
    title: "Document a system in ADRs, sequence diagrams, and deployment diagrams",
    xp: 50,
    type: QuestType.project,
    category: "Architecture & Leadership"
  },
  {
    title: "Maintain ADRs for 2 live systems; capture 5 decisions each",
    xp: 35,
    type: QuestType.bonus,
    category: "Architecture & Leadership"
  },
  {
    title: "Give a tech talk or write a deep-dive post on a hard bug",
    xp: 45,
    type: QuestType.bonus,
    category: "Architecture & Leadership"
  },

  // Math (Optional)
  {
    title: "Discrete math: sets, logic, combinatorics, graphs",
    xp: 30,
    type: QuestType.topic,
    category: "Math (Optional)"
  },
  {
    title: "Probability & statistics basics",
    xp: 25,
    type: QuestType.topic,
    category: "Math (Optional)"
  },
  {
    title: "Linear algebra intuition (3Blue1Brown) → implement vector ops in Rust",
    xp: 40,
    type: QuestType.project,
    category: "Math (Optional)"
  },
  {
    title: "Implement PageRank algorithm and visualize results",
    xp: 50,
    type: QuestType.project,
    category: "Math (Optional)"
  },
  {
    title: "Use math to optimize a real business process (document it)",
    xp: 35,
    type: QuestType.bonus,
    category: "Math (Optional)"
  }
]

async function main() {
  console.log('🌱 Starting to seed database...')
  
  // Clear existing data
  await prisma.quest.deleteMany()
  await prisma.appState.deleteMany()
  
  console.log('🧹 Cleared existing data')
  
  // Create initial app state
  await prisma.appState.create({
    data: {
      id: 1,
      streak: 0,
      focus: []
    }
  })
  
  console.log('📱 Created initial app state')
  
  // Create all quests
  const createdQuests = await prisma.quest.createMany({
    data: quests
  })
  
  console.log(`✅ Created ${createdQuests.count} quests`)
  
  // Log summary by category
  const questsByCategory = await prisma.quest.groupBy({
    by: ['category'],
    _count: {
      id: true
    }
  })
  
  console.log('\n📊 Quests by category:')
  questsByCategory.forEach(cat => {
    console.log(`  ${cat.category}: ${cat._count.id} quests`)
  })
  
  console.log('\n🎯 Total XP available:', quests.reduce((sum, q) => sum + q.xp, 0))
  console.log('🚀 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
