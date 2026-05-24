import { askLLM } from "./groq.service.js";

/* ====================================================
   TOPIC MAPS BY LANGUAGE + DIFFICULTY
==================================================== */

const TOPIC_MAP = {

  /* ─────────────── PYTHON ─────────────── */
  python: {
    easy: [
      "Python datatypes (int, float, string, bool, list, tuple, dict, set)",
      "Conditionals (if, elif, else)",
      "Loops (for loop, while loop, range)",
      "List comprehension basics",
      "Functions (def, return, parameters)",
      "Lambda, map, filter",
      "Basic file handling (open, read, write, close)",
      "Exception handling (try, except, finally)",
      "Basic classes and objects",
    ],
    intermediate: [
      "All easy topics PLUS:",
      "NumPy — 1D and 2D arrays, array operations, basic functions (mean, sum, reshape)",
      "Pandas — DataFrame and Series creation",
      "Pandas — loc, iloc, filters, date functions",
      "Pandas — groupby, drop, value_counts, sort_values",
      "Pandas — import/export CSV and Excel, handling null values",
      "Matplotlib — bar chart, line chart, pie chart, scatter plot",
      "Matplotlib — labels, legends, axis, titles, subplots",
      "OOP — inheritance, encapsulation, polymorphism",
      "Decorators and generators basics",
    ],
    hard: [
      "All intermediate topics PLUS:",
      "Advanced NumPy — broadcasting, fancy indexing, vectorized operations",
      "Advanced Pandas — merge, join, pivot tables, multi-index",
      "Advanced Matplotlib — custom styles, multiple axes, figure sizing",
      "Seaborn basics — heatmap, pairplot",
      "List vs tuple vs set vs dict — deep comparison",
      "Memory management, garbage collection",
      "Multithreading vs multiprocessing",
      "Context managers (__enter__, __exit__)",
      "Abstract classes and interfaces",
    ],
  },

  /* ─────────────── JAVA ─────────────── */
  java: {
    easy: [
      "Java datatypes and variables",
      "Conditionals (if, else if, switch)",
      "Loops (for, while, do-while)",
      "Arrays — declaration, initialization, traversal",
      "String methods (length, charAt, substring, equals, contains)",
      "Functions / Methods — definition and calling",
      "Basic OOP — class, object, constructor",
      "Scanner for user input",
      "Basic exception handling (try-catch)",
    ],
    intermediate: [
      "All easy topics PLUS:",
      "OOP — inheritance, super keyword, method overriding",
      "OOP — encapsulation, getters/setters",
      "OOP — polymorphism (compile-time and runtime)",
      "OOP — abstract classes and interfaces",
      "Collections — ArrayList, LinkedList, HashMap, HashSet",
      "Iterator and for-each loop",
      "Static keyword — fields, methods, blocks",
      "String vs StringBuilder vs StringBuffer",
      "Wrapper classes and autoboxing",
    ],
    hard: [
      "All intermediate topics PLUS:",
      "Java 8 features — Streams, lambda, Optional",
      "Generics — bounded and unbounded wildcards",
      "Multithreading — Thread class, Runnable, synchronized",
      "Java memory model — heap, stack, method area",
      "Design patterns — Singleton, Factory, Builder",
      "Exception hierarchy — checked vs unchecked",
      "JDBC basics — connection, statement, ResultSet",
      "Comparable vs Comparator",
      "Serialization and deserialization",
    ],
  },

  /* ─────────────── C ─────────────── */
  c: {
    easy: [
      "C datatypes (int, float, char, double)",
      "Operators (arithmetic, relational, logical, bitwise)",
      "Conditionals (if, else, switch)",
      "Loops (for, while, do-while, break, continue)",
      "Arrays — 1D array declaration, traversal",
      "Functions — definition, calling, return types",
      "Basic string functions (strlen, strcpy, strcmp, strcat)",
      "Basic input/output (printf, scanf)",
      "Pointers — basic declaration and dereferencing",
    ],
    intermediate: [
      "All easy topics PLUS:",
      "Pointers — pointer arithmetic, pointer to array",
      "Pointers — pointer to function",
      "Structures and unions",
      "Dynamic memory allocation (malloc, calloc, realloc, free)",
      "2D arrays and matrix operations",
      "Recursion — factorial, Fibonacci, tower of Hanoi",
      "File handling (fopen, fclose, fread, fwrite, fprintf, fscanf)",
      "Preprocessor directives (#define, #include, macros)",
      "Pass by value vs pass by reference",
    ],
    hard: [
      "All intermediate topics PLUS:",
      "Linked list — singly, doubly, circular",
      "Stack and queue using arrays and linked lists",
      "Binary search tree — insert, delete, traversal",
      "Sorting algorithms — bubble, selection, insertion, merge, quick",
      "Bit manipulation techniques",
      "Function pointers and callbacks",
      "Memory layout — code, data, stack, heap segments",
      "Volatile and const qualifiers",
      "Multi-file programming and header files",
    ],
  },

  /* ─────────────── C++ ─────────────── */
  cpp: {
    easy: [
      "C++ vs C differences",
      "cin, cout for input/output",
      "References vs pointers",
      "Default arguments in functions",
      "Function overloading",
      "Basic OOP — class, object, constructor, destructor",
      "Access specifiers — public, private, protected",
      "Basic string class usage",
      "Namespaces",
    ],
    intermediate: [
      "All easy topics PLUS:",
      "OOP — inheritance types (single, multiple, multilevel)",
      "OOP — virtual functions and runtime polymorphism",
      "OOP — abstract classes and pure virtual functions",
      "Operator overloading",
      "Templates — function templates, class templates",
      "STL — vector, list, map, set, stack, queue",
      "STL — iterators and algorithms (sort, find, count)",
      "Copy constructor and assignment operator",
      "this pointer and static members",
    ],
    hard: [
      "All intermediate topics PLUS:",
      "Smart pointers — unique_ptr, shared_ptr, weak_ptr",
      "Move semantics and rvalue references",
      "Lambda expressions",
      "Exception handling — throw, catch, noexcept",
      "Memory management — new, delete, memory leaks",
      "Friend functions and friend classes",
      "Multithreading — std::thread, mutex, lock_guard",
      "Design patterns in C++ — Singleton, Factory",
      "RAII — Resource Acquisition Is Initialization",
    ],
  },

  /* ─────────────── SEO ─────────────── */
  seo: {
    easy: [
      "What is SEO and why it matters",
      "On-page SEO — title tags, meta descriptions, headings",
      "Keywords — short tail vs long tail",
      "URL structure best practices",
      "Internal linking basics",
      "Image optimization — alt text, file size",
      "What is a sitemap and robots.txt",
      "Google Search Console basics",
      "Organic vs paid search",
    ],
    intermediate: [
      "All easy topics PLUS:",
      "Technical SEO — page speed, mobile-friendliness, Core Web Vitals",
      "Backlinks — what they are and why they matter",
      "Off-page SEO — link building strategies",
      "Schema markup and structured data",
      "Canonical tags and duplicate content",
      "SEO-friendly content writing",
      "Keyword research tools (Ahrefs, SEMrush, Google Keyword Planner)",
      "Google Analytics basics — sessions, bounce rate, CTR",
      "Local SEO — Google My Business",
    ],
    hard: [
      "All intermediate topics PLUS:",
      "Technical SEO audits — crawl errors, redirect chains",
      "E-E-A-T — Experience, Expertise, Authoritativeness, Trustworthiness",
      "Algorithm updates — Panda, Penguin, Helpful Content",
      "Log file analysis",
      "International SEO — hreflang tags",
      "JavaScript SEO — dynamic rendering, server-side rendering",
      "Advanced link building — digital PR, broken link building",
      "Content clusters and pillar pages",
      "Featured snippets and zero-click searches",
    ],
  },

  /* ─────────────── DIGITAL MARKETING ─────────────── */
  digital_marketing: {
    easy: [
      "What is digital marketing",
      "Channels — SEO, SEM, social media, email, content",
      "What is Google Ads — search vs display",
      "Social media marketing basics — Facebook, Instagram, LinkedIn",
      "What is email marketing",
      "What is content marketing",
      "What is a landing page and conversion",
      "CTR, CPC, CPM — basic metrics",
      "What is a marketing funnel (TOFU, MOFU, BOFU)",
    ],
    intermediate: [
      "All easy topics PLUS:",
      "Google Ads — campaign types, bidding strategies, Quality Score",
      "Facebook Ads — targeting, ad sets, A/B testing",
      "SEO vs SEM — when to use which",
      "Email marketing — segmentation, open rate, click rate",
      "Content strategy — blog, video, infographic",
      "Analytics — Google Analytics 4 basics",
      "Retargeting and remarketing",
      "Influencer marketing basics",
      "Social media algorithms — reach vs engagement",
    ],
    hard: [
      "All intermediate topics PLUS:",
      "Attribution models — first touch, last touch, multi-touch",
      "Marketing automation — HubSpot, Mailchimp workflows",
      "Programmatic advertising — DSP, SSP, RTB",
      "CRO — Conversion Rate Optimization techniques",
      "Advanced Google Ads — smart bidding, Performance Max",
      "Customer lifetime value (CLV) and CAC",
      "Omnichannel marketing strategy",
      "Data-driven marketing — cohort analysis, funnel analysis",
      "GDPR and data privacy in digital marketing",
    ],
  },
};

