import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Mail, MessageSquare, MapPin, Send } from "lucide-react";
import Footer from "@/components/footer/footer";

const ContactUs = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Contact Us
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Have questions, feedback, or need support? We&apos;re here to help you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <Card className="p-6 bg-white dark:bg-gray-800 border-0 shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Email Us</h3>
                                    <a href="mailto:bannysukumar@gmail.com" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                        bannysukumar@gmail.com
                                    </a>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white dark:bg-gray-800 border-0 shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Community</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Connect on Telegram for instant updates.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white dark:bg-gray-800 border-0 shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Location</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Hyderabad, Telangana, India
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Contact Form Placeholder / Message */}
                    <div className="lg:col-span-2">
                        <Card className="p-8 bg-white dark:bg-gray-800 border-0 shadow-xl h-full">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
                            <div className="space-y-6">
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    We value your input and strive to improve the Mana JNTUH Results portal every day. Whether you&apos;ve found a bug, have a feature suggestion, or just want to say thanks, we&apos;re all ears.
                                </p>

                                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Technical Support</h4>
                                    <p className="text-sm text-blue-800 dark:text-blue-400">
                                        For technical issues regarding result fetching or CGPA calculations, please include your Hall Ticket Number and the specific error you encountered.
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <a
                                        href="mailto:bannysukumar@gmail.com"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-blue-500/30"
                                    >
                                        <Send className="h-5 w-5" />
                                        Send Email Now
                                    </a>
                                    <Link href="/helpcenter" className="text-gray-600 dark:text-gray-400 hover:underline">
                                        Visit Help Center
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

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

export default ContactUs;
