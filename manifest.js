module.exports={
    id: "org.community.homescreen",
    version: "1.0.1",
    name: "Home Sceen IPTV",
    logo: "https://dl.strem.io/addon-logo.png",
    description: "This addon brings all the Live Streams from your IPTV subscription to your Stremio Home screen using Xtream API.",
    types: ["movie", "series","tv","channel"],
    background: "https://dl.strem.io/addon-background.jpg",
    resources: ["movie","series","tv"],
    catalogs: [],
    idPrefixes: ["yiptv:"],
    behaviorHints:{configurable : true, configurationRequired: true },
};
