import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HelpCircle, MessageSquare, ArrowRight, BookOpen, Mail } from "lucide-react";
import Footer from "@/components/footer/footer";

const HelpCenter = () => {
  const helpOptions = [
    {
      title: "Frequently Asked Questions",
      description: "Find answers to the most commonly asked questions about using Mana JNTUH Results portal.",
      icon: HelpCircle,
      href: "/faq",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Submit Feedback",
      description: "Share your suggestions, report issues, or provide feedback to help us improve your experience.",
      icon: MessageSquare,
      href: "/feedback",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
  ];

  const quickLinks = [
    {
      title: "How to Check Results",
      description: "Step-by-step guide to checking your exam results",
      icon: BookOpen,
    },
    {
      title: "Contact Support",
      description: "Get in touch with our support team for assistance",
      icon: Mail,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              Help Center
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Get help, find answers, and learn how to make the most of Mana JNTUH Results portal
          </p>
        </div>

        {/* Main Help Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {helpOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Link key={index} href={option.href}>
                <Card className="p-6 h-full cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-2 hover:border-blue-500 bg-white dark:bg-gray-800 group">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${option.iconBg} ${option.iconColor} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {option.title}
                        </h3>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Links Section */}
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-500" />
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-900/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {link.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 text-center bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Check our FAQ section for common questions and answers
            </p>
          </Card>
          <Card className="p-6 text-center bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <MessageSquare className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              Have Feedback?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share your thoughts and help us improve the platform
            </p>
          </Card>
          <Card className="p-6 text-center bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              Learn More
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Explore all features and get the most out of our platform
            </p>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HelpCenter;
