// Skill taxonomy: canonical name -> { category, aliases, topics (learning plan), questions (interview prep) }
// Aliases are matched as whole words/phrases, case-insensitive.

export const SKILLS = {
  // Programming languages
  Python: { category: 'Languages', aliases: ['python', 'python3'], topics: ['Data structures in Python (list/dict/set complexity)', 'OOP, decorators and generators', 'Virtual environments and packaging'], questions: ['What is the difference between a list and a tuple, and when would you use each?', 'Explain how Python decorators work with an example.', 'How does the GIL affect multithreaded Python programs?'] },
  Java: { category: 'Languages', aliases: ['java'], topics: ['OOP principles and interfaces', 'Collections framework', 'Exception handling and JVM memory model'], questions: ['Explain the difference between an abstract class and an interface in Java.', 'How does HashMap work internally?', 'What happens during garbage collection in the JVM?'] },
  JavaScript: { category: 'Languages', aliases: ['javascript', 'js', 'es6', 'ecmascript'], topics: ['Closures, scope and hoisting', 'Promises and async/await', 'The event loop'], questions: ['Explain closures with a practical example.', 'What is the difference between == and ===?', 'How does the JavaScript event loop handle async callbacks?'] },
  TypeScript: { category: 'Languages', aliases: ['typescript'], topics: ['Type annotations and interfaces', 'Generics', 'Union, intersection and utility types'], questions: ['What is the difference between an interface and a type alias?', 'How do generics improve type safety?', 'Explain the "unknown" type vs "any".'] },
  'C++': { category: 'Languages', aliases: ['c\\+\\+', 'cpp'], topics: ['Pointers and references', 'STL containers and algorithms', 'RAII and smart pointers'], questions: ['What is the difference between a pointer and a reference?', 'Explain RAII and why it matters.', 'When would you use std::vector vs std::list?'] },
  C: { category: 'Languages', aliases: ['c programming', 'c language', 'ansi c'], topics: ['Pointers and memory management', 'Structs and arrays', 'Compilation and linking'], questions: ['Explain malloc vs calloc.', 'What is a dangling pointer?', 'How are arrays and pointers related in C?'] },
  SQL: { category: 'Data', aliases: ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'oracle sql', 't-sql', 'pl/sql'], topics: ['Joins and subqueries', 'Aggregations and window functions', 'Indexing and query optimization'], questions: ['Explain INNER, LEFT and FULL OUTER joins.', 'Write a query to find the second-highest salary.', 'What is an index and when can it hurt performance?'] },
  R: { category: 'Languages', aliases: ['r programming', 'rstudio', 'r language'], topics: ['Data frames and tidyverse', 'ggplot2 visualisation', 'Statistical modelling in R'], questions: ['How do you handle missing values in an R data frame?', 'Explain the pipe operator in tidyverse.', 'How would you fit a linear model in R?'] },
  Go: { category: 'Languages', aliases: ['golang'], topics: ['Goroutines and channels', 'Interfaces', 'Error handling idioms'], questions: ['How do goroutines differ from OS threads?', 'Explain buffered vs unbuffered channels.', 'How does Go handle errors without exceptions?'] },

  // Web
  React: { category: 'Web', aliases: ['react', 'reactjs', 'react\\.js'], topics: ['Components, props and state', 'Hooks (useState, useEffect, useMemo)', 'Rendering, keys and reconciliation'], questions: ['What problem do React keys solve in lists?', 'Explain the useEffect dependency array.', 'When would you lift state up vs use context?'] },
  'Node.js': { category: 'Web', aliases: ['node', 'nodejs', 'node\\.js'], topics: ['Event-driven architecture', 'Streams and buffers', 'Module system (CommonJS vs ESM)'], questions: ['Why is Node.js suited to I/O-heavy workloads?', 'Explain streams in Node.js.', 'How do you handle uncaught errors in a Node server?'] },
  Express: { category: 'Web', aliases: ['express', 'expressjs', 'express\\.js'], topics: ['Routing and middleware', 'Error-handling middleware', 'Request validation'], questions: ['What is middleware in Express?', 'How would you structure routes in a large Express app?', 'How do you handle errors centrally in Express?'] },
  HTML: { category: 'Web', aliases: ['html', 'html5'], topics: ['Semantic HTML', 'Forms and validation', 'Accessibility basics (ARIA, labels)'], questions: ['Why does semantic HTML matter?', 'What is the purpose of the alt attribute?', 'Explain the difference between block and inline elements.'] },
  CSS: { category: 'Web', aliases: ['css', 'css3', 'tailwind', 'tailwindcss', 'sass', 'scss', 'bootstrap'], topics: ['Flexbox and Grid', 'Responsive design and media queries', 'Specificity and the cascade'], questions: ['When would you use Grid instead of Flexbox?', 'Explain CSS specificity.', 'How do you build a responsive layout?'] },
  'REST APIs': { category: 'Web', aliases: ['restful', 'rest api', 'rest apis', 'api development', 'apis'], topics: ['HTTP methods and status codes', 'Resource design and versioning', 'Authentication (JWT, OAuth)'], questions: ['What makes an API RESTful?', 'Explain idempotency with HTTP methods.', 'How would you version a public API?'] },
  Django: { category: 'Web', aliases: ['django'], topics: ['Models and ORM', 'Views, URLs and templates', 'Django REST Framework'], questions: ['Explain the Django request/response cycle.', 'What is a migration?', 'How do you prevent N+1 queries in Django ORM?'] },
  Flask: { category: 'Web', aliases: ['flask'], topics: ['Routing and blueprints', 'Request context', 'Building JSON APIs'], questions: ['What are Flask blueprints for?', 'How does Flask handle request context?', 'Flask vs Django — when would you choose each?'] },
  'Spring Boot': { category: 'Web', aliases: ['spring', 'spring boot', 'springboot'], topics: ['Dependency injection', 'REST controllers', 'Spring Data JPA'], questions: ['What is dependency injection in Spring?', 'Explain @Component vs @Service vs @Repository.', 'How does Spring Boot auto-configuration work?'] },

  // Data / AI
  'Machine Learning': { category: 'AI / ML', aliases: ['machine learning', 'ml', 'supervised learning', 'unsupervised learning'], topics: ['Bias-variance trade-off', 'Model evaluation and cross-validation', 'Feature engineering'], questions: ['Explain overfitting and how to reduce it.', 'Precision vs recall — when does each matter?', 'How does cross-validation work?'] },
  'Deep Learning': { category: 'AI / ML', aliases: ['deep learning', 'neural networks', 'neural network', 'cnn', 'rnn', 'lstm'], topics: ['Backpropagation and optimisers', 'CNNs and RNNs', 'Regularisation (dropout, batch norm)'], questions: ['Explain backpropagation in simple terms.', 'What is the vanishing gradient problem?', 'Why use dropout?'] },
  NLP: { category: 'AI / ML', aliases: ['nlp', 'natural language processing', 'text mining', 'transformers', 'bert', 'llm', 'llms', 'large language models'], topics: ['Tokenisation and embeddings', 'Transformer architecture and attention', 'Fine-tuning and evaluation of language models'], questions: ['What is attention in a transformer?', 'Explain word embeddings.', 'How would you evaluate a text classifier?'] },
  'Computer Vision': { category: 'AI / ML', aliases: ['computer vision', 'opencv', 'image processing', 'object detection', 'yolo'], topics: ['Image preprocessing', 'Convolutional architectures', 'Object detection and segmentation'], questions: ['How does a convolution layer work?', 'What is transfer learning in vision?', 'Explain IoU in object detection.'] },
  TensorFlow: { category: 'AI / ML', aliases: ['tensorflow', 'keras'], topics: ['Keras Sequential and Functional APIs', 'Training loops and callbacks', 'Model saving and serving'], questions: ['Sequential vs Functional API in Keras?', 'What are callbacks used for?', 'How do you deploy a TensorFlow model?'] },
  PyTorch: { category: 'AI / ML', aliases: ['pytorch', 'torch'], topics: ['Tensors and autograd', 'nn.Module and training loops', 'DataLoader and datasets'], questions: ['How does autograd work in PyTorch?', 'What does model.eval() change?', 'How do you write a custom Dataset?'] },
  'scikit-learn': { category: 'AI / ML', aliases: ['scikit-learn', 'sklearn', 'scikit learn'], topics: ['Pipelines and transformers', 'Model selection with GridSearchCV', 'Common estimators'], questions: ['Why use a Pipeline in scikit-learn?', 'How does GridSearchCV avoid data leakage?', 'Explain fit vs transform vs fit_transform.'] },
  Pandas: { category: 'Data', aliases: ['pandas', 'numpy', 'dataframes'], topics: ['Indexing, filtering and groupby', 'Merging and reshaping', 'Handling missing data'], questions: ['Explain loc vs iloc.', 'How would you merge two DataFrames?', 'How do you handle missing values in Pandas?'] },
  'Data Visualization': { category: 'Data', aliases: ['data visualization', 'data visualisation', 'matplotlib', 'seaborn', 'plotly', 'power bi', 'powerbi', 'tableau', 'dashboards'], topics: ['Choosing the right chart', 'Dashboard design', 'Storytelling with data'], questions: ['How do you choose between a bar and a line chart?', 'Describe a dashboard you built and its users.', 'How do you avoid misleading charts?'] },
  Statistics: { category: 'Data', aliases: ['statistics', 'statistical analysis', 'hypothesis testing', 'probability', 'a/b testing'], topics: ['Descriptive and inferential statistics', 'Hypothesis testing and p-values', 'Regression analysis'], questions: ['Explain a p-value in plain language.', 'What is the central limit theorem?', 'How would you design an A/B test?'] },
  Excel: { category: 'Data', aliases: ['excel', 'ms excel', 'advanced excel', 'vlookup', 'pivot tables'], topics: ['Lookup functions (XLOOKUP, INDEX/MATCH)', 'Pivot tables', 'Data validation and charts'], questions: ['VLOOKUP vs INDEX/MATCH?', 'How would you summarise sales by region in Excel?', 'How do you clean messy data in Excel?'] },
  'Big Data': { category: 'Data', aliases: ['big data', 'spark', 'pyspark', 'hadoop', 'kafka', 'hive'], topics: ['Distributed processing concepts', 'Spark DataFrames and transformations', 'Batch vs streaming'], questions: ['What is lazy evaluation in Spark?', 'Explain narrow vs wide transformations.', 'When would you use Kafka?'] },

  // Cloud / DevOps
  Git: { category: 'Tools', aliases: ['git', 'github', 'gitlab', 'version control', 'bitbucket'], topics: ['Branching and merging', 'Rebase vs merge', 'Pull request workflow'], questions: ['Explain git rebase vs git merge.', 'How do you resolve a merge conflict?', 'What is a good branching strategy for a team?'] },
  Docker: { category: 'Cloud / DevOps', aliases: ['docker', 'containers', 'containerization', 'dockerfile'], topics: ['Images, containers and layers', 'Writing Dockerfiles', 'Docker Compose'], questions: ['Image vs container — what is the difference?', 'How do you reduce Docker image size?', 'What does Docker Compose solve?'] },
  Kubernetes: { category: 'Cloud / DevOps', aliases: ['kubernetes', 'k8s'], topics: ['Pods, deployments and services', 'Scaling and health checks', 'ConfigMaps and secrets'], questions: ['What is a Pod?', 'Deployment vs StatefulSet?', 'How does Kubernetes do rolling updates?'] },
  AWS: { category: 'Cloud / DevOps', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda'], topics: ['Core services (EC2, S3, IAM)', 'Serverless with Lambda', 'Networking basics (VPC)'], questions: ['Explain IAM roles vs users.', 'When would you choose Lambda over EC2?', 'How do you secure an S3 bucket?'] },
  Azure: { category: 'Cloud / DevOps', aliases: ['azure', 'microsoft azure'], topics: ['Azure compute and storage', 'Azure ML / data services', 'Resource groups and RBAC'], questions: ['What is a resource group?', 'Compare Azure App Service and Azure Functions.', 'How does RBAC work in Azure?'] },
  GCP: { category: 'Cloud / DevOps', aliases: ['gcp', 'google cloud', 'bigquery'], topics: ['Compute Engine and Cloud Run', 'BigQuery', 'IAM on GCP'], questions: ['What is BigQuery good at?', 'Cloud Run vs GKE?', 'How are GCP projects organised?'] },
  'CI/CD': { category: 'Cloud / DevOps', aliases: ['ci/cd', 'cicd', 'jenkins', 'github actions', 'continuous integration', 'continuous deployment'], topics: ['Pipeline stages', 'Automated testing in pipelines', 'Deployment strategies'], questions: ['What does a typical CI/CD pipeline contain?', 'Blue-green vs canary deployment?', 'How do you keep secrets out of pipelines?'] },
  Linux: { category: 'Tools', aliases: ['linux', 'unix', 'bash', 'shell scripting'], topics: ['File system and permissions', 'Processes and signals', 'Shell scripting'], questions: ['Explain chmod 755.', 'How do you find which process uses a port?', 'Write a one-liner to count lines in all .log files.'] },

  // CS fundamentals
  'Data Structures & Algorithms': { category: 'CS Fundamentals', aliases: ['data structures', 'algorithms', 'dsa', 'problem solving', 'competitive programming', 'leetcode'], topics: ['Arrays, hashing and two pointers', 'Trees and graphs (BFS/DFS)', 'Dynamic programming', 'Big-O analysis'], questions: ['Find two numbers in an array that sum to a target — optimise it.', 'Explain BFS vs DFS and when to use each.', 'What is the time complexity of building a heap?'] },
  OOP: { category: 'CS Fundamentals', aliases: ['oop', 'object oriented', 'object-oriented', 'object oriented programming'], topics: ['Encapsulation, inheritance, polymorphism', 'SOLID principles', 'Design patterns basics'], questions: ['Explain polymorphism with an example.', 'What is the Liskov substitution principle?', 'Composition vs inheritance?'] },
  DBMS: { category: 'CS Fundamentals', aliases: ['dbms', 'database management', 'normalization', 'database design'], topics: ['Normalisation (1NF–3NF)', 'Transactions and ACID', 'ER modelling'], questions: ['Explain ACID properties.', 'What is 3NF?', 'What is a deadlock in a database?'] },
  'Operating Systems': { category: 'CS Fundamentals', aliases: ['operating systems', 'operating system', 'os concepts'], topics: ['Processes vs threads', 'Scheduling', 'Memory management and paging'], questions: ['Process vs thread?', 'What is a deadlock and how can it be prevented?', 'Explain virtual memory.'] },
  'Computer Networks': { category: 'CS Fundamentals', aliases: ['computer networks', 'networking', 'tcp/ip', 'dns'], topics: ['OSI and TCP/IP models', 'TCP vs UDP', 'What happens when you type a URL'], questions: ['TCP vs UDP?', 'Explain what happens when you type a URL in the browser.', 'What is DNS?'] },
  'System Design': { category: 'CS Fundamentals', aliases: ['system design', 'distributed systems', 'microservices', 'scalability'], topics: ['Load balancing and caching', 'Database scaling (sharding, replication)', 'Designing common systems (URL shortener, chat)'], questions: ['Design a URL shortener.', 'How does caching improve scalability, and what are its risks?', 'Monolith vs microservices?'] },
  MongoDB: { category: 'Data', aliases: ['mongodb', 'mongo', 'nosql', 'mongoose'], topics: ['Document modelling', 'Indexes and aggregation pipeline', 'Embedding vs referencing'], questions: ['When would you choose MongoDB over SQL?', 'Explain the aggregation pipeline.', 'Embedding vs referencing documents?'] },
  Testing: { category: 'Tools', aliases: ['unit testing', 'unit tests', 'integration testing', 'software testing', 'jest', 'pytest', 'junit', 'selenium', 'test automation'], topics: ['Unit vs integration tests', 'Mocking', 'Test-driven development'], questions: ['Unit vs integration tests?', 'When should you mock?', 'What makes a good unit test?'] },

  // Soft / professional
  Communication: { category: 'Professional', aliases: ['communication', 'communication skills', 'presentation skills', 'written communication'], topics: ['Structuring explanations (STAR method)', 'Technical writing', 'Presenting to non-technical audiences'], questions: ['Describe a time you explained a technical idea to a non-technical person.', 'How do you write good documentation?'] },
  Teamwork: { category: 'Professional', aliases: ['teamwork', 'team player', 'collaboration', 'collaborative'], topics: ['Working in agile teams', 'Giving and receiving feedback', 'Conflict resolution'], questions: ['Tell me about a disagreement in a team and how you resolved it.', 'How do you handle a teammate who is not contributing?'] },
  Agile: { category: 'Professional', aliases: ['agile', 'scrum', 'kanban', 'jira', 'sprint'], topics: ['Scrum roles and ceremonies', 'User stories and estimation', 'Kanban flow'], questions: ['Explain the Scrum ceremonies.', 'How do you estimate a user story?'] },
};

