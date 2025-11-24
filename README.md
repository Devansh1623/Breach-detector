🛡️ Aegis - Advanced Cyber Security Dashboard
Aegis Banner

Aegis is a robust, all-in-one cybersecurity platform designed to empower users with tools to detect breaches, analyze URLs, scan IP addresses, and assess password security. Built with a modern React frontend and a powerful Node.js/Express backend, Aegis provides real-time threat intelligence and vulnerability assessment.

🚀 Features
Aegis comes packed with a suite of security tools:

📧 Email Breach Checker: Verify if your email address has been compromised in known data breaches.
🔗 Malicious URL Scanner: Analyze URLs for phishing, malware, and other security threats before you click.
🌐 IP Address Scanner: Get detailed geolocation and ISP information for any IP address.
🛡️ OWASP Vulnerability Scanner: Scan web applications for common security vulnerabilities (OWASP Top 10).
🔑 Password Security Suite:
Strength Checker: Analyze the complexity and resilience of your passwords.
Generator: Create cryptographically secure passwords instantly.
👤 User Authentication: Secure Login and Signup system with JWT authentication.
📄 Report Generation: Export detailed security scan reports to PDF.
🌍 Multi-language Support: Fully localized interface with i18n support.
🛠️ Tech Stack
Frontend
React (Vite) - Fast and modern UI library.
Tailwind CSS - Utility-first CSS framework for styling.
Framer Motion - For smooth animations and transitions.
Three.js / Vanta.js - Immersive 3D background effects.
Axios - For handling API requests.
Backend
Node.js & Express - Robust server-side runtime.
MongoDB & Mongoose - NoSQL database for user data and logs.
JWT (JSON Web Tokens) - Secure stateless authentication.
Bcrypt.js - Password hashing.
APIs & Tools
Google GenAI - AI-powered threat analysis.
Whois-json - Domain registration data.
Nodemailer - Email services.
jsPDF - PDF report generation.
🏁 Getting Started
Follow these steps to set up the project locally.

Prerequisites
Node.js (v16 or higher)
npm or yarn
MongoDB (Local or Atlas connection string)
Installation
Clone the repository
bash
git clone https://github.com/Devansh1623/Breach-detector.git
cd Breach-detector
Install Dependencies
bash
npm install
Configure Environment Variables Create a 
.env
 file in the root directory and add the following variables:
env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Add other API keys as needed (e.g., Google GenAI, VirusTotal, etc.)
Start the Development Server This command runs both the backend server and the frontend concurrently (if configured) or you may need to run them separately.
bash
npm run dev
To run the backend server only:
bash
npm run server
🖥️ Usage
Open your browser and navigate to http://localhost:5173 (or the port shown in your terminal).
Sign Up for a new account to access the dashboard.
Navigate through the Navbar to access different tools like the URL Checker, Email Checker, or Password Tools.
View your scan history and generate PDF reports for your records.
🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request
📄 License
Distributed under the MIT License. See LICENSE for more information.

📞 Contact
Project Link: https://github.com/Devansh1623/Breach-detector
