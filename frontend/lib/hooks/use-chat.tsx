import Message from "@/lib/types";

const useChat = () => {
    const sendMessage = async (message: Message, history: Message[]) => {
        message.content = "My name is John Doe, " + message.content
        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/chat/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    message,
                    history,
                }),
            });

            const data = await response.json();
            console.log("Response data", data);

            return {
                intermediate_steps: data.intermediate_steps,
                content: data.output,
                role: "assistant",
            };
        } catch (error) {
            console.error(error);
            return {
                content: "There was an error sending your message.",
                role: "assistant",
            };
        }
    };

    return { sendMessage };
};

export { useChat };