/* ====================================================
   PRACTICAL CODING TOPICS BY LANGUAGE + DIFFICULTY
==================================================== */

const PRACTICAL_MAP = {

  python: {
    easy: [
      "Print pattern using loops",
      "Reverse a string",
      "Check palindrome",
      "Find factorial using recursion",
      "Fibonacci series",
      "Find largest element in a list",
      "Count vowels in a string",
      "Simple calculator using functions",
      "Check prime number",
    ],
    intermediate: [
      "Merge two sorted lists",
      "Find duplicates in a list",
      "Matrix multiplication using NumPy",
      "Read CSV and filter rows using Pandas",
      "Plot a bar chart from data using Matplotlib",
      "Implement stack using list",
      "Binary search implementation",
      "Group data by category using Pandas groupby",
      "Remove null values from DataFrame",
    ],
    hard: [
      "Implement a linked list class",
      "LRU Cache implementation",
      "Merge sort and quick sort",
      "Graph BFS and DFS traversal",
      "Producer-consumer using threading",
      "Custom decorator implementation",
      "Implement a binary search tree",
      "Build a simple web scraper using requests + BeautifulSoup",
      "Design a student management system using OOP",
    ],
  },

  java: {
    easy: [
      "Reverse a string without using built-in reverse",
      "Check if a number is prime",
      "Fibonacci series using recursion",
      "Find factorial",
      "Count characters in a string",
      "Find max and min in an array",
      "Check palindrome string",
      "Simple calculator using switch",
      "Print patterns using loops",
    ],
    intermediate: [
      "Implement a stack using ArrayList",
      "Implement a queue using LinkedList",
      "Binary search implementation",
      "Sort using Comparable interface",
      "HashMap — word frequency counter",
      "Singly linked list — insert and delete",
      "Generic method to find max in array",
      "File read and write using BufferedReader",
      "Simple bank account using OOP",
    ],
    hard: [
      "Implement LRU Cache using LinkedHashMap",
      "Producer-consumer using wait/notify",
      "Binary search tree — insert, search, inorder",
      "Design pattern — Singleton class",
      "Stream API — filter, map, collect on list of objects",
      "Graph BFS and DFS",
      "Merge sort implementation",
      "Custom exception hierarchy",
      "Design a library management system using OOP",
    ],
  },

  c: {
    easy: [
      "Reverse an array",
      "Find factorial using recursion",
      "Check palindrome string",
      "Fibonacci series",
      "Find largest element in array",
      "Swap two numbers using pointers",
      "Count digits in a number",
      "Simple calculator using functions",
      "Check prime number",
    ],
    intermediate: [
      "Implement stack using array",
      "Implement queue using array",
      "Binary search",
      "Bubble sort and selection sort",
      "Singly linked list — insert and display",
      "Matrix multiplication",
      "Dynamic array using malloc",
      "String reversal without built-in functions",
      "Read and write student records to file",
    ],
    hard: [
      "Doubly linked list implementation",
      "Binary search tree",
      "Quick sort and merge sort",
      "Implement a hash table",
      "Graph adjacency list representation",
      "BFS and DFS in graph",
      "Tower of Hanoi",
      "Implement your own strlen, strcpy, strcat",
      "Generic stack using void pointers",
    ],
  },

  cpp: {
    easy: [
      "Reverse a string using STL",
      "Check palindrome",
      "Find factorial",
      "Fibonacci using recursion",
      "Overload + operator for a class",
      "Find max using function template",
      "Simple class with constructor and destructor",
      "Vector push_back and traversal",
      "Simple calculator using OOP",
    ],
    intermediate: [
      "Stack implementation using class",
      "Linked list using class and templates",
      "Map for word frequency",
      "Sort vector of objects using Comparator",
      "Implement copy constructor",
      "Abstract shape class with area method",
      "Template stack with push/pop",
      "Binary search on vector",
      "Student management using vector of objects",
    ],
    hard: [
      "Smart pointer — implement basic unique_ptr",
      "Thread-safe singleton using mutex",
      "Custom string class with operator overloading",
      "Binary search tree using templates",
      "Graph BFS/DFS using adjacency list",
      "Implement move constructor and move assignment",
      "Design pattern — Observer pattern",
      "Exception-safe resource management using RAII",
      "Generic sorting algorithm using templates",
    ],
  },
};