export const CATEGORY_ORDER = ['Languages', 'Web', 'AI / ML', 'Data', 'Cloud / DevOps', 'CS Fundamentals', 'Tools', 'Professional'];

function escapeRe(s) { return s; } // aliases are written regex-safe already

// Pre-compile one regex per skill. Word boundaries handle "java" vs "javascript".
const COMPILED = Object.entries(SKILLS).map(([name, def]) => ({
  name,
  re: new RegExp(`(^|[^a-z0-9+#])(${def.aliases.map(escapeRe).join('|')})(?=$|[^a-z0-9+#])`, 'i'),
}));

/**
 * Find every skill mentioned in `text`, with the sentence(s) that mention it as evidence.
 * Returns Map<skillName, string[]> (up to 3 evidence snippets each).
 */
export function findSkills(text) {
  const found = new Map();
  if (!text) return found;
  // split into short evidence units: lines first, then sentences
  const units = text
    .split(/\n|(?<=[.;!?])\s+|•|▪|●/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => s.length > 1);
  for (const unit of units) {
    // Contact lines (email, phone, profile URLs) are not evidence of a skill.
    if (/@|https?:\/\/|linkedin\.com|github\.com\/\w/i.test(unit)) continue;
    for (const { name, re } of COMPILED) {
      if (re.test(unit)) {
        const list = found.get(name) || [];
        if (list.length < 3 && !list.includes(unit)) list.push(unit.length > 220 ? unit.slice(0, 217) + '…' : unit);
        found.set(name, list);
      }
    }
  }
  return found;
}
