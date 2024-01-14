const skipChannelIds = [632,840];

const filterChannels = (channels) => {
    return channels.filter(channel => !skipChannelIds.includes(channel.channelMeta.id));
};

module.exports = { filterChannels };