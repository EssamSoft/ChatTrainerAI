

import { useCSVStore } from '@/store/csvStore';
import { useState } from 'react';

export const useAI = () => {
  const { openAIKey, openAIModel, systemPrompt, maxTokens } = useCSVStore();
  const [isLoading, setIsLoading] = useState(false);

  const generateQuestion = async (intent: string): Promise<string> => {
    if (!openAIKey) {
      throw new Error('OpenAI API key not configured');
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: openAIModel,
          messages: [
            {
              role: 'system',
              content: `${systemPrompt} Generate a clear, concise question that fits the intent: ${intent}. The question should be practical and commonly asked.`
            },
            {
              role: 'user',
              content: `Generate a question with the intent: ${intent}`
            }
          ],
          max_tokens: maxTokens,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content?.trim() || 'Generated question not available';
      
    } finally {
      setIsLoading(false);
    }
  };

  const generateAnswer = async (question: string, intent: string): Promise<string> => {
    if (!openAIKey) {
      throw new Error('OpenAI API key not configured');
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: openAIModel,
          messages: [
            {
              role: 'system',
              content: `${systemPrompt} Provide a clear, accurate, and helpful answer to the question. The intent is: ${intent}.`
            },
            {
              role: 'user',
              content: `Question: ${question}\nIntent: ${intent}\n\nProvide a helpful answer:`
            }
          ],
          max_tokens: maxTokens,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content?.trim() || 'Generated answer not available';
      
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateQuestion,
    generateAnswer,
    isLoading
  };
};

