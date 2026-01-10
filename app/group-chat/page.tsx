"use client";
import { useState, useEffect, useRef } from "react";
import { db, realtimeDb } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  limit,
  Timestamp,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  ref,
  set,
  onDisconnect,
  onValue,
  serverTimestamp,
  off,
} from "firebase/database";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Users, Send, X, ChevronDown, ChevronUp, Ban, Flag, Smile } from "lucide-react";
import Footer from "@/components/footer/footer";
// Import admin utilities (makes functions available globally at window.groupChatAdmin)
import "@/lib/group-chat-admin";
import toast from "react-hot-toast";

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Timestamp | Date;
  deviceId?: string;
  replyTo?: {
    messageId: string;
    username: string;
    text: string;
  };
}

interface MessageReactions {
  [emoji: string]: {
    count: number;
    users: string[]; // deviceIds who reacted
  };
}

interface ReportData {
  messageId: string;
  messageText: string;
  reportedUsername: string;
  reportedDeviceId: string;
  reporterDeviceId: string;
  reason: string;
  timestamp: Timestamp;
}

interface OnlineUser {
  sessionId: string;
  username: string;
  deviceId?: string;
  lastSeen: number;
}

const GroupChat = () => {
  const [username, setUsername] = useState<string>("");
  const [inputUsername, setInputUsername] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [showOnlineList, setShowOnlineList] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [deviceId, setDeviceId] = useState<string>("");
  const [isBanned, setIsBanned] = useState<boolean>(false);
  const [banReason, setBanReason] = useState<string>("");
  const [reactions, setReactions] = useState<Record<string, MessageReactions>>({});
  const [showReactions, setShowReactions] = useState<string | null>(null); // messageId
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reportReason, setReportReason] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const listenerInitializedRef = useRef<boolean>(false);
  
  // Swipe gesture state
  const swipeStartRef = useRef<{ x: number; y: number; messageId: string | null }>({ x: 0, y: 0, messageId: null });
  const doubleClickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Available emoji reactions
  const EMOJI_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🔥", "💯"];

  // Generate and store device ID (once per device)
  useEffect(() => {
    let storedDeviceId = localStorage.getItem("deviceId");
    
    if (!storedDeviceId) {
      // Generate new device ID using crypto.randomUUID() or fallback
      if (typeof window !== "undefined" && crypto && crypto.randomUUID) {
        storedDeviceId = "dev_" + crypto.randomUUID();
      } else {
        // Fallback for browsers without crypto.randomUUID
        storedDeviceId = "dev_" + Date.now() + "_" + Math.random().toString(36).substring(2, 15);
      }
      localStorage.setItem("deviceId", storedDeviceId);
    }
    
    setDeviceId(storedDeviceId);

    // Generate session ID (every page load) - format: sess_timestamp_random
    const newSessionId = "sess_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
    setSessionId(newSessionId);
  }, []);

  // Check ban status on page load and listen for real-time changes
  useEffect(() => {
    if (!deviceId) return;

    // Real-time listener for ban status changes
    const banRef = doc(db, "bannedUsers", deviceId);
    
    // Use onSnapshot for real-time updates - user will see ban screen immediately when banned
    // This listener will fire instantly when admin bans the user
    const unsubscribe = onSnapshot(
      banRef,
      (banSnap) => {
        try {
          if (banSnap.exists()) {
            const banData = banSnap.data();
            console.log("🚫 User banned - showing ban screen immediately");
            setIsBanned(true);
            setBanReason(banData.reason || "Violation of terms");
            // State update will trigger re-render and show ban screen
          } else {
            // User is not banned or was unbanned
            setIsBanned(false);
            setBanReason("");
          }
        } catch (error) {
          console.error("Error checking ban status:", error);
        }
      },
      (error) => {
        console.error("Error listening to ban status:", error);
        // Fallback: check once on error
        getDoc(banRef)
          .then((snap) => {
            if (snap.exists()) {
              const banData = snap.data();
              setIsBanned(true);
              setBanReason(banData.reason || "Violation of terms");
            }
          })
          .catch((err) => {
            console.error("Error in fallback ban check:", err);
          });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [deviceId]);

  // Load username from localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("groupChatUsername");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Set up presence tracking in Realtime Database
  useEffect(() => {
    if (!username || !sessionId || isBanned) return; // Don't set presence if banned

    try {
      const presenceRef = ref(realtimeDb, `presence/${sessionId}`);
      
      // Set user as online with device ID
      set(presenceRef, {
        username,
        deviceId: deviceId || "unknown",
        lastSeen: serverTimestamp(),
      }).catch((error) => {
        console.error("Error setting presence:", error);
      });

      // Set up onDisconnect to remove user when they leave
      // This will automatically clean up when:
      // - Tab is closed
      // - Page is refreshed
      // - Internet disconnects
      // - Browser crashes
      onDisconnect(presenceRef).remove().catch((error) => {
        console.error("Error setting up onDisconnect:", error);
      });

      // Listen for online users
      const onlineUsersRef = ref(realtimeDb, "presence");
      const unsubscribe = onValue(onlineUsersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const users: OnlineUser[] = Object.entries(data).map(([key, value]: [string, any]) => ({
            sessionId: key,
            username: value.username || "Unknown",
            deviceId: value.deviceId || "unknown",
            lastSeen: value.lastSeen || Date.now(),
          }));
          setOnlineUsers(users);
          setOnlineCount(users.length);
        } else {
          setOnlineUsers([]);
          setOnlineCount(0);
        }
      }, (error) => {
        console.error("Error listening to online users:", error);
        setOnlineUsers([]);
        setOnlineCount(0);
      });

      // Cleanup on unmount or if user gets banned
      return () => {
        off(onlineUsersRef);
        // Remove presence when user is banned or unmounts
        set(presenceRef, null).catch((error) => {
          console.error("Error removing presence:", error);
        });
      };
    } catch (error) {
      console.error("Error initializing presence tracking:", error);
    }
  }, [username, sessionId, deviceId]);

  // Remove presence and stop all listeners immediately when user gets banned
  useEffect(() => {
    if (isBanned) {
      console.log("🚫 User banned - cleaning up presence and listeners");
      
      // Remove presence from Realtime Database
      if (username && sessionId) {
        try {
          const presenceRef = ref(realtimeDb, `presence/${sessionId}`);
          set(presenceRef, null).catch((error) => {
            console.error("Error removing presence on ban:", error);
          });
        } catch (error) {
          console.error("Error removing presence on ban:", error);
        }
      }
      
      // Clear messages and stop message listener
      setMessages([]);
      listenerInitializedRef.current = false;
      
      // Clear online users
      setOnlineUsers([]);
      setOnlineCount(0);
    }
  }, [isBanned, username, sessionId]);

  // Set up Firestore listener for messages (only once to avoid duplicates)
  useEffect(() => {
    if (!username || isBanned || listenerInitializedRef.current) return;

    listenerInitializedRef.current = true;
    const messagesRef = collection(db, "groupChatMessages");
    const q = query(messagesRef, orderBy("timestamp", "asc"), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedMessages.push({
          id: doc.id,
          username: data.username,
          text: data.text,
          timestamp: data.timestamp?.toDate() || new Date(),
          deviceId: data.deviceId || undefined,
          replyTo: data.replyTo || undefined,
        });
      });
      // Set messages (Firestore listener handles updates automatically, no duplicates)
      setMessages(fetchedMessages);
    });

    return () => {
      unsubscribe();
      listenerInitializedRef.current = false;
    };
  }, [username, isBanned]);

  // Listen to reactions for all messages
  useEffect(() => {
    if (!username || isBanned || messages.length === 0) return;

    const reactionsRefs = messages.map((msg) => doc(db, "messageReactions", msg.id));
    const unsubscribes: Array<() => void> = [];

    reactionsRefs.forEach((reactionRef, index) => {
      const unsubscribe = onSnapshot(reactionRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setReactions((prev) => ({
            ...prev,
            [messages[index].id]: data.reactions || {},
          }));
        } else {
          setReactions((prev) => {
            const updated = { ...prev };
            delete updated[messages[index].id];
            return updated;
          });
        }
      }, (error) => {
        console.error("Error listening to reactions:", error);
      });

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [messages, username, isBanned]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEnterChat = async () => {
    const trimmedName = inputUsername.trim();
    if (trimmedName && deviceId) {
      setUsername(trimmedName);
      localStorage.setItem("groupChatUsername", trimmedName);
      
      // Store username → deviceId mapping in Firestore for admin lookup
      try {
        await setDoc(doc(db, "userDeviceMappings", trimmedName), {
          deviceId,
          username: trimmedName,
          lastSeen: Timestamp.now(),
          createdAt: Timestamp.now(),
        }, { merge: true }); // Use merge to update if exists
      } catch (error) {
        console.error("Error storing user mapping:", error);
        // Don't block user from entering chat if mapping fails
      }
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !username || isBanned) return;

    try {
      const messageData: any = {
        username,
        deviceId: deviceId || "unknown",
        text: newMessage.trim(),
        timestamp: Timestamp.now(),
      };

      if (replyingTo) {
        messageData.replyTo = {
          messageId: replyingTo.id,
          username: replyingTo.username,
          text: replyingTo.text,
        };
      }

      await addDoc(collection(db, "groupChatMessages"), messageData);
      setNewMessage("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Timestamp | Date): string => {
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleReplyClick = (message: Message) => {
    // Allow replying to any message (including own messages)
    setReplyingTo(message);
    setShowReactions(null); // Close reaction menu if open
    // Scroll to input area
    setTimeout(() => {
      const inputElement = document.querySelector('input[placeholder*="Type your message"]') as HTMLInputElement;
      inputElement?.focus();
    }, 100);
  };

  // Handle double-click to reply
  const handleDoubleClick = (message: Message) => {
    // Clear any existing timer
    if (doubleClickTimerRef.current) {
      clearTimeout(doubleClickTimerRef.current);
      doubleClickTimerRef.current = null;
    }
    
    handleReplyClick(message);
  };

  // Handle single click (for double-click detection)
  const handleSingleClick = (message: Message) => {
    // Clear existing timer
    if (doubleClickTimerRef.current) {
      clearTimeout(doubleClickTimerRef.current);
    }
    
    // Set new timer to detect double-click
    doubleClickTimerRef.current = setTimeout(() => {
      // Single click - show reaction menu (for other users' messages)
      const isOwnMessage = message.username === username || message.deviceId === deviceId;
      if (!isOwnMessage) {
        if (showReactions === message.id) {
          setShowReactions(null);
        } else {
          setShowReactions(message.id);
        }
      }
      doubleClickTimerRef.current = null;
    }, 300); // 300ms delay to detect double-click
  };

  // Handle touch start for swipe gesture
  const handleTouchStart = (e: React.TouchEvent, message: Message) => {
    const touch = e.touches[0];
    swipeStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      messageId: message.id,
    };
  };

  // Handle touch end for swipe gesture
  const handleTouchEnd = (e: React.TouchEvent, message: Message) => {
    if (!swipeStartRef.current.messageId) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - swipeStartRef.current.x;
    const deltaY = touch.clientY - swipeStartRef.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Detect swipe (minimum 50px horizontal movement, less than 100px vertical)
    if (absDeltaX > 50 && absDeltaY < 100 && swipeStartRef.current.messageId === message.id) {
      // Left swipe (negative deltaX) or right swipe (positive deltaX) - both trigger reply
      handleReplyClick(message);
    }

    // Reset visual feedback and swipe state
    const target = e.currentTarget as HTMLElement;
    target.style.transform = '';
    target.style.transition = '';
    target.style.opacity = '';
    swipeStartRef.current = { x: 0, y: 0, messageId: null };
  };

  // Handle touch move for swipe visual feedback
  const handleTouchMove = (e: React.TouchEvent, message: Message) => {
    if (!swipeStartRef.current.messageId || swipeStartRef.current.messageId !== message.id) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeStartRef.current.x;
    const deltaY = touch.clientY - swipeStartRef.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // If horizontal swipe is dominant
    if (absDeltaX > absDeltaY && absDeltaX > 10) {
      const target = e.currentTarget as HTMLElement;
      // Apply visual feedback (move message slightly)
      target.style.transform = `translateX(${deltaX * 0.5}px)`;
      target.style.opacity = `${1 - Math.abs(deltaX) / 200}`;
    }
  };

  const handleMessageClick = (message: Message, event: React.MouseEvent) => {
    // Check if click is on username, timestamp, or reaction (don't show menu for those)
    const target = event.target as HTMLElement;
    if (target.closest('.message-username') || target.closest('.message-timestamp') || target.closest('.message-reaction')) {
      return;
    }
    
    // Use single click handler which will detect double-click
    handleSingleClick(message);
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    if (!deviceId || isBanned) return;

    // Find the message to check if it's own message
    const message = messages.find((m) => m.id === messageId);
    if (!message) {
      toast.error("Message not found");
      return;
    }

    // Prevent reacting to own messages
    const isOwnMessage = message.username === username || message.deviceId === deviceId;
    if (isOwnMessage) {
      toast.error("You cannot react to your own messages");
      return;
    }

    try {
      const reactionRef = doc(db, "messageReactions", messageId);
      const reactionSnap = await getDoc(reactionRef);

      let currentReactions: MessageReactions = {};
      if (reactionSnap.exists()) {
        currentReactions = reactionSnap.data().reactions || {};
      }

      // Initialize emoji if not exists
      if (!currentReactions[emoji]) {
        currentReactions[emoji] = { count: 0, users: [] };
      }

      // Check if user already reacted with this emoji
      const userIndex = currentReactions[emoji].users.indexOf(deviceId);
      if (userIndex > -1) {
        // Remove reaction
        currentReactions[emoji].count--;
        currentReactions[emoji].users.splice(userIndex, 1);
        if (currentReactions[emoji].count === 0) {
          delete currentReactions[emoji];
        }
      } else {
        // Add reaction
        currentReactions[emoji].count++;
        currentReactions[emoji].users.push(deviceId);
      }

      await setDoc(reactionRef, {
        messageId,
        reactions: currentReactions,
        updatedAt: Timestamp.now(),
      }, { merge: true });

      setShowReactions(null);
    } catch (error) {
      console.error("Error adding reaction:", error);
      toast.error("Failed to add reaction");
    }
  };

  const handleReportClick = (message: Message) => {
    // Prevent reporting own messages
    const isOwnMessage = message.username === username || message.deviceId === deviceId;
    if (isOwnMessage) {
      toast.error("You cannot report your own messages");
      return;
    }

    setSelectedMessage(message);
    setShowReportDialog(true);
    setShowReactions(null);
  };

  const handleSubmitReport = async () => {
    if (!selectedMessage || !reportReason.trim() || !deviceId || isBanned) return;

    // Double-check: Prevent reporting own messages
    const isOwnMessage = selectedMessage.username === username || selectedMessage.deviceId === deviceId;
    if (isOwnMessage) {
      toast.error("You cannot report your own messages");
      setShowReportDialog(false);
      setSelectedMessage(null);
      setReportReason("");
      return;
    }

    // Prevent reporting the same message multiple times from the same device
    try {
      const reportsRef = collection(db, "messageReports");
      const existingReportsQuery = query(
        reportsRef,
        where("messageId", "==", selectedMessage.id),
        where("reporterDeviceId", "==", deviceId)
      );
      const existingReportsSnapshot = await getDocs(existingReportsQuery);
      
      if (!existingReportsSnapshot.empty) {
        toast.error("You have already reported this message");
        setShowReportDialog(false);
        setSelectedMessage(null);
        setReportReason("");
        return;
      }

      const reportData = {
        messageId: selectedMessage.id,
        messageText: selectedMessage.text,
        reportedUsername: selectedMessage.username,
        reportedDeviceId: selectedMessage.deviceId || "unknown",
        reporterDeviceId: deviceId,
        reason: reportReason.trim(),
        timestamp: Timestamp.now(),
        status: "pending",
      };

      await addDoc(collection(db, "messageReports"), reportData);
      toast.success("Report submitted successfully");
      setShowReportDialog(false);
      setSelectedMessage(null);
      setReportReason("");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report");
    }
  };

  // Ban screen
  if (isBanned) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900 dark:to-red-950 flex items-center justify-center px-4">
        <Card className="p-8 max-w-md w-full shadow-xl border-2 border-red-500 bg-white dark:bg-gray-800">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                <Ban className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Access Restricted
              </h1>
            </div>
            <p className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
              You are banned from this chat
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Reason: {banReason}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Name input screen
  if (!username) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center px-4">
        <Card className="p-8 max-w-md w-full shadow-xl border-2 bg-white dark:bg-gray-800">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Group Chat
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Enter your name to join the public group chat
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Display Name
              </label>
              <Input
                id="username"
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleEnterChat();
                  }
                }}
                placeholder="Enter your name..."
                className="w-full h-12 text-lg"
                autoFocus
              />
            </div>
            <Button
              onClick={handleEnterChat}
              className="w-full h-12 text-lg bg-blue-500 hover:bg-blue-600"
              disabled={!inputUsername.trim()}
            >
              Enter Chat
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Chat interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Group Chat
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Public chat room - All users
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowOnlineList(!showOnlineList)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">{onlineCount} online</span>
                  {showOnlineList ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {showOnlineList && (
                  <Card className="absolute right-0 mt-2 w-64 p-4 bg-white dark:bg-gray-800 shadow-xl border-2 max-h-64 overflow-y-auto z-20">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Online Users ({onlineCount})
                    </h3>
                    <div className="space-y-2">
                      {onlineUsers.map((user) => (
                        <div
                          key={user.sessionId}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-900 dark:text-white">
                              {user.username}
                            </span>
                          </div>
                          {user.deviceId && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                              {user.deviceId.substring(0, 15)}...
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 max-w-7xl mx-auto w-full"
      >
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.username === username;
            const repliedMessage = message.replyTo;
            const messageReactions = reactions[message.id] || {};
            const hasReactions = Object.keys(messageReactions).length > 0;
            const isReactionMenuOpen = showReactions === message.id;

            return (
              <div
                key={message.id}
                className={`flex flex-col ${
                  isOwnMessage ? "items-end" : "items-start"
                }`}
              >
                <div className="max-w-[70%] md:max-w-[60%]">
                  <div
                    className={`rounded-lg p-3 transition-all hover:shadow-md relative group cursor-pointer select-none touch-pan-y ${
                      isOwnMessage
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
                    }`}
                    onClick={(e) => handleMessageClick(message, e)}
                    onDoubleClick={() => handleDoubleClick(message)}
                    onTouchStart={(e) => handleTouchStart(e, message)}
                    onTouchMove={(e) => {
                      handleTouchMove(e, message);
                      // Prevent default scrolling during horizontal swipe only
                      if (swipeStartRef.current.messageId === message.id) {
                        const touch = e.touches[0];
                        const deltaX = Math.abs(touch.clientX - swipeStartRef.current.x);
                        const deltaY = Math.abs(touch.clientY - swipeStartRef.current.y);
                        // Only prevent default if horizontal swipe is dominant
                        if (deltaX > deltaY && deltaX > 30) {
                          e.preventDefault();
                        }
                      }
                    }}
                    onTouchEnd={(e) => handleTouchEnd(e, message)}
                  >
                    {repliedMessage && (
                      <div
                        className={`mb-2 p-2 rounded border-l-4 ${
                          isOwnMessage
                            ? "bg-blue-400/30 border-blue-300"
                            : "bg-gray-100 dark:bg-gray-600 border-gray-400"
                        }`}
                      >
                        <div
                          className={`text-xs font-semibold mb-1 ${
                            isOwnMessage ? "text-blue-100" : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {repliedMessage.username}
                        </div>
                        <div
                          className={`text-xs ${
                            isOwnMessage
                              ? "text-blue-100"
                              : "text-gray-600 dark:text-gray-400"
                          } line-clamp-2`}
                        >
                          {repliedMessage.text}
                        </div>
                      </div>
                    )}
                    {!isOwnMessage && (
                      <div
                        className={`font-semibold text-sm mb-1 message-username ${
                          isOwnMessage
                            ? "text-blue-100"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {message.username}
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap break-words">
                      {message.text}
                    </div>
                    <div
                      className={`text-xs mt-1 message-timestamp flex items-center gap-2 ${
                        isOwnMessage
                          ? "text-blue-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <span>{formatTime(message.timestamp)}</span>
                    </div>

                    {/* Reaction Menu - Only show for other users' messages */}
                    {isReactionMenuOpen && !isOwnMessage && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-2 flex gap-1 z-10">
                        {EMOJI_REACTIONS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddReaction(message.id, emoji);
                            }}
                            className="text-2xl hover:scale-125 transition-transform p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            title={`React with ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                        <>
                          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReportClick(message);
                            }}
                            className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                            title="Report this message"
                          >
                            <Flag className="h-4 w-4" />
                          </button>
                        </>
                      </div>
                    )}

                    {/* Reaction Display - Only show for other users' messages, but allow viewing reactions on own messages */}
                    {hasReactions && (
                      <div className="mt-2 flex flex-wrap gap-1 message-reaction">
                        {Object.entries(messageReactions).map(([emoji, data]) => {
                          const isReacted = data.users.includes(deviceId || "");
                          return (
                            <button
                              key={emoji}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Only allow clicking reactions on other users' messages
                                if (!isOwnMessage) {
                                  handleAddReaction(message.id, emoji);
                                }
                              }}
                              className={`text-sm px-2 py-1 rounded-full transition-colors ${
                                isOwnMessage
                                  ? "cursor-default opacity-75" // Disable interaction for own messages
                                  : ""
                              } ${
                                isReacted
                                  ? "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                                  : "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500"
                              }`}
                              title={isOwnMessage ? "You cannot react to your own messages" : `React with ${emoji}`}
                            >
                              <span>{emoji}</span>
                              <span className="ml-1">{data.count}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Quick Action Button (shows on hover) */}
                  {!isOwnMessage && !isReactionMenuOpen && (
                    <div className="mt-1 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleReplyClick(message)}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => {
                          setShowReactions(message.id);
                        }}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
                      >
                        <Smile className="h-3 w-3" />
                        React
                      </button>
                      <button
                        onClick={() => handleReportClick(message)}
                        className="text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 flex items-center gap-1"
                      >
                        <Flag className="h-3 w-3" />
                        Report
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Replying to <span className="font-semibold">{replyingTo.username}</span>:
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500 truncate flex-1">
                {replyingTo.text}
              </div>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Report Dialog */}
      {showReportDialog && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Flag className="h-5 w-5 text-red-500" />
                Report Message
              </h2>
              <button
                onClick={() => {
                  setShowReportDialog(false);
                  setSelectedMessage(null);
                  setReportReason("");
                }}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Reported by: <span className="font-semibold">{selectedMessage.username}</span>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {selectedMessage.text}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for reporting
              </label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Please explain why you are reporting this message..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReportDialog(false);
                  setSelectedMessage(null);
                  setReportReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReport}
                disabled={!reportReason.trim() || isBanned}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Submit Report
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4 sticky bottom-0 max-w-7xl mx-auto w-full">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isBanned ? "You are banned from sending messages" : "Type your message... (Double-click or swipe a message to reply)"}
            className="flex-1 h-12 text-base"
            disabled={isBanned}
          />
          <Button
            onClick={handleSendMessage}
            className="px-6 h-12 bg-blue-500 hover:bg-blue-600 text-white"
            disabled={!newMessage.trim() || isBanned}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GroupChat;

