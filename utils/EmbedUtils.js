const EMBED_STATUS_COLOR = 0x3f5b89;
const EMBED_REPLY_COLOR = 0x893f3f;

// Create a styled embed message with a title, message, and an optional emoji
const createEmbed = (emoji = '', message, title = '') => {
    return {
        embeds: [
            {
                title: title,
                description: `${emoji}\u1CBC${message}`,
                color: EMBED_REPLY_COLOR,
            },
        ],
    };
};

// Create a styled embed message with a title, message, and an optional emoji
const createStatusEmbed = (emoji = '', message, title = '') => {
    return {
        embeds: [
            {
                title: title,
                description: `${emoji}\u1CBC${message}`,
                color: EMBED_STATUS_COLOR,
            },
        ],
    };
};

module.exports = {
    createEmbed,
    createStatusEmbed,
};
