'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {Client,GatewayIntentBits,AttachmentBuilder}=require('discord.js');
const token=process.env.DISCORD_TOKEN;
if(!token){console.error('Missing DISCORD_TOKEN');process.exit(1);}
const GUILD_ID=process.env.GUILD_ID||'1447961768776437795';
const REVIEW_CHANNEL_ID=process.env.REVIEW_CHANNEL_ID||'1547570950927687690';
const REVIEW_REACTION_ID=process.env.REVIEW_REACTION_ID||'1477117835322069083';
const INTERVAL=Math.max(1,Number(process.env.SEPARATOR_INTERVAL||1));
const ENABLED=process.env.SEPARATOR_ENABLED!=='false';
const FILE=path.resolve(__dirname,process.env.SEPARATOR_FILE||'separator.gif');
const client=new Client({intents:[GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent]});
let chain=Promise.resolve();let count=0;
client.once('ready',async()=>{console.log('REVO review bot online as '+client.user.tag);try{const guild=await client.guilds.fetch(GUILD_ID);await guild.commands.set([]);console.log('No slash commands registered.');}catch(error){console.error('Startup check failed: '+error.message);}});
client.on('messageCreate',message=>{if(message.author.bot||message.guildId!==GUILD_ID||message.channelId!==REVIEW_CHANNEL_ID)return;chain=chain.then(async()=>{count++;try{await message.react(REVIEW_REACTION_ID);}catch(error){console.error('Reaction failed: '+error.message);}if(!ENABLED||count%INTERVAL!==0||!fs.existsSync(FILE))return;try{await message.channel.send({files:[new AttachmentBuilder(FILE,{name:'revo-separator.gif'})]});}catch(error){console.error('Separator failed: '+error.message);}}).catch(error=>console.error('Queue failed: '+error.message));});
client.login(token).catch(error=>{console.error('Login failed: '+error.message);process.exit(1);});
