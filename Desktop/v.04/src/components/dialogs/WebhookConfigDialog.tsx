import React, { useState } from 'react';
import { Copy, Eye, EyeOff, ExternalLink, Info, ChevronDown, ChevronRight } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { GmailWebhookDialog } from './GmailWebhookDialog';

interface WebhookConfigDialogProps {
  children: React.ReactNode;
  provider: string;
  onSave?: (config: WebhookConfig) => void;
}

interface WebhookConfig {
  webhookUrl: string;
  signingSecret: string;
  provider: string;
}

export const WebhookConfigDialog: React.FC<WebhookConfigDialogProps> = ({
  children,
  provider,
  onSave
}) => {
  // If provider is Gmail, use the specialized Gmail dialog
  if (provider === 'gmail') {
    return (
      <GmailWebhookDialog onSave={onSave}>
        {children}
      </GmailWebhookDialog>
    );
  }

  const [open, setOpen] = useState(false);
  const [showSigningSecret, setShowSigningSecret] = useState(false);
  const [showPayloadExample, setShowPayloadExample] = useState(false);
  const [config, setConfig] = useState<WebhookConfig>({
    webhookUrl: 'https://www.setn.ai/api/webhooks/trigger/7a690a5',
    signingSecret: '',
    provider
  });

  const handleSave = () => {
    onSave?.(config);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getProviderIcon = () => {
    switch (provider.toLowerCase()) {
      case 'slack':
        return '🟢'; // Slack green dot
      case 'discord':
        return '🟣'; // Discord purple
      case 'github':
        return '⚫'; // GitHub black
      case 'stripe':
        return '🟦'; // Stripe blue
      case 'airtable':
        return '🟨'; // Airtable yellow
      case 'telegram':
        return '🔵'; // Telegram blue
      default:
        return '🔗'; // Generic webhook
    }
  };

  const getProviderInstructions = () => {
    switch (provider.toLowerCase()) {
      case 'slack':
        return {
          appPage: 'Slack Apps page',
          appPageUrl: 'https://api.slack.com/apps',
          steps: [
            'If you don\'t have an app:',
            '• Create an app from scratch',
            '• Give it a name and select your workspace',
            'Go to "Basic Information", find the "Signing Secret", and paste it in the field above.',
            'Go to "OAuth & Permissions" and add bot token scopes:',
            '• app_mentions:read - For viewing messages that tag your bot with an @',
            '• chat:write - To send messages to channels your bot is a part of',
            'Go to "Event Subscriptions":',
            '• Enable events',
            '• Under "Subscribe to Bot Events", add app_mention to listen to messages that mention your bot',
            '• Paste the Webhook URL (from above) into the "Request URL" field',
            'Save changes in both Slack and here.'
          ]
        };
      case 'discord':
        return {
          appPage: 'Discord Developer Portal',
          appPageUrl: 'https://discord.com/developers/applications',
          steps: [
            'Create a new application or select an existing one',
            'Go to "Bot" section and create a bot if you haven\'t already',
            'Copy the bot token and use it as the signing secret',
            'Go to "OAuth2" > "URL Generator"',
            'Select "bot" scope and required permissions',
            'Use the generated URL to invite the bot to your server',
            'Configure webhook URL in your Discord bot code'
          ]
        };
      case 'github':
        return {
          appPage: 'GitHub Apps page',
          appPageUrl: 'https://github.com/settings/apps',
          steps: [
            'Create a new GitHub App or select an existing one',
            'Set the webhook URL to the URL provided above',
            'Generate and copy the webhook secret',
            'Paste the webhook secret in the signing secret field',
            'Configure the events you want to receive',
            'Install the app on your repositories'
          ]
        };
      case 'stripe':
        return {
          appPage: 'Stripe Dashboard',
          appPageUrl: 'https://dashboard.stripe.com/webhooks',
          steps: [
            'Go to Developers > Webhooks in your Stripe dashboard',
            'Click "Add endpoint"',
            'Set the endpoint URL to the webhook URL above',
            'Select the events you want to listen for',
            'Copy the signing secret from the webhook details',
            'Paste it in the signing secret field above'
          ]
        };
      case 'airtable':
        return {
          appPage: 'Airtable Developer Hub',
          appPageUrl: 'https://airtable.com/developers/web/api/introduction',
          steps: [
            'Create an Airtable account and set up your base',
            'Go to Airtable Developer Hub',
            'Create a new app or use an existing one',
            'Configure webhook endpoints for your base',
            'Set the webhook URL to the URL provided above',
            'Copy the webhook secret and paste it in the signing secret field'
          ]
        };
      case 'telegram':
        return {
          appPage: 'Telegram Bot API',
          appPageUrl: 'https://core.telegram.org/bots#creating-a-new-bot',
          steps: [
            'Message @BotFather on Telegram to create a new bot',
            'Follow the instructions to get your bot token',
            'Use the bot token as the signing secret',
            'Set up a webhook using the Telegram Bot API',
            'Use the webhook URL provided above',
            'Configure your bot to receive updates via webhook'
          ]
        };
      default:
        return {
          appPage: 'Your service dashboard',
          appPageUrl: '#',
          steps: [
            'Configure your webhook endpoint with the URL above',
            'Set up any required authentication or signing secrets',
            'Test the webhook to ensure it\'s working correctly'
          ]
        };
    }
  };

  const instructions = getProviderInstructions();

  const payloadExample = {
    slack: `{
  "type": "event_callback",
  "event": {
    "type": "app_mention",
    "user": "U0123456789",
    "text": "<@U9876543210> Hello there!",
    "ts": "1234567890.123456",
    "channel": "C0123456789",
    "event_ts": "1234567890.123456"
  },
  "team_id": "T0123456789",
  "event_id": "Ev0123456789",
  "event_time": 1234567890
}`,
    discord: `{
  "type": 0,
  "content": "Hello Discord!",
  "author": {
    "id": "123456789012345678",
    "username": "user123",
    "discriminator": "1234"
  },
  "channel_id": "123456789012345678",
  "guild_id": "123456789012345678",
  "timestamp": "2023-01-01T12:00:00.000Z"
}`,
    github: `{
  "action": "opened",
  "pull_request": {
    "id": 123456789,
    "title": "Update README",
    "user": {
      "login": "octocat",
      "id": 1
    },
    "body": "This is a pull request"
  },
  "repository": {
    "name": "Hello-World",
    "full_name": "octocat/Hello-World"
  }
}`,
    stripe: `{
  "id": "evt_1234567890",
  "object": "event",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_1234567890",
      "amount": 2000,
      "currency": "usd",
      "status": "succeeded"
    }
  },
  "created": 1234567890
}`,
    airtable: `{
  "base": {
    "id": "appXXXXXXXXXXXXXX"
  },
  "webhook": {
    "id": "achXXXXXXXXXXXXXX"
  },
  "timestamp": "2023-01-01T12:00:00.000Z",
  "payloads": [
    {
      "actionMetadata": {
        "source": "client",
        "sourceMetadata": {
          "user": {
            "id": "usrXXXXXXXXXXXXXX",
            "email": "user@example.com"
          }
        }
      },
      "changedTablesById": {
        "tblXXXXXXXXXXXXXX": {
          "createdRecordsById": {
            "recXXXXXXXXXXXXXX": {
              "createdTime": "2023-01-01T12:00:00.000Z",
              "fields": {
                "Name": "New Record"
              }
            }
          }
        }
      }
    }
  ]
}`,
    telegram: `{
  "update_id": 123456789,
  "message": {
    "message_id": 123,
    "from": {
      "id": 123456789,
      "is_bot": false,
      "first_name": "John",
      "username": "john_doe"
    },
    "chat": {
      "id": 123456789,
      "first_name": "John",
      "username": "john_doe",
      "type": "private"
    },
    "date": 1234567890,
    "text": "Hello Bot!"
  }
}`
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent size="xl" className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <span className="mr-2 text-lg">{getProviderIcon()}</span>
            Configure {provider.charAt(0).toUpperCase() + provider.slice(1)} Webhook
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Webhook URL Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-900">
                Webhook URL
              </label>
              <Tooltip content="This is the URL that your service will send webhook events to">
                <Info className="h-4 w-4 text-gray-400" />
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={config.webhookUrl}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm font-mono text-gray-700 pr-10"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(config.webhookUrl)}
                className="px-3"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Signing Secret Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-900">
                Signing Secret
              </label>
              <Tooltip content="The secret key used to verify webhook authenticity">
                <Info className="h-4 w-4 text-gray-400" />
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type={showSigningSecret ? 'text' : 'password'}
                  value={config.signingSecret}
                  onChange={(e) => setConfig(prev => ({ ...prev, signingSecret: e.target.value }))}
                  placeholder={`Enter your ${provider} app signing secret`}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSigningSecret(!showSigningSecret)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSigningSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(config.signingSecret)}
                className="px-3"
                disabled={!config.signingSecret}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Setup Instructions</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">1</span>
                <span className="text-sm text-gray-700">
                  Go to{' '}
                  <a 
                    href={instructions.appPageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline inline-flex items-center"
                  >
                    {instructions.appPage}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </span>
              </div>

              {instructions.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mt-0.5">
                    {index + 2}
                  </span>
                  <div className="flex-1">
                    {step.includes('•') ? (
                      <div className="space-y-1">
                        {step.split('\n').map((line, lineIndex) => (
                          <div key={lineIndex} className="text-sm text-gray-700">
                            {line.startsWith('•') ? (
                              <div className="flex items-start space-x-2 ml-4">
                                <span className="text-gray-400 mt-1">•</span>
                                <span>{line.substring(2)}</span>
                              </div>
                            ) : (
                              <div className={line.trim() ? '' : 'hidden'}>{line}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-700">{step}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payload Example */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <button
              onClick={() => setShowPayloadExample(!showPayloadExample)}
              className="flex items-center space-x-2 text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors"
            >
              <span className="mr-2 text-lg">{getProviderIcon()}</span>
              <span>{provider.charAt(0).toUpperCase() + provider.slice(1)} Event Payload Example</span>
              {showPayloadExample ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
            
            {showPayloadExample && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Your workflow will receive a payload similar to this when a subscribed event occurs:
                </p>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                    {payloadExample[provider.toLowerCase() as keyof typeof payloadExample] || payloadExample.slack}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!config.signingSecret.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};