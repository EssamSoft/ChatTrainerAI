
import React, { useState } from 'react';
import { Settings, Key, Palette, TestTube } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCSVStore } from '@/store/csvStore';
import { toast } from '@/hooks/use-toast';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { openAIKey, openAIModel, theme, setOpenAIKey, setOpenAIModel, toggleTheme } = useCSVStore();
  const [tempKey, setTempKey] = useState(openAIKey);
  const [showKey, setShowKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);

  const handleSaveKey = () => {
    setOpenAIKey(tempKey);
    toast({
      title: "API Key saved",
      description: "Your OpenAI API key has been saved securely.",
    });
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
          'Authorization': `Bearer ${tempKey}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Connection successful",
          description: "Your OpenAI API key is working correctly.",
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai" className="gap-2">
              <Key className="w-4 h-4" />
              AI Settings
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
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</SelectItem>
                  <SelectItem value="gpt-4">GPT-4 (More Accurate)</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Best)</SelectItem>
                </SelectContent>
              </Select>
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
              <Button onClick={handleSaveKey} disabled={!tempKey.trim()}>
                Save API Key
              </Button>
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
      </DialogContent>
    </Dialog>
  );
};