/* ====================================================
   HUMAN FILLERS
==================================================== */

const FILLERS = [
  "Hmm...",
  "Alright...",
  "Okay, got it.",
  "Right, right.",
  "I see.",
  "Interesting.",
  "Sure, sure.",
  "Okay okay.",
  "Mmm, okay.",
  "Let me note that.",
  "Fair enough.",
  "Noted.",
  "Good.",
];

/* ====================================================
   GENERATE AI QUESTION
==================================================== */

export const generateQuestion = async ({
  interviewType,
  difficulty = "easy",
  lastQnA,
  userName,
  topics,
  language = "general",
}) => {

  const interviewerName = "Rahul";
  const instituteName = "edtech";

  /* ====================================================
     RESOLVE TOPICS FOR THIS LANGUAGE + DIFFICULTY
  ==================================================== */

  let resolvedTopics = topics;

  if (!resolvedTopics || resolvedTopics.length === 0) {

    const langKey = language.toLowerCase().replace(/\+\+/, "pp").replace(/\s/g, "_");

    if (interviewType === "practical" && PRACTICAL_MAP[langKey]) {

      resolvedTopics = PRACTICAL_MAP[langKey][difficulty] || PRACTICAL_MAP[langKey].easy;

    } else if (TOPIC_MAP[langKey]) {

      resolvedTopics = TOPIC_MAP[langKey][difficulty] || TOPIC_MAP[langKey].easy;

    }

  }

  /* ====================================================
     BASE PROMPT
  ==================================================== */

  let prompt = `
You are ${interviewerName}, a friendly and experienced interviewer at ${instituteName}.

You are interviewing a FRESHER candidate.
Act like a REAL HUMAN interviewer having a natural, relaxed conversation.
Your style: warm, encouraging, professional, conversational — like a real person.

========================
CORE RULES
========================

- Ask ONLY ONE question per response
- Do NOT explain answers
- Do NOT give hints
- Do NOT sound robotic or like a chatbot
- ALWAYS end with a question
- Use natural human fillers sometimes: ${FILLERS.slice(0, 6).join(", ")}

========================
RESPONSE FORMAT (STRICT)
========================

Return ONLY valid JSON — no markdown, no backticks, no preamble:

{
  "question": "your filler + reaction + transition + question"
}

========================
CRITICAL RULE
========================

- Response MUST end with "?"
- NEVER return only a reaction without a question
- JSON must be valid and parseable

`;

  /* ====================================================
     INTERVIEW TYPE PROMPT
  ==================================================== */

  if (interviewType === "technical") {

    prompt += `
========================
TECHNICAL INTERVIEW — THEORY
========================

Ask ONLY conceptual / theory questions.
NO coding. Candidate will SPEAK the answer.
Fresher-friendly difficulty: ${difficulty}

${resolvedTopics ? `Ask from these topics:\n${resolvedTopics.join("\n")}` : ""}

Keep questions short and conversational.
One concept per question.

`;

  }

  if (interviewType === "hr") {

    prompt += `
========================
HR INTERVIEW
========================

Ask ONLY HR / behavioral / communication questions.
Candidate will SPEAK the answer.
Difficulty: ${difficulty}

Examples:
- Tell me about yourself
- Strengths and weaknesses
- Why should we hire you?
- Where do you see yourself in 5 years?
- Describe a challenging situation you handled
- How do you handle pressure?
- What motivates you?
- Teamwork and leadership experiences

Keep it warm, conversational, and natural.

`;

  }

  if (interviewType === "practical") {

    prompt += `
========================
PRACTICAL INTERVIEW — CODING
========================

Ask ONLY coding / programming problems.
Candidate will WRITE CODE as their answer.
Difficulty: ${difficulty}
Language: ${language}

${resolvedTopics ? `Pick from these tasks:\n${resolvedTopics.join("\n")}` : ""}

Keep the problem statement short and very clear.
Fresher-friendly problem.
Do NOT ask theory — ask them to write code.

`;

  }

  /* ====================================================
     DIFFICULTY GUIDANCE
  ==================================================== */

  prompt += `
========================
DIFFICULTY GUIDANCE
========================

${difficulty === "easy"
  ? "Easy: basic concepts, simple questions, beginner-friendly. Don't overwhelm."
  : difficulty === "intermediate"
  ? "Intermediate: mix of basic and applied concepts. Slightly more depth expected."
  : "Hard: advanced concepts, edge cases, deeper understanding expected."}

`;

  /* ====================================================
     FOLLOW-UP BEHAVIOR
  ==================================================== */

  if (lastQnA) {

    const answer = lastQnA.answer || lastQnA.code || "";

    prompt += `
========================
CONTINUE THE INTERVIEW
========================

Previous Question:
"${lastQnA.question}"

Candidate's Answer:
"${answer}"

--------------------------------
STEP 1 — REACT NATURALLY
--------------------------------

Use a short human reaction based on the answer quality:

If SKIPPED ("__SKIPPED__" or blank):
→ "Alright, no worries, let's move on."
→ "That's okay, we can come back to it."

If IRRELEVANT or off-topic:
→ "Hmm, that doesn't quite answer what I asked."
→ "Let's refocus a bit."

If WEAK or incomplete:
→ "You're on the right track, but not fully there."
→ "Okay, I see your point, but there's a bit more to it."
→ "Fair enough, we can explore that more later."

If GOOD:
→ "Nice, that's a solid answer."
→ "Good explanation, I like that."
→ "Alright, well said."
→ "That's correct, good job."

If EXCELLENT:
→ "Wow, that's really well put."
→ "Excellent, you clearly understand this well."
→ "Perfect answer!"

--------------------------------
STEP 2 — NATURAL TRANSITION
--------------------------------

Use a natural transition before next question:

- "Alright, let me ask you something else..."
- "Okay, moving forward..."
- "Now here's my next question..."
- "Let's try a different topic..."
- "Okay, building on that..."
- "Right, so now I want to ask you..."

--------------------------------
STEP 3 — ASK NEXT QUESTION
--------------------------------

Ask ONE question from the topic list.
Keep it short and natural.

FORMAT: filler → reaction → transition → question

`;

  } else {

    /* ====================================================
       FIRST QUESTION
    ==================================================== */

    prompt += `
========================
FIRST QUESTION — OPENING
========================

Start EXACTLY like this (word for word):

"Welcome! This interview is being conducted by ${instituteName}. I'm ${interviewerName}, and I'll be taking your interview today. Let's get started!"

Then ask a simple, easy opening question from the topic list.
Keep it warm and friendly to make the candidate comfortable.

`;

  }

  /* ====================================================
     FINAL STYLE REMINDER
  ==================================================== */

  prompt += `
========================
STYLE REMINDER
========================

- Warm, human, conversational tone
- Short sentences — like real speech
- Occasionally use: "Hmm...", "Alright...", "Okay...", "Right...", "I see..."
- Sound like a real person, not a bot
- Keep the candidate at ease

========================
OUTPUT RULE
========================

Return ONLY valid JSON. No extra text. No backticks. No markdown.

{ "question": "..." }

`;

  /* ====================================================
     CALL GROQ AI
  ==================================================== */

  const rawResponse = await askLLM(prompt);

  try {

    const cleaned = rawResponse
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    let questionText = parsed.question || "";

    if (!questionText.includes("?")) {
      questionText += " Can you explain this?";
    }

    return {
      question: questionText,
      interviewType,
    };

  } catch (err) {

    console.error("❌ AI Parse Error:", rawResponse);

    return {
      question: "Alright, let's continue — can you explain the concept of OOP in your own words?",
      interviewType,
    };

  }
};