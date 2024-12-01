"use client";
import { Button } from "./ui/button";

export const ChatTest = () => {
  const sendPrompt = async () => {};
  return (
    <Button
      onClick={() => {
        sendPrompt();
      }}
    >
      chatTest
    </Button>
  );
};
