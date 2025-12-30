"use client";

import { useState } from "react";
import { NativeButton } from "@/components/native/native-button";
import { ImpactStyle } from "@capacitor/haptics";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Send, 
  User, 
  Mail, 
  FileText, 
  MessageCircle,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";
import { submitFeedback } from "@/lib/feedback";
import Footer from "@/components/footer/footer";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    if (message.length < 10) {
      toast.error("Please provide more details in your feedback (minimum 10 characters)");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback({
        name,
        email,
        subject,
        message,
      });
      toast.success("Thank you for your feedback! We'll review it soon.");
      setIsSubmitted(true);
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 dark:bg-blue-500/20 mb-4">
            <MessageSquare className="h-10 w-10 text-blue-500 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Share Your Feedback
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your thoughts help us improve. Share your suggestions, report issues, or tell us what you love about Mana JNTUH Results.
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="border-2 border-slate-800 dark:border-gray-700 shadow-2xl rounded-xl overflow-hidden hover:shadow-3xl transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 px-6 py-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-white" />
              <h2 className="text-xl font-semibold text-white">
                Feedback Form
              </h2>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your feedback has been submitted successfully. We appreciate your input!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      disabled={isSubmitting}
                      className="h-12 text-base border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.doe@example.com"
                      required
                      disabled={isSubmitting}
                      className="h-12 text-base border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-base font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of your feedback"
                    required
                    disabled={isSubmitting}
                    className="h-12 text-base border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-base font-medium flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    Your Feedback / Suggestion
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please share your thoughts, suggestions, or report any issues. Be as detailed as possible..."
                    required
                    disabled={isSubmitting}
                    className="min-h-[180px] text-base border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-colors resize-y"
                    rows={8}
                  />
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-gray-500 dark:text-gray-400">
                      Minimum 10 characters required
                    </p>
                    <p className={`font-medium ${
                      message.length < 10 
                        ? "text-gray-500 dark:text-gray-400" 
                        : "text-green-600 dark:text-green-400"
                    }`}>
                      {message.length} characters
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <NativeButton
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
                    disabled={isSubmitting || message.length < 10}
                    hapticStyle={ImpactStyle.Medium}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Submit Feedback
                      </span>
                    )}
                  </NativeButton>
                </div>
              </form>
            )}
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="p-4 border-2 border-slate-800 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Quick Response
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We review all feedback within 24-48 hours
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-2 border-slate-800 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Your Privacy
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your information is kept confidential and secure
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-2 border-slate-800 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Continuous Improvement
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your suggestions help us enhance the platform
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

