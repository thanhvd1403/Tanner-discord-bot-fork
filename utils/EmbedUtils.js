const EMBED_STATUS_COLOR = 0x3f5b89;
const EMBED_REPLY_COLOR = 0x893f3f;

// Create a styled embed message with a title, message, and an optional emoji
const createEmbed = (emoji = '', message, title = '', epherial = false) => {
    return {
        embeds: [
            {
                title: title,
                description: `${emoji}\u1CBC${message}`,
                color: EMBED_REPLY_COLOR,
                epherial,
            },
        ],
    };
};

// Create a styled embed message with a title, message, and an optional emoji
const createStatusEmbed = (emoji = '', message, title = '', epherial = false) => {
    return {
        embeds: [
            {
                title,
                description: `${emoji}\u1CBC${message}`,
                color: EMBED_STATUS_COLOR,
                epherial,
            },
        ],
    };
};

module.exports = {
    createEmbed,
    createStatusEmbed,
};
