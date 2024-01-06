const replacements = {
    "https://delta10tatasky.akamaized.net/out/i/6574644.mpd": "https://bpprod4linear.akamaized.net/bpk-tv/irdeto_com_Channel_412/output/manifest.mpd",
    "https://delta13tatasky.akamaized.net/out/i/2285199.mpd": "https://bpprod5linear.akamaized.net/bpk-tv/irdeto_com_Channel_251/output/manifest.mpd",
    // Add more replacements as needed
};

export const replaceStrings = (inputString) => {
    for (const [search, replace] of Object.entries(replacements)) {
        inputString = inputString.replace(new RegExp(search, 'g'), replace);
    }
    return inputString;
};
