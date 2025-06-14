
import React, { useState, useCallback } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CSVRow } from '@/types/csv';
import { EditableCell } from './EditableCell';
import { IntentSelect } from './IntentSelect';
import { useAI } from '@/hooks/useAI';
import { toast } from '@/hooks/use-toast';

interface TableRowProps {
  row: CSVRow;
  index: number;
  onUpdate: (index: number, field: keyof CSVRow, value: string | number) => void;
  onContextMenu: (e: React.MouseEvent, index: number) => void;
}

export const TableRow = ({ row, index, onUpdate, onContextMenu }: TableRowProps) => {
  const [questionFocused, setQuestionFocused] = useState(false);
  const [answerFocused, setAnswerFocused] = useState(false);
  const { generateQuestion, generateAnswer, isLoading } = useAI();

  const handleGenerateQuestion = useCallback(async () => {
    try {
      const question = await generateQuestion(row.intent);
      onUpdate(index, 'question', question);
      toast({
        title: "Question generated",
        description: "AI has generated a new question for you.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate question. Please check your OpenAI settings.",
        variant: "destructive"
      });
    }
  }, [row.intent, generateQuestion, onUpdate, index]);

  const handleGenerateAnswer = useCallback(async () => {
    if (!row.question.trim()) {
      toast({
        title: "Question required",
        description: "Please enter a question first to generate an answer.",
        variant: "destructive"
      });
      return;
    }

    try {
      const answer = await generateAnswer(row.question, row.intent);
      onUpdate(index, 'answer', answer);
      toast({
        title: "Answer generated",
        description: "AI has generated an answer based on your question.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate answer. Please check your OpenAI settings.",
        variant: "destructive"
      });
    }
  }, [row.question, row.intent, generateAnswer, onUpdate, index]);

  return (
    <tr 
      className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group"
      onContextMenu={(e) => onContextMenu(e, index)}
    >
      {/* ID Column */}
      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-center w-12 h-8 bg-gray-100 dark:bg-slate-700 rounded text-xs font-semibold">
          {row.id}
        </div>
      </td>

      {/* Question Column */}
      <td className="px-4 py-3 relative">
        <div className="relative">
          <EditableCell
            value={row.question}
            onChange={(value) => onUpdate(index, 'question', value)}
            placeholder="Enter question or click AI generate..."
            multiline
            onFocus={() => setQuestionFocused(true)}
            onBlur={() => setQuestionFocused(false)}
          />
          
          {(questionFocused || row.question === '') && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleGenerateQuestion}
              disabled={isLoading}
              className="absolute right-2 top-2 h-6 w-6 p-0 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
            </Button>
          )}
        </div>
      </td>

      {/* Answer Column */}
      <td className="px-4 py-3 relative">
        <div className="relative">
          <EditableCell
            value={row.answer}
            onChange={(value) => onUpdate(index, 'answer', value)}
            placeholder="Enter answer or click AI generate..."
            multiline
            onFocus={() => setAnswerFocused(true)}
            onBlur={() => setAnswerFocused(false)}
          />
          
          {(answerFocused || row.answer === '') && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleGenerateAnswer}
              disabled={isLoading || !row.question.trim()}
              className="absolute right-2 top-2 h-6 w-6 p-0 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
            </Button>
          )}
        </div>
      </td>

      {/* Intent Column */}
      <td className="px-4 py-3">
        <IntentSelect
          value={row.intent}
          onChange={(value) => onUpdate(index, 'intent', value)}
        />
      </td>
    </tr>
  );
};
