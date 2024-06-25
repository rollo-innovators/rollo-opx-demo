"use client"
import BotMessage from "@/components/bot-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Skeleton from "@/components/ui/skeleton";
import { useChat } from "@/lib/hooks/use-chat";
import Message from "@/lib/types";
import { Camera, Mic, Send } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
export default function Home() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [image, setImage] = useState<string | null>(null);
    const { sendMessage } = useChat();
    const fileInputRef = useRef<HTMLInputElement>(null);
    // const whisper = new Whisper(process.env.NEXT_PUBLIC_OPENAI_API_KEY!);

    const handleSubmit = async () => {
        const tempHistory = [...messages];
        const tempInput = input;
        setInput("");
        setMessages(prevMessages => [...prevMessages, { content: tempInput, role: "user", image: image ? image : undefined }]);
        const result = await sendMessage({
            content: tempInput,
            image: image ? image : undefined,
            role: "user",
        }, tempHistory);
        setMessages(prevMessages => [...prevMessages, result]);
    };

    const handleImageCapture = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <main className="flex min-h-screen max-w-[400px] flex-col items-center py-12 mx-auto">
            <div className="flex flex-col items-center">
                <h1>John Doe</h1>
            </div>
            <div className="h-screen w-screen">
                <div className="flex flex-col justify-center items-end h-full">
                    <div className="flex flex-col w-full h-5/6 bg-white p-4 rounded-lg m-2 overflow-y-auto space-y-5 md:w-6/12 mx-auto">
                        {messages.map((message, index) => (
                            message.role === "user" ? (
                                <div key={index} className="flex flex-row justify-end w-full">
                                    {message.image && (
                                        <Image src={message.image} 
                                            alt="user image"
                                            width={100}
                                            height={100}
                                        />
                                    )}
                                    <div className="bg-blue-100 p-2 rounded-lg ml-2">
                                        {message.content}
                                    </div>
                                    </div>

                            ) : (
                                <BotMessage key={index} message={message} />
                            )
                        ))}
                        {messages.length > 0 && messages[messages.length - 1].role === "user" && <Skeleton/>}
                        
                    </div>
                    <div className="flex flex-row md:w-6/12 mx-auto h-1/6 justify-center">
                        <Input
                            value={input}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleSubmit();
                                }
                            }}
                            onChange={(e) => setInput(e.target.value)}
                            type="text"
                            className="bg-gray-100 w-10/12 rounded-r-none outline-none ring-0 ring-offset-0"
                        />
                        <Button className={"bg-orange-400 cursor-pointer p-2 text-center rounded-r-none rounded-l-none"} onClick={handleImageCapture}>
                            <Mic size={24} className="text-white" />
                        </Button>
                        <Button
                            className={"bg-orange-400 cursor-pointer p-2 text-center rounded-r-none rounded-l-none"}
                            onClick={handleImageCapture}
                        >
                            <Camera
                                size={24}
                                className="text-white"
                            />
                        </Button>
                        <input 
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white p-2 rounded-l-none"
                        >
                            <Send size={24} />
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}