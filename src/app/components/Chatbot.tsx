import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Loader2, Sparkles } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion, AnimatePresence } from "framer-motion";

// Initialize Gemini API
// NOTE: Ideally this should be in a secure backend or use a proxy to hide the key, 
// but for this frontend-only demo, we'll use the environment variable directly.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "model"; text: string }[]>([
        { role: "model", text: "Hi there! I'm your QuickHelp assistant. How can I help you find a service today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (text?: string) => {
        const userMessage = text || input.trim();
        if (!userMessage) return;

        if (!text) setInput(""); // Only clear input if typing
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);

        try {
            if (!API_KEY) {
                throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
            }

            const genAI = new GoogleGenerativeAI(API_KEY);
            const modelsToTry = ["gemini-2.5-flash", "gemini-pro"];
            let responseText = "";
            let successfulModel = "";

            for (const modelName of modelsToTry) {
                try {
                    console.log(`Attempting to connect with model: ${modelName}`);
                    const model = genAI.getGenerativeModel({ model: modelName });

                    const SYSTEM_CONTEXT = `
You are the AI assistant for "QuickHelp", a platform for booking verified home service helpers (cleaners, plumbers, electricians).
- Services: Cleaning, Plumbing, Electrical, Moving, Painting.
- Pricing: Starts at $25/hour.
- Contact: support@quickhelp.com.
Answer nicely and briefly.
                    `;

                    const chat = model.startChat({
                        history: [
                            {
                                role: "user",
                                parts: [{ text: "System Instruction: " + SYSTEM_CONTEXT }]
                            },
                            {
                                role: "model",
                                parts: [{ text: "Understood. I am the QuickHelp AI assistant." }]
                            },
                            ...messages.map(m => ({
                                role: m.role,
                                parts: [{ text: m.text }]
                            }))
                        ],
                        generationConfig: {
                            maxOutputTokens: 250,
                        },
                    });

                    const result = await chat.sendMessage(userMessage);
                    const response = result.response;
                    responseText = response.text();
                    successfulModel = modelName;
                    break; // Success! Exit loop

                } catch (error: any) {
                    console.warn(`Failed with model ${modelName}:`, error.message);
                    // Check if it's a fatal error (like Auth) vs a text generation error (like 404/Overloaded)
                    if (modelName === modelsToTry[modelsToTry.length - 1]) {
                        // If this was the last model, throw the error to be caught below
                        throw error;
                    }
                    // Otherwise continue to next model
                }
            }

            setMessages((prev) => [...prev, { role: "model", text: responseText }]);

        } catch (error: any) {
            console.error("Chatbot Error Full Object:", error);

            // Default generic message
            let errorMessage = "I'm having trouble connecting. Not even my backup models worked.";

            // Specific handling for common errors
            if (error.message) {
                if (error.message.includes("API Key")) {
                    errorMessage = "Config Error: API Key missing or invalid. Please check .env and restart server.";
                } else if (error.message.includes("404")) {
                    errorMessage = "Model Error: None of the AI models are available for your API Key/Region.";
                } else if (error.message.includes("429")) {
                    errorMessage = "Traffic Limit: Too many requests. Please wait a moment.";
                } else {
                    errorMessage = `Error: ${error.message}`;
                }
            }

            setMessages((prev) => [...prev, { role: "model", text: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? "bg-destructive rotate-90" : "bg-primary"
                    } text-white`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-[380px] h-[500px] max-h-[80vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 flex items-center gap-3 text-primary-foreground">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    QuickHelp AI <Sparkles className="w-3 h-3 text-yellow-300" />
                                </h3>
                                <p className="text-xs opacity-90">Usually replies instantly</p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-background border border-border text-foreground rounded-tl-none shadow-sm"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-background border border-border p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        <span className="text-xs text-muted-foreground">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested Questions */}
                        {messages.length === 1 && (
                            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
                                {["How do I book?", "What services?", "Is it safe?", "Pricing?"].map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => handleSend(q)}
                                        className="whitespace-nowrap px-3 py-1.5 bg-secondary/50 hover:bg-secondary text-secondary-foreground text-xs rounded-full transition-colors border border-border"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-4 bg-card border-t border-border">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ask about services..."
                                    className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={isLoading || !input.trim()}
                                    className="p-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
