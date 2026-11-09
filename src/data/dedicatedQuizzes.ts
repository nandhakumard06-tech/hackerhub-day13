export interface DedicatedQuizQuestion {
  id: string;
  number: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface DedicatedQuiz {
  id: string;
  code: string;
  title: string;
  questions: DedicatedQuizQuestion[];
}

export const DEDICATED_QUIZZES: DedicatedQuiz[] = [
  {
    id: 'A01',
    code: 'A01',
    title: 'Broken Access Control',
    questions: [
      {
        id: 'quiz-01',
        number: 1,
        question: 'What is Broken Access Control?',
        options: [
          'A website loads slowly',
          'A user accesses data they are not allowed to see',
          'A computer runs out of battery',
        ],
        correctAnswer: 1,
        explanation:
          'Broken Access Control lets users access data or perform actions beyond the permissions they should have.',
      },
      {
        id: 'quiz-02',
        number: 2,
        question: 'A student changes a URL and views another student’s private marks. Which vulnerability is this?',
        options: [
          'Broken Access Control',
          'Cryptographic Failures',
          'Security Misconfiguration',
        ],
        correctAnswer: 0,
        explanation:
          'The website failed to check whether the student was authorized to view the other student’s marks.',
      },
    ],
  },
  {
    id: 'A02',
    code: 'A02',
    title: 'Security Misconfiguration',
    questions: [
      {
        id: 'quiz-03',
        number: 3,
        question: 'What does Security Misconfiguration mean?',
        options: [
          'The website uses a strong password',
          'The website has an insecure setting',
          'The website has a colourful design',
        ],
        correctAnswer: 1,
        explanation:
          'Security misconfiguration means a system or application has an insecure setting or is not securely configured.',
      },
      {
        id: 'quiz-04',
        number: 4,
        question: 'A website displays detailed error messages that reveal internal system information. What risk could this create?',
        options: [
          'Security Misconfiguration',
          'Identification and Authentication Failures',
          'Software Supply Chain Failures',
        ],
        correctAnswer: 0,
        explanation:
          'Exposing detailed internal errors can result from insecure configuration and disclose information that should not be public.',
      },
    ],
  },
  {
    id: 'A03',
    code: 'A03',
    title: 'Software Supply Chain Failures',
    questions: [
      {
        id: 'quiz-05',
        number: 5,
        question: 'What is a software dependency?',
        options: [
          'A library or package used by an application',
          'A computer monitor',
          'A keyboard shortcut',
        ],
        correctAnswer: 0,
        explanation:
          'A dependency is an external library, package, or component that an application uses.',
      },
      {
        id: 'quiz-06',
        number: 6,
        question: 'A developer uses a vulnerable third-party library in a website. Which risk is involved?',
        options: [
          'Injection',
          'Software Supply Chain Failures',
          'Broken Access Control',
        ],
        correctAnswer: 1,
        explanation:
          'Using a vulnerable third-party component creates risk through the software supply chain.',
      },
    ],
  },
  {
    id: 'A04',
    code: 'A04',
    title: 'Cryptographic Failures',
    questions: [
      {
        id: 'quiz-07',
        number: 7,
        question: 'Why is encryption important?',
        options: [
          'To make websites load faster',
          'To help protect sensitive information',
          'To increase screen brightness',
        ],
        correctAnswer: 1,
        explanation:
          'Encryption helps protect sensitive information from being read by people who should not have access to it.',
      },
      {
        id: 'quiz-08',
        number: 8,
        question: 'A website sends users’ passwords over an unencrypted connection. What is the main risk?',
        options: [
          'Cryptographic Failures',
          'Security Misconfiguration only',
          'Identification and Authentication Failures',
        ],
        correctAnswer: 0,
        explanation:
          'Without encryption, passwords sent over the connection may be exposed, which is a cryptographic failure.',
      },
    ],
  },
  {
    id: 'A05',
    code: 'A05',
    title: 'Injection',
    questions: [
      {
        id: 'quiz-09',
        number: 9,
        question: 'What happens in an injection attack?',
        options: [
          'An attacker sends harmful input that is treated as a command or query',
          'A user changes their profile picture',
          'A website changes its theme',
        ],
        correctAnswer: 0,
        explanation:
          'Injection occurs when untrusted input is interpreted as part of a command or query.',
      },
      {
        id: 'quiz-10',
        number: 10,
        question: 'Which of these is an example of an injection vulnerability?',
        options: [
          'SQL Injection',
          'A slow internet connection',
          'A forgotten username',
        ],
        correctAnswer: 0,
        explanation:
          'SQL Injection is a well-known injection vulnerability involving input being interpreted as SQL.',
      },
    ],
  },
  {
    id: 'A06',
    code: 'A06',
    title: 'Insecure Design',
    questions: [
      {
        id: 'quiz-11',
        number: 11,
        question: 'What does Insecure Design mean?',
        options: [
          'A website has unattractive colours',
          'Security was not properly considered when designing the application',
          'A website uses a small font',
        ],
        correctAnswer: 1,
        explanation:
          'Insecure design means needed security requirements or safeguards were not adequately considered in the application’s design.',
      },
      {
        id: 'quiz-12',
        number: 12,
        question: 'A banking app allows unlimited money-transfer attempts without any suitable limits or safeguards. What could this indicate?',
        options: [
          'Insecure Design',
          'Cryptographic Failures',
          'Software Supply Chain Failures',
        ],
        correctAnswer: 0,
        explanation:
          'The application may lack safeguards that should have been designed into the money-transfer workflow.',
      },
    ],
  },
  {
    id: 'A07',
    code: 'A07',
    title: 'Identification and Authentication Failures',
    questions: [
      {
        id: 'quiz-13',
        number: 13,
        question: 'What is authentication?',
        options: [
          'Checking who a user is',
          'Changing a website’s colour',
          'Downloading a file',
        ],
        correctAnswer: 0,
        explanation:
          'Authentication verifies a user’s identity, such as when they sign in.',
      },
      {
        id: 'quiz-14',
        number: 14,
        question: 'A website allows unlimited password guesses without effective protection. Which vulnerability category is most relevant?',
        options: [
          'Injection',
          'Identification and Authentication Failures',
          'Security Misconfiguration only',
        ],
        correctAnswer: 1,
        explanation:
          'Unrestricted password guessing weakens authentication protections and can enable account compromise.',
      },
    ],
  },
  {
    id: 'A08',
    code: 'A08',
    title: 'Software or Data Integrity Failures',
    questions: [
      {
        id: 'quiz-15',
        number: 15,
        question: 'What does data integrity mean?',
        options: [
          'Data remains accurate and has not been improperly changed',
          'Data is always public',
          'Data is deleted every day',
        ],
        correctAnswer: 0,
        explanation:
          'Data integrity means data remains accurate and is not improperly altered.',
      },
      {
        id: 'quiz-16',
        number: 16,
        question: 'An application installs a software update without verifying whether it comes from a trusted source. What risk could this create?',
        options: [
          'Broken Access Control',
          'Software or Data Integrity Failures',
          'Identification and Authentication Failures',
        ],
        correctAnswer: 1,
        explanation:
          'Failing to verify an update’s source and integrity can allow untrusted or tampered software to be installed.',
      },
    ],
  },
  {
    id: 'A09',
    code: 'A09',
    title: 'Security Logging and Alerting Failures',
    questions: [
      {
        id: 'quiz-17',
        number: 17,
        question: 'Why are security logs important?',
        options: [
          'They help record and investigate suspicious activities',
          'They improve a monitor’s resolution',
          'They automatically prevent every attack',
        ],
        correctAnswer: 0,
        explanation:
          'Security logs provide records that help teams detect, investigate, and respond to suspicious activity.',
      },
      {
        id: 'quiz-18',
        number: 18,
        question: 'A website records failed logins but never alerts anyone about repeated suspicious attempts. What weakness could this indicate?',
        options: [
          'Injection',
          'Security Logging and Alerting Failures',
          'Cryptographic Failures',
        ],
        correctAnswer: 1,
        explanation:
          'Recording events without alerting on suspicious patterns can prevent teams from responding promptly.',
      },
    ],
  },
  {
    id: 'A10',
    code: 'A10',
    title: 'Mishandling of Exceptional Conditions',
    questions: [
      {
        id: 'quiz-19',
        number: 19,
        question: 'What is an exceptional condition in software?',
        options: [
          'An unexpected error or unusual situation',
          'A normal page refresh',
          'A user opening a website',
        ],
        correctAnswer: 0,
        explanation:
          'An exceptional condition is an unexpected error or unusual situation that software must handle safely.',
      },
      {
        id: 'quiz-20',
        number: 20,
        question: 'A website crashes when it receives unexpected input and exposes sensitive internal details. Which risk is most relevant?',
        options: [
          'Mishandling of Exceptional Conditions',
          'Broken Access Control',
          'Software Supply Chain Failures',
        ],
        correctAnswer: 0,
        explanation:
          'The application is not safely handling an unusual condition and is exposing internal information in the process.',
      },
    ],
  },
];
