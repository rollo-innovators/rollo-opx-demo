import { Download, File } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import Message from '@/lib/types';
import Image from 'next/image';

const tpActions = [
    'create_sap_ticket',
    'schedule_maintenance'
];

const BotMessage: React.FC<{ message: Message }> = ({ message }) => {
    const [displayedMessage, setDisplayedMessage] = useState('');
    const [showToolCalled, setShowToolCalled] = useState(false);
    const [showToolOutput, setShowToolOutput] = useState(false);
    const [displayedFinalMessage, setDisplayedFinalMessage] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        const hasIntermediateSteps = message.intermediate_steps && message.intermediate_steps.length > 0;
        const firstMessage = hasIntermediateSteps 
            ? message.intermediate_steps[0].message_log?.[0]?.content || message.content
            : message.content;
        const toolOutput = hasIntermediateSteps ? message.intermediate_steps : [];
        const finalContent = hasIntermediateSteps ? message.content : '';

        const displayMessages = async () => {
            for (let i = 0; i < firstMessage.length; i++) {
                setDisplayedMessage(firstMessage.substring(0, i + 1));
                await new Promise((resolve) => setTimeout(resolve, 20));
            }
            if (toolOutput.length > 0) {
                setShowToolCalled(true);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            for (let i = 0; i < finalContent.length; i++) {
                setDisplayedFinalMessage(finalContent.substring(0, i + 1));
                await new Promise((resolve) => setTimeout(resolve, 20));
            }
        };

        displayMessages();
    }, [message]);

    const flattenObject = (obj: any) => {
        const flattened: any = {};

        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                Object.assign(flattened, flattenObject(obj[key]));
            } else {
                flattened[key] = obj[key];
            }
        });

        return flattened;
    }

    const downloadFile = () => {
        // ... (downloadFile function remains unchanged)
    }

    return (
        <div className="flex flex-col w-full">
            <Image src={'/manny.png'} width={100} height={100} alt="user image" className="rounded-full" />
            <div className="bg-gray-100 p-2 rounded-lg mb-2">
                <ReactMarkdown>{displayedMessage}</ReactMarkdown>
            </div>
            {showToolCalled && message.intermediate_steps?.map((step, index) => (
                <div key={index} className="bg-orange-300 p-2 rounded-lg mb-2 fade-in space-x-2">
                    <h1 className='text-lg font-bold text-gray-800'>{step.tool}</h1>
                    {showToolOutput && step.message_log && step.message_log[0] && (
                        <ReactMarkdown>{step.message_log[0].content}</ReactMarkdown>
                    )}
                    {showToolOutput && (
                        <ReactMarkdown>{typeof(step.result) === 'string' ? step.result : JSON.stringify(flattenObject(step.result), null, 2)}</ReactMarkdown>
                    )}
                    <div className="flex flex-row space-x-2">
                        <Button className="bg-blue-500 text-white rounded-l-none rounded-md px-2 py-1 mt-2" onClick={() => downloadFile()}>
                            <File size={16} className="text-white" /> <Download size={16} className="text-white" />
                        </Button>
                        {tpActions.includes(step.tool) && (
                            <>
                                <Button className='bg-green-500 text-white px-2 py-1 rounded-lg mt-2' onClick={() => toast({
                                    title: "Success",
                                    description: "Action completed successfully",
                                })}>
                                    Confirm
                                </Button>
                                <Button className='bg-red-500 text-white px-2 py-1 rounded-lg mt-2' onClick={() => toast({
                                    title: "Cancelled",
                                    description: "Action cancelled",
                                })}>
                                    Cancel
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            ))}
            {displayedFinalMessage && (
                <div className="bg-gray-100 p-2 rounded-lg">
                    <ReactMarkdown>{displayedFinalMessage}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default BotMessage;