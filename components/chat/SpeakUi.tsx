"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { deleteChat } from "@/lib/actions/chat.action";

import { useState } from "react";

type Chats = { role: string; content: string }[];

const SpeakUi = ({ user }: { user: string }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<Chats>([]);
 
  const startVoiceRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US"; // Correct language code
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setIsListening(true);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      handleSendMessage(transcript, "");
      recognition.stop();
    };
    recognition.onerror = (event: any) => {
      console.error("Recognition error:", event.error);
      setIsListening(false);
    };
    recognition.onend = () => {
      toast({
        title: "Message Sent Successfully ",
      });
      setIsListening(false);
    };
    recognition.start();
  };

  const handleSendMessage = async (userMessage: string, botMessage: string) => {
    try {
      const response = await fetch("/api/perplex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage, user }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      setMessage("");

      const data = await response.json();
      const assistantResponse = data.choices[0]?.message?.content;
      speakResponse(assistantResponse);

      setChats((prevMessages) => [
        ...prevMessages,
        { role: "user", content: userMessage },
        { role: "assistant", content: assistantResponse },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const speakResponse = (response: string) => {
    setIsSpeaking(true);

    const speech = new SpeechSynthesisUtterance();
    // setVoices(speechSynthesis.getVoices());
    speech.lang = "en-US"; // Updated to use correct language code
    speech.text = response;
    speech.voice = speechSynthesis.getVoices()[2];
    speech.rate = 1;

    speechSynthesis.speak(speech);

    // Store the SpeechSynthesisUtterance object in a state variable

    speech.onend = () => {
      setIsSpeaking(false);
      startVoiceRecognition();
    };
  };
  const stopSpeaking = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };
  

  return (
    <>
      <div
        className={`h1-bold text-dark100_light900 flex h-52 w-52  ${
          isSpeaking ? "animate-spin" : ""
        }   cursor-pointer items-center justify-center rounded-full  border-2 shadow-xl  transition-all hover:scale-105 dark:shadow-dark-200`}
        onClick={() => startVoiceRecognition()}
      >
        Speak
      </div>
      {isListening && (
        <p className="h3-bold mt-5 animate-pulse text-green-400 ">
          Ai is Listing
        </p>
      )}

      <div className="p-5  ">
        <Button
          className="dark-gradient  mr-5 border-2 border-red-400  text-red-400"
          onClick={() => stopSpeaking()}
        >
          Shut Up
        </Button>
        <Button className="dark-gradient  ml-5 border-2 border-green-400 text-green-400 ">
          Speak
        </Button>
        <Button className="dark-gradient  ml-5 border-2 border-green-400 text-green-400"
        onClick={() => deleteChat({user})}
        >
          New Conversation
        </Button>
      </div>
    </>
  );
};

export default SpeakUi;
