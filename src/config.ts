import { BotConfig } from './structures/types'; 

export const config: BotConfig = {
    groupId: 14113482,
    slashCommands: true,
    legacyCommands: {
        enabled: true,
        prefixes: ['!!'],
    },
    permissions: {
        all: ['1137701672664191047', '1137701950440357939', '1144557072432762980'],
        ranking: [''],
        users: [''],
        verified: ['1138884920756944896', '1137717141227962480', '900771217345216532'],
        shout: ['945388997260243003'],
        join: ['945404307753304185'],
        signal: ['945362316633993226', '945362317464444928'],
        admin: ['1144557072432762980', '1144557072432762980'],
        helper: ['', '', '', ''],
    },
    logChannels: {
        actions: '',
        shout: '',
    },
    database: {
        enabled: true,
        type: 'mongodb',
    },
    api: true,
    maximumRank: 102,
    verificationChecks: true,
    firedRank: 1,
    suspendedRank: 2,
    inactiveRank: 1,
    recordManualActions: false,
    memberCount: {
        enabled: false,
        channelId: '',
        milestone: 200,
        onlyMilestones: false,
    },
     xpSystem: {
        enabled: true,
        autoRankup: false,
        roles: [
            
            {
                rank: 18,
                xp: 10000,
            },
            {
                rank: 17,
                xp: 9000,
            },
            {
                rank: 16,
                xp: 8000,
            },
            {
                rank: 15,
                xp: 7000,
            },
            {
                rank: 14,
                xp: 6000,
            },
            {
                rank: 13,
                xp: 5000,
            },
            {
                rank: 12,
                xp: 3000,
            },
            {
                rank: 11,
                xp: 2000,
            },
            {
                rank: 10,
                xp: 1500,
            },
            {
                rank: 9,
                xp: 900,
            },
            {
                rank: 8,
                xp: 500,
            },
            {
                rank: 7,
                xp: 200,
            },
            {
                rank: 6,
                xp: 100,
            },
            
        ],
    },
    requestChannel: '',
    antiAbuse: {
        enabled: false,
        clearDuration: 1 * 60,
        threshold: 5,
        demotionRank: 3,
        bypassRoleId: '862434154033315881',
    },
    activity: {
        enabled: true,
        type: 'STREAMING',
        url: 'https://twitch.tv/lost_shadow_gamer',
        value: 'promotions | !!help, /help',
    },
    status: 'dnd',
    deleteWallURLs: false,
}
