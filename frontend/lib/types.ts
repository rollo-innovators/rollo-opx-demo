type Message = {
    content: string;
    role: string;
    image?: string;
    intermediate_steps?: any[];
}

export default Message;