import { Download, File } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import Message from '@/lib/types';

const tpActions = [
    'create_sap_ticket',
    'schedule_maintenance'
]

const BotMessage: React.FC<{ message: Message }> = ({ message }) => {
    const [displayedMessage, setDisplayedMessage] = useState('');
    const [showToolCalled, setShowToolCalled] = useState(false);
    const [showToolOutput, setShowToolOutput] = useState(false);
    const [displayedFinalMessage, setDisplayedFinalMessage] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        const firstMessage = message.intermediate_steps?.[0].message_log?.[0]?.content || message.content;
        const toolOutput = message.intermediate_steps || [];
        const finalContent = message.intermediate_steps?.[0]?.message_log?.[0]?.content ? message.content : '';

        const displayMessages = async () => {
            for (let i = 0; i < firstMessage.length; i++) {
                setDisplayedMessage(firstMessage.substring(0, i + 1));
                await new Promise((resolve) => setTimeout(resolve, 20));
            }
            if (toolOutput.length > 0 && message.intermediate_steps?.[0]?.message_log) {
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
        const content = `### Pump Model: P-102

#### Table of Contents
1. Introduction
2. Safety Precautions
3. Installation Instructions
4. Operation Guidelines
5. Maintenance Schedule
6. Troubleshooting
7. Contact Information

---

#### 1. Introduction
The P-102 Pump is designed for efficient fluid transfer in industrial settings. This manual provides essential information for safe and efficient operation.

#### 2. Safety Precautions
- Always disconnect power before servicing.
- Wear appropriate PPE (Personal Protective Equipment).
- Ensure the pump is properly grounded.
- Follow all local safety regulations.

#### 3. Installation Instructions
- Position the pump on a stable, level surface.
- Connect the inlet and outlet pipes securely.
- Verify all connections are leak-free.
- Ensure the power supply matches the pump's specifications.

#### 4. Operation Guidelines
- Check all connections and fittings before starting.
- Start the pump and monitor for any unusual noises or vibrations.
- Maintain proper pressure and flow rates as specified.
- Do not operate the pump dry.

#### 5. Maintenance Schedule
- **Daily:** Check for leaks and unusual noises.
- **Weekly:** Inspect the pump seals and bearings.
- **Monthly:** Perform a pressure test and check the impeller for wear.
- **Annually:** Conduct a full inspection and overhaul if necessary.

#### 6. Troubleshooting
- **Pump Not Starting:** Check power supply and connections.
- **Low Pressure:** Inspect for leaks and check the impeller.
- **Unusual Noises:** Check bearings and seals.
- **Leaks:** Inspect seals and connections.

#### 7. Contact Information
For further assistance, contact our support team:
- Phone: 1-800-555-1234
- Email: support@pumpexample.com
- Address: 123 Pump Street, Industrial City, IN 12345`
        const element = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'documentation-pump-p102.txt';
        document.body.appendChild(element);
        element.click();
    }
    return (
        <div className="flex flex-col w-full">
            <div className="bg-gray-100 p-2 rounded-lg mb-2">
                <ReactMarkdown>{displayedMessage}</ReactMarkdown>
            </div>
            {showToolCalled && message.intermediate_steps?.map((step, index) => (
                <div key={index} className="bg-orange-300 p-2 rounded-lg mb-2 fade-in space-x-2">
                    <h1 className='text-lg font-bold text-gray-800'>{step.tool}</h1>
                    {showToolOutput && <ReactMarkdown>{step.message_log[0].content}</ReactMarkdown>}
                    {showToolOutput && <ReactMarkdown>{typeof(step.result) === 'string' ? step.result : JSON.stringify(flattenObject(step.result), null, 2)}</ReactMarkdown>}
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