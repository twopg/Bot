import { User, GuildMember, Guild } from 'discord.js';
import { mock } from 'ts-mockito';
import { CommandContext } from '../src/commands/command';

export class Mock {
  static guild() {
    const guild = mock<Guild>();

    guild.id = '533947001578979322';
    guild.name = 'Test Server';

    return guild;
  }

  static member() {
    const member = mock<GuildMember>();
    
    member.guild = Mock.guild();
    member.user = Mock.user();

    return member;
  }

  static user() {
    const user = mock<User>();

    user.username = 'User';
    user.discriminator = '0001';
    user.id = '533947001578979328';

    return user;
  }
}