import AgriChat from '@/components/agrichat-chatbot';
import Header from '@/components/header';

export default function AgriChatPage() {
  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-hidden">
        <AgriChat />
      </div>
    </main>
  );
}