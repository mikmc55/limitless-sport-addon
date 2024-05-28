module.exports={
    id: "org.community.homescreen",
    version: "1.0.1",
    name: "Mediafusion VOD addon",
    logo: "https://raw.githubusercontent.com/mikmc55/stremio-ptiptv/master/h_y-high-resolution-logo-transparent.png",
    description: "This addon brings VOD from streams",
    types: ["movie", "series","tv","channel"],
    background: "https://raw.githubusercontent.com/mikmc55/limitless-sport-addon/mediafusion/mediafusion-elfhosted-logo.png",
    resources: ["movie","series","tv"],
    catalogs: [],
    idPrefixes: ["yiptv:"],
    behaviorHints:{configurable : true, configurationRequired: true },
};
