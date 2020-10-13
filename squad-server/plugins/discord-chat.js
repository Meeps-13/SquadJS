import DiscordBasePlugin from './discord-base-plugin.js';

import { COPYRIGHT_MESSAGE } from '../utils/constants.js';

export default class DiscordChat extends DiscordBasePlugin {
  static get description() {
    return 'The <code>DiscordChat</code> plugin will log in-game chat to a Discord channel.';
  }

  static get defaultEnabled() {
    return true;
  }

  static get optionsSpecification() {
    return {
      ...DiscordBasePlugin.optionsSpecification,
      channelID: {
        required: true,
        description: 'The ID of the channel to log admin broadcasts to.',
        default: '',
        example: '667741905228136459'
      },
      chatColors: {
        required: false,
        description: 'The color of the embed for each chat.',
        default: {},
        example: { ChatAll: 16761867 }
      },
      color: {
        required: false,
        description: 'The color of the embed.',
        default: 16761867
      },
      ignoreChats: {
        required: false,
        default: ['ChatSquad'],
        description: 'A list of chat names to ignore.'
      }
    };
  }

  constructor(server, options) {
    super(server, options);

    server.on('CHAT_MESSAGE', async (info) => {
      if (options.ignoreChats.includes(info.chat)) return;

      await this.sendDiscordMessage({
        embed: {
          title: info.chat,
          color: options.chatColors[info.chat] || options.color,
          fields: [
            {
              name: 'Player',
              value: info.player.name,
              inline: true
            },
            {
              name: 'SteamID',
              value: `[${info.player.steamID}](https://steamcommunity.com/profiles/${info.steamID})`,
              inline: true
            },
            {
              name: 'Team & Squad',
              value: `Team: ${info.player.teamID}, Squad: ${info.player.squadID || 'Unassigned'}`
            },
            {
              name: 'Message',
              value: `${info.message}`
            }
          ],
          timestamp: info.time.toISOString(),
          footer: {
            text: COPYRIGHT_MESSAGE
          }
        }
      });
    });
  }
}
