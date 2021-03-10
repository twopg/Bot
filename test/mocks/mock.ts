import { User, GuildMember, Guild, Collection } from 'discord.js';
import { mock } from 'ts-mockito';

export class Mock {
  static guild(id = '533947001578979322') {
    const guild = mock<Guild>();

    guild.id = id;
    guild.name = 'Test Server';
    guild.members.cache = new Collection<string, GuildMember>();

    return guild;
  }

  static member(id = '533947001578979328', guild?: Guild) {
    const member = mock<GuildMember>();
    
    member.guild = guild ?? Mock.guild();
    member.user = Mock.user(id);

    return member;
  }

  static user(id = '533947001578979328') {
    const user = mock<User>();

    user.username = 'User';
    user.discriminator = '0001';
    user.id = id;

    return user;
  }
}
