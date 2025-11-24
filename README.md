🛡️ Aegis – Advanced Cybersecurity Dashboard

A powerful, all-in-one cybersecurity platform designed to help users detect breaches, analyze URLs, scan IPs, and ensure password safety.
Built with a modern React + Vite frontend and a secure Node.js/Express backend, Aegis delivers real-time threat intelligence and vulnerability assessment in a sleek interface.

🚀 Features
🔐 Security Tools

📧 Email Breach Checker – Check if your email has appeared in known data breaches.

🔗 Malicious URL Scanner – Detect phishing, malware, and malicious URLs before visiting them.

🌐 IP Address Scanner – Get geolocation, ISP info, and risk data for any IP.

🛡️ OWASP Vulnerability Scanner – Scan websites for OWASP Top 10 security risks.

🔑 Password Security Suite

Strength Analyzer – Test password complexity and resilience.

Secure Generator – Create strong, cryptographically safe passwords.

👤 User Authentication

JWT-based Login/Signup

Encrypted password handling using bcrypt

📄 Report Generation

Export detailed PDF reports for all scans.

🌍 Multi-Language Support

Fully localized UI with i18n integration.

🛠️ Tech Stack
Frontend

⚛️ React (Vite)

🎨 Tailwind CSS

🎞️ Framer Motion (animations)

🕹️ Three.js / Vanta.js (3D backgrounds)

🔗 Axios

Backend

🟩 Node.js + Express

🍃 MongoDB + Mongoose

🔐 JWT Authentication

🔒 Bcrypt.js (password hashing)

APIs & Tools

🤖 Google GenAI (threat intelligence)

🌐 whois-json

✉️ Nodemailer

📝 jsPDF (PDF generation)

🏁 Getting Started

Follow these steps to set up Aegis locally.

Prerequisites

Node.js 16+

npm or yarn

MongoDB (local or Atlas)

1. Clone the Repository
git clone https://github.com/Devansh1623/Breach-detector.git
cd Breach-detector

2. Install Dependencies
npm install

3. Configure Environment Variables

Create a .env file in the root directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Add other API keys (Google GenAI, VirusTotal, etc.)

4. Start the Development Server

To run both frontend & backend (if configured):

npm run dev


Backend only:

npm run server

🖥️ Usage

Open your browser → http://localhost:5173

Sign up or log in

Access tools via the navbar:

URL Checker

Email Checker

Password Tools

IP Scanner

View scan history & export PDF reports

🤝 Contributing

We welcome all contributions!

Fork the repository

Create your feature branch

git checkout -b feature/AmazingFeature


Commit changes

git commit -m "Add AmazingFeature"


Push to your branch

git push origin feature/AmazingFeature


Open a Pull Request


📞 Contact

Devansh
🔗 GitHub: https://github.com/Devansh1623

LinkedIn: https://www.linkedin.com/in/devansh-geria-9722b72b0/

📁 Project Link: https://github.com/Devansh1623/Breach-detector
