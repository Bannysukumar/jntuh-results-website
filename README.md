# Mana JNTUH Results

A modern, user-friendly web portal for Jawaharlal Nehru Technological University Hyderabad (JNTUH) students to check their exam results, access academic resources, and explore career opportunities.

## 🌟 Features

### Result Services
- **Academic Result** - Check your overall academic performance with hall ticket number
- **Academic All Results** - View all exam results in one place
- **Backlog Report** - Access comprehensive backlog information
- **Class Result** - Compare your performance with classmates
- **Credits Checker** - Check credits needed for graduation
- **Result Contrast** - Compare academic performance across semesters

### Academic Resources
- **Academic Calendars** - Access all academic calendars with proper segregation
- **Syllabus** - View detailed syllabus subject-wise for your academic year
- **Notifications** - Stay updated with latest JNTUH notifications and announcements

### Career & Support
- **Jobs & Careers** - Explore internships and job opportunities
- **Help Center** - Get help, find answers, and submit feedback
- **Feedback System** - Share suggestions and report issues

### Additional Features
- 🔐 **Admin Dashboard** - Complete admin panel with analytics, user management, and settings
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🌙 **Dark Mode** - Toggle between light and dark themes
- ⚡ **Fast Performance** - Optimized for speed and reliability
- 🔍 **SEO Optimized** - Built for search engine visibility

## 🛠️ Tech Stack

- **Framework:** Next.js 14.2.18
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, Lucide React Icons
- **Authentication:** Firebase Authentication
- **Database:** Firebase Firestore
- **Analytics:** Google Analytics
- **Deployment:** Vercel
- **State Management:** React Hooks

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bannysukumar/jntuh-results-website.git
   cd jntuh-results-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_GOOGLE_ANALYTICS=G-KHQHHFYXCL
   ```

4. **Configure Firebase**
   Update `lib/firebase.ts` with your Firebase configuration:
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     // ... other config
   };
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

The project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables
4. Deploy!

The site will be automatically deployed on every push to the main branch.

**Live Site:** [https://manajntuhresults.vercel.app](https://manajntuhresults.vercel.app)

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (root)/            # Root pages
│   ├── admin/             # Admin dashboard pages
│   ├── academicresult/    # Academic result pages
│   ├── calendars/         # Academic calendars
│   ├── careers/           # Jobs and careers
│   ├── notifications/     # Notifications
│   └── ...                # Other feature pages
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── forms/            # Form components
│   ├── homepage/         # Homepage components
│   └── ui/               # UI components
├── constants/            # Constants and data
├── contexts/            # React contexts
├── lib/                 # Utility functions
└── public/              # Static assets
```

## 🔑 Key Features Implementation

### Admin Dashboard
- Secure authentication with Firebase
- User management system
- Analytics dashboard
- Feedback management
- System settings

### Result Fetching
- Integration with JNTUH result APIs
- Caching for improved performance
- Error handling and retry logic

### SEO Optimization
- Comprehensive metadata
- Structured data (JSON-LD)
- Sitemap generation
- Robots.txt configuration
- Open Graph and Twitter Card tags

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Adepu Sukumar**
- Email: bannysukumar@gmail.com
- GitHub: [@Bannysukumar](https://github.com/Bannysukumar)
- LinkedIn: [adepusukumar](https://www.linkedin.com/in/adepusukumar)
- Instagram: [@Hacking_with_banny](https://www.instagram.com/hacking_with_banny/)

## 🙏 Acknowledgments

- Jawaharlal Nehru Technological University Hyderabad
- All contributors and users of the platform
- The open-source community

## 📱 Mobile App

Check out the **JNTUHConnect** mobile app on Google Play Store for a native mobile experience!

## 📞 Support

For support, email bannysukumar@gmail.com or visit the [Help Center](https://manajntuhresults.vercel.app/helpcenter).

---

Made with ❤️ for JNTUH Students

