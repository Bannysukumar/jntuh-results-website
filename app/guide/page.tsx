import Link from "next/link";
import { Card } from "@/components/ui/card";
import { BookOpen, Search, Calculator, CheckCircle, HelpCircle } from "lucide-react";
import Footer from "@/components/footer/footer";

const Guide = () => {
    const steps = [
        {
            title: "Get Your Hall Ticket Number",
            description: "Ensure you have your 10-digit JNTUH Hall Ticket number (e.g., 20X01A0501) ready. Double-check for any typos.",
            icon: Search,
        },
        {
            title: "Select your Feature",
            description: "On our homepage, choose between 'Academic Result' for semester-wise view or 'Academic All Result' for a consolidated overview.",
            icon: BookOpen,
        },
        {
            title: "Enter Details & Submit",
            description: "Paste your roll number into the search box. Our system will immediately start communicating with JNTUH servers to fetch your data.",
            icon: CheckCircle,
        },
        {
            title: "Analyze your Results",
            description: "Once fetched, you can view your grades, calculate your semester SGPA and overall CGPA instantly using our built-in tools.",
            icon: Calculator,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                        How to Check JNTUH Results
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        A step-by-step guide to using the Mana JNTUH Results portal effectively.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <Card key={index} className="p-8 bg-white dark:bg-gray-800 border-0 shadow-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Icon className="h-24 w-24" />
                                </div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {step.description}
                                </p>
                            </Card>
                        );
                    })}
                </div>

                {/* Pro Tips Section */}
                <section className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-16 overflow-hidden relative">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                            <HelpCircle className="h-8 w-8" />
                            Pro Tips for Best Experience
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-xl font-semibold underline underline-offset-4">Result Preparation</h4>
                                <p className="text-blue-100 text-sm leading-relaxed">
                                    If the JNTUH server shows &quot;Result is being prepared,&quot; check back after 15-20 minutes. This is a common occurrence during mass result releases.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xl font-semibold underline underline-offset-4">RCRV Updates</h4>
                                <p className="text-blue-100 text-sm leading-relaxed">
                                    Our portal automatically identifies and highlights Revaluation (RC) and Recounting (RV) results, saving you the trouble of manual comparison.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xl font-semibold underline underline-offset-4">Mobile PWA</h4>
                                <p className="text-blue-100 text-sm leading-relaxed">
                                    Install our site as a Progressive Web App (PWA) on your mobile home screen for faster access without having to type the URL every time.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-xl font-semibold underline underline-offset-4">Save for Offline</h4>
                                <p className="text-blue-100 text-sm leading-relaxed">
                                    Use the browser&apos;s &quot;Print to PDF&quot; feature on our result pages to save your academic records for offline viewing or verification.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Background Icon */}
                    <BookOpen className="absolute -bottom-10 -right-10 h-64 w-64 text-blue-500 opacity-20 rotate-12" />
                </section>

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

export default Guide;
