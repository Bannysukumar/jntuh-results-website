import Link from "next/link";
import { Card } from "@/components/ui/card";
import { GraduationCap, Target, Users, Shield } from "lucide-react";
import Footer from "@/components/footer/footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <GraduationCap className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            About Mana JNTUH Results
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Empowering JNTUH students with fast, reliable, and comprehensive academic insights since 2024.
          </p>
        </div>

        {/* Story Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Mana JNTUH Results was born out of a simple necessity: to provide students of Jawaharlal Nehru Technological University, Hyderabad (JNTUH) with a more efficient way to access and analyze their academic performance. We understand the stress and anticipation that comes with exam results, and our goal is to make that experience as smooth as possible.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our platform goes beyond just displaying marks. We provide advanced tools like CGPA calculators, backlog trackers, and credit checkers to help students plan their academic journey with clarity and confidence.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 bg-white dark:bg-gray-800 border-0 shadow-lg">
            <Target className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Accuracy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We fetch data directly from official sources to ensure that the information you see is consistent with JNTUH records.
            </p>
          </Card>
          <Card className="p-6 bg-white dark:bg-gray-800 border-0 shadow-lg">
            <Users className="h-8 w-8 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Student-Centric</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Every feature we build is designed based on feedback from the JNTUH student community.
            </p>
          </Card>
          <Card className="p-6 bg-white dark:bg-gray-800 border-0 shadow-lg">
            <Shield className="h-8 w-8 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Privacy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We prioritize your privacy. Your academic data is fetched on-demand and is not stored permanently on our servers.
            </p>
          </Card>
        </div>

        {/* Why We Are Different */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Why Choose Our Portal?</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Comprehensive Analysis</h4>
                <p className="text-gray-600 dark:text-gray-400">View all your results from R18 regulation onwards in one consolidated report, including RCRV results.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">2</div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Intelligent Tracking</h4>
                <p className="text-gray-600 dark:text-gray-400">Our Backlog Report and Credit Checker tools help you stay on top of your graduation requirements.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">3</div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Seamless Experience</h4>
                <p className="text-gray-600 dark:text-gray-400">A modern, responsive interface that works perfectly on your phone, tablet, or desktop.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Note */}
        <p className="text-sm text-gray-500 text-center mb-8 italic">
          Disclaimer: Mana JNTUH Results is an independent platform and is not affiliated with Jawaharlal Nehru Technological University, Hyderabad.
        </p>
        
        <div className="text-center">
          <Link href="/" className="text-blue-600 hover:underline inline-flex items-center gap-2">
            Return to Homepage
          </Link>
        </div>
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;
