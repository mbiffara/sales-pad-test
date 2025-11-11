const randomSentences = [
  'Thanks for the update — I will follow up shortly.',
  'Great question! Let me gather a few details and circle back.',
  'Appreciate your patience; I have everything I need to proceed.',
  'I just reviewed your message and will send over the next steps soon.',
  'Sounds good to me! I will keep you posted on the progress.',
];

const randomAdjectives = ['thoughtful', 'helpful', 'actionable', 'clear', 'concise'];

export const generateResponse = (messages: string[]): string => {
  const base = randomSentences[Math.floor(Math.random() * randomSentences.length)];
  if (messages.length === 0) {
    return base;
  }

  const lastMessage = messages[messages.length - 1];
  const adjective = randomAdjectives[Math.floor(Math.random() * randomAdjectives.length)];

  return `${base} Your ${adjective} note ("${truncate(lastMessage)}") was especially useful.`;
};

const truncate = (value: string, length = 80): string => {
  if (value.length <= length) {
    return value;
  }
  return `${value.slice(0, length)}…`;
};
