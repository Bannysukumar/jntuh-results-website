// import AdComponent from "@/components/ads/adcomponent";
import Title from "@/components/homepage/title";
import { homeLinks } from "@/constants/homeLinks";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { 
  GraduationCap, 
  FileText, 
  BookOpen, 
  Briefcase, 
  BarChart3, 
  Users,
  Calendar,
  Bell,
  HelpCircle,
  ArrowRight,
  TrendingUp
} from "lucide-react";

const iconMap: { [key: string]: any } = {
  "Academic Result": GraduationCap,
  "Credit Checker": BarChart3,
  "Jobs and Careers": Briefcase,
  "Syllabus": BookOpen,
  "Backlog Report": FileText,
  "Class Results": Users,
  "Academic All Result": FileText,
  "Academic Calendars": Calendar,
  "Result Contrast": TrendingUp,
  "Notifications": Bell,
  "Help Center": HelpCircle,
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <GraduationCap className="h-8 w-8 md:h-10 md:w-10" />
              </div>
              <Link
                href="/"
                className="text-blue-500 hover:text-blue-600 transition-colors"
                aria-label="Mana JNTUH Results Home"
              >
                <Title />
              </Link>
            </div>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your one-stop portal for JNTUH exam results, academic resources, and career opportunities
            </p>
          </div>

          {/* University Info Card */}
          <div className="flex justify-center mb-8">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl p-4 md:p-6 max-w-3xl">
              <p className="text-sm md:text-base font-medium text-center">
                Jawaharlal Nehru Technological University, Hyderabad - Mana JNTUH Results Portal
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="sr-only">
          <h1>Mana JNTUH Results - Official JNTUH Results Portal</h1>
          <p>Mana JNTUH Results is the premier online platform for checking JNTUH exam results. Access your Mana JNTUH Results for all semesters including B.Tech, M.Tech, MBA, MCA, and B.Pharmacy courses. Check Mana JNTUH Results online instantly with our user-friendly portal.</p>
        </div>

        {/* Main Links Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" aria-label="Main Navigation Links">
          {homeLinks.map((homelink: any, index: number) => {
            const Icon = iconMap[homelink.title] || FileText;
            return (
              <Link href={homelink.link} key={index}>
                <Card className="h-full p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-2 hover:border-blue-500 bg-white dark:bg-gray-800 group">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {homelink.title}
                        </h3>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {homelink.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}

          {/* Mobile-only links */}
          <Link href="/academicallresult" className="md:hidden">
            <Card className="h-full p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-2 hover:border-blue-500 bg-white dark:bg-gray-800 group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      Academic All Result
                    </h3>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Check the results of all the exams you&apos;ve taken.
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/calendars" className="md:hidden">
            <Card className="h-full p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-2 hover:border-blue-500 bg-white dark:bg-gray-800 group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      Academic Calendars
                    </h3>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Get all the Academic Calendars with proper segregation at one place
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/resultcontrast" className="md:hidden">
            <Card className="h-full p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-2 hover:border-blue-500 bg-white dark:bg-gray-800 group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      Result Contrast
                    </h3>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Compare your academic performance across all semesters with your classmate.
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/notifications" className="md:hidden">
            <Card className="h-full p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-2 hover:border-blue-500 bg-white dark:bg-gray-800 group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Bell className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                      Notifications
                    </h3>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Get all the latest Notifications from JNTUH
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/helpcenter" className="md:hidden">
            <Card className="h-full p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-2 hover:border-blue-500 bg-white dark:bg-gray-800 group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Help Center
                    </h3>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Discover a Bug? Report it and Help us in Enhancing Your Experience!
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-900 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              &copy; 2026 manajntuhresults.vercel.app - Mana JNTUH Results Portal
            </p>
            <div>
              <Link
                href="/privacy"
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline underline-offset-2 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
