import Link from "next/link";
import React, { useEffect } from "react";
import { Share2, MessageCircle, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const NotificationResults = ({
  results,
  incrementPage,
  loading,
}: notificationResultsProps & { loading?: boolean }) => {
  useEffect(() => {
    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } =
        document.documentElement;
      const isScrolledToBottom = scrollTop + clientHeight + 300 >= scrollHeight;
      if (isScrolledToBottom) {
        incrementPage();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [incrementPage]);

  const onLinkClick = (query: string) => {
    const modifiedquery = "notifications/examcode?" + query;
    window.open(modifiedquery, "_blank");
  };

  const handleShare = (result: Result) => {
    if (navigator.share) {
      navigator.share({
        title: result.title,
        text: `Check out this JNTUH notification: ${result.title}`,
        url: result.link,
      });
    }
  };

  if (loading && results.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="p-6">
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-4 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="p-12 text-center">
        <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
          No Notifications Found
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Try adjusting your search filters to see more results
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((result: Result, index: number) => {
        const query =
          "link=" +
          encodeURIComponent(result.link) +
          "&" +
          "title=" +
          result.title +
          "&date=" +
          result.date +
          "&formatted_date=" +
          result.releaseDate;

        return (
          <Card
            key={index}
            onClick={() => {
              onLinkClick(query);
            }}
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 p-6 border-2 hover:border-blue-500 bg-white dark:bg-gray-800"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 flex-1 pr-2">
                {result.title}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(result);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
              >
                <Share2 size={16} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <CalendarIcon size={14} className="text-blue-500" />
              <span>{result.date}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onLinkClick(query);
                }}
              >
                View Details
              </Button>
              <Link
                href={`https://api.whatsapp.com/send?text=*Check out the Results!* \n\n ${result.title} \n\n${result.link}\n`}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <MessageCircle size={16} className="text-green-500" />
              </Link>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default NotificationResults;
