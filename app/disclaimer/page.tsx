import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Info, ShieldCheck, Scale } from "lucide-react";
import Footer from "@/components/footer/footer";

const Disclaimer = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                            <AlertTriangle className="h-10 w-10" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Disclaimer
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Important information regarding the use of Mana JNTUH Results portal.
                    </p>
                </div>

                <Card className="p-8 md:p-12 bg-white dark:bg-gray-800 border-0 shadow-2xl mb-12">
                    <div className="space-y-8">
                        {/* Affiliation Section */}
                        <div className="flex gap-6">
                            <div className="flex-shrink-0 p-3 h-fit rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                <Info className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Official Affiliation</h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Mana JNTUH Results (manajntuhresults.vercel.app) is an independent, third-party academic portal developed for the convenience of students. We are <strong>NOT</strong> affiliated with, authorized, maintained, sponsored, or endorsed by Jawaharlal Nehru Technological University, Hyderabad (JNTUH) or any of its constituent colleges.
                                </p>
                            </div>
                        </div>

                        {/* Content Accuracy */}
                        <div className="flex gap-6">
                            <div className="flex-shrink-0 p-3 h-fit rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Information Accuracy</h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    While we strive to provide accurate and up-to-date information fetched from official JNTUH sources, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the results or information contained on this website.
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mt-4 font-semibold italic">
                                    Any reliance you place on such information is strictly at your own risk.
                                </p>
                            </div>
                        </div>

                        {/* Official Records */}
                        <div className="flex gap-6">
                            <div className="flex-shrink-0 p-3 h-fit rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                <Scale className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Official Use Warning</h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    The results displayed on this portal are for immediate information to the examinees and do not constitute a legal document. For official purposes, students are advised to rely only on the original marks sheets/certificates issued by JNTUH. In case of any discrepancy, the records maintained by the University shall be final.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">External Links</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            Our website may contain links to external websites that are not provided or maintained by us. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
                        </p>
                    </div>
                </Card>

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

export default Disclaimer;
