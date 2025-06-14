
import React, { useState } from 'react';
import { Settings, Key, Palette, TestTube, Tag, Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCSVStore } from '@/store/csvStore';
import { toast } from '@/hooks/use-toast';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({
  open,
  onOpenChange
}: SettingsDialogProps) => {
  const {
    openAIKey,
    openAIModel,
    systemPrompt,
    maxTokens,
    theme,
    intentOptions,
    setOpenAIKey,
    setOpenAIModel,
    setSystemPrompt,
    setMaxTokens,
    toggleTheme,
    setIntentOptions,
    addIntentOption,
    removeIntentOption
  } = useCSVStore();

  const [tempKey, setTempKey] = useState(openAIKey);
  const [tempPrompt, setTempPrompt] = useState(systemPrompt);
  const [tempMaxTokens, setTempMaxTokens] = useState(maxTokens);
  const [tempIntentOptions, setTempIntentOptions] = useState(intentOptions);
  const [newIntent, setNewIntent] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);

  const handleSaveAllSettings = () => {
    // Validate max tokens
    if (tempMaxTokens < 1 || tempMaxTokens > 4000) {
      toast({
        title: "Invalid max tokens",
        description: "Max tokens must be between 1 and 4000.",
        variant: "destructive"
      });
      return;
    }

    // Save all settings
    setOpenAIKey(tempKey);
    setSystemPrompt(tempPrompt);
    setMaxTokens(tempMaxTokens);
    setIntentOptions(tempIntentOptions);
    
    toast({
      title: "Settings saved",
      description: "All settings have been saved successfully."
    });
  };

  const handleAddIntent = () => {
    if (newIntent.trim() && !tempIntentOptions.includes(newIntent.trim())) {
      setTempIntentOptions([...tempIntentOptions, newIntent.trim()]);
      setNewIntent('');
    }
  };

  const handleRemoveIntent = (intent: string) => {
    setTempIntentOptions(tempIntentOptions.filter(option => option !== intent));
  };

  const handleTestKey = async () => {
    if (!tempKey.trim()) {
      toast({
        title: "API Key required",
        description: "Please enter your OpenAI API key first.",
        variant: "destructive"
      });
      return;
    }

    setIsTestingKey(true);
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${tempKey}`
        }
      });

      if (response.ok) {
        toast({
          title: "Connection successful",
          description: "Your OpenAI API key is working correctly."
        });
      } else {
        throw new Error('Invalid API key');
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Invalid API key or connection error.",
        variant: "destructive"
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai" className="gap-2">
              <Key className="w-4 h-4" />
              AI Settings
            </TabsTrigger>
            <TabsTrigger value="intents" className="gap-2">
              <Tag className="w-4 h-4" />
              Intents
            </TabsTrigger>
            <TabsTrigger value="theme" className="gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">OpenAI API Key</Label>
              <div className="relative">
                <input
                  id="api-key"
                  type={showKey ? "text" : "password"}
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  className="w-full px-3 py-2 pr-20 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
                  placeholder="sk-..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
                >
                  {showKey ? 'Hide' : 'Show'}
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={openAIModel} onValueChange={setOpenAIModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini-2024-07-18">gpt-4o-mini</SelectItem>
                  <SelectItem value="text-embedding-ada-002">text-embedding-ada-002</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-tokens">Max Tokens</Label>
              <Input
                id="max-tokens"
                type="number"
                min="1"
                max="4000"
                value={tempMaxTokens}
                onChange={(e) => setTempMaxTokens(Number(e.target.value))}
                placeholder="150"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Maximum number of tokens for AI responses (1-4000).
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="system-prompt">AI System Prompt</Label>
              <Textarea
                id="system-prompt"
                value={tempPrompt}
                onChange={(e) => setTempPrompt(e.target.value)}
                placeholder="Enter your custom system prompt for AI generation..."
                className="min-h-[100px]"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This prompt will be used to guide AI generation for questions and answers.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleTestKey}
                disabled={isTestingKey || !tempKey.trim()}
                className="gap-2"
              >
                <TestTube className="w-4 h-4" />
                {isTestingKey ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="intents" className="space-y-4">
            <div className="space-y-2">
              <Label>Intent Options</Label>
              <div className="flex gap-2">
                <Input
                  value={newIntent}
                  onChange={(e) => setNewIntent(e.target.value)}
                  placeholder="Enter new intent..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddIntent()}
                />
                <Button
                  onClick={handleAddIntent}
                  disabled={!newIntent.trim() || tempIntentOptions.includes(newIntent.trim())}
                  size="sm"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Current Intents</Label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {tempIntentOptions.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No intents added yet</p>
                ) : (
                  tempIntentOptions.map((intent) => (
                    <div key={intent} className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 px-3 py-2 rounded-md">
                      <span className="text-sm">{intent}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveIntent(intent)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Default intent is empty. You can add custom intents here and they will be available in the dropdown when editing rows.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="theme" className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => theme !== 'light' && toggleTheme()}
                  className="flex-1"
                >
                  ☀️ Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => theme !== 'dark' && toggleTheme()}
                  className="flex-1"
                >
                  🌙 Dark
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Theme preference is automatically saved and will be remembered for future sessions.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSaveAllSettings} className="gap-2">
            Save All Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
