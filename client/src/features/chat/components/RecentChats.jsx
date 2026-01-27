import React from 'react';

export const RecentChats = () => {
  const chats = [
    { id: 1, name: 'Alice', lastMessage: 'Hey, are we still on?', time: '10:30 AM', unread: 2 },
    { id: 2, name: 'Bob', lastMessage: 'See you tomorrow!', time: 'Yesterday', unread: 0 },
    { id: 3, name: 'Charlie', lastMessage: 'Thanks for the help.', time: 'Mon', unread: 0 },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Recent Chats</h3>
      <div className="flex flex-col gap-2">
        {chats.map((chat) => (
          <div 
            key={chat.id} 
            className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{chat.name}</div>
              <div className="text-sm text-muted-foreground">{chat.lastMessage}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
               <span className="text-xs text-muted-foreground">{chat.time}</span>
               {chat.unread > 0 && (
                 <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                   {chat.unread}
                 </span>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
