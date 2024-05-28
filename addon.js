const axios = require('axios').default;
axios.defaults.headers.get["content-type"] = "application/json";
axios.defaults.timeout = 10000
axios.defaults.method = "GET"

function getUserData(userConf) {

    let retrievedData, url, obj = {}
    try {
        retrievedData = JSON.parse(Buffer.from(userConf, 'base64').toString())      
    } catch (error) {
        console.log(error)
        return "error while parsing url"
    }

    let domainName,baseURL,idPrefix

    if(typeof retrievedData === "object"){
        domainName = retrievedData.BaseURL.split("/")[2].split(":")[0] || "unknown"
        baseURL = retrievedData.BaseURL
        idPrefix = domainName.charAt(0) + domainName.substr(Math.ceil(domainName.length / 2 - 1), domainName.length % 2 === 0 ? 2 : 1) + domainName.charAt(domainName.length - 1) + ":";

        obj = {
            baseURL,
            domainName,
            idPrefix,
            username:retrievedData.username,
            password:retrievedData.password
        }

    }else if(retrievedData.includes("http")){
        url = retrievedData

        const queryString = url.split('?')[1] || "unknown"
        baseURL = url.split('/')[0] + "//" + url.split('?')[0].split('/')[2] || "unknown"

        domainName = url.split("?")[0].split("/")[2].split(":")[0] || "unknown"
        idPrefix = domainName.charAt(0) + domainName.substr(Math.ceil(domainName.length / 2 - 1), domainName.length % 2 === 0 ? 2 : 1) + domainName.charAt(domainName.length - 1) + ":";

        if(queryString === undefined){return {result:"URL does not have any queries!"}}
        if(baseURL === undefined){return {result:"URL does not seem like an url!"}}

        obj.baseURL = baseURL
        obj.domainName = domainName
        obj.idPrefix = idPrefix

        const urlParams = new URLSearchParams(queryString);
        const entries = urlParams.entries();

        for(const entry of entries) {
            obj[entry[0]] = entry[1]
        }
    }

    if(obj.username && obj.password && obj.baseURL){
        return obj
    }else{
        console.log("Error while parsing!")
        return {}
    }
}

async function getManifest(url) {
    const obj = getUserData(url)
    
    let response
    try {
        response = await axios({url:`${obj.baseURL}/player_api.php?username=${obj.username}&password=${obj.password}&action=get_live_categories`})
    } catch (error) {
        console.log(error)
        return {error}
    }
    const responseJSON = response.data

     let catalogs = []
    if (response.status === 200){    
        responseJSON.forEach(i => {
            let name = i.category_name
            let id = i.category_id
             catalogs.push({
		id: id,
		name: name,
		type: "tv",});
	});
        }

    const manifest = {"id":"org.community.hostcloud.network","version":"1.0.0","name":"hostcloud.network IPTV","description":"You will access to your hostcloud.network IPTV with this addon!","idPrefixes":["hdk:"],"resources":["catalog","meta","stream"],"types":["tv"],"behaviorHints":{"configurable":true,"configurationRequired":false},"catalogs": [
    {"id": "518", "name": "WORLD CUP CRICKET 2023 HIGHLIGHTS", "type": "series"},
    {"id": "276", "name": "INDIAN Reality Shows", "type": "series"},
    {"id": "106", "name": "NETFLIX", "type": "series"},
    {"id": "171", "name": "NETFLIX (MULTI LANGUAGE)", "type": "series"},
    {"id": "369", "name": "Australian Shows", "type": "series"},
    {"id": "108", "name": "AMAZON PRIME", "type": "series"},
    {"id": "188", "name": "HBO MAX", "type": "series"},
    {"id": "310", "name": "Jio cinema", "type": "series"},
    {"id": "104", "name": "ZEE5+ALT BALAJI", "type": "series"},
    {"id": "105", "name": "SONY LIV", "type": "series"},
    {"id": "103", "name": "MX PLAYER", "type": "series"},
    {"id": "102", "name": "DISNEY+HOTSTAR", "type": "series"},
    {"id": "111", "name": "VOOT", "type": "series"},
    {"id": "109", "name": "HUNGAMA PLAY", "type": "series"},
    {"id": "110", "name": "STARZ", "type": "series"},
    {"id": "167", "name": "TVF", "type": "series"},
    {"id": "442", "name": "COLORS HINDI", "type": "series"},
    {"id": "443", "name": "SONY (SET)", "type": "series"},
    {"id": "444", "name": "STAR PLUS", "type": "series"},
    {"id": "446", "name": "STAR BHARAT", "type": "series"},
    {"id": "445", "name": "ZEE TV", "type": "series"},
    {"id": "447", "name": "SAB", "type": "series"},
    {"id": "448", "name": "AND TV", "type": "series"},
    {"id": "491", "name": "MTV HINDI", "type": "series"},
    {"id": "332", "name": "EPIC TV", "type": "series"},
    {"id": "463", "name": "HUM TV", "type": "series"},
    {"id": "464", "name": "GEO TV", "type": "series"},
    {"id": "465", "name": "ARY DIGITAL", "type": "series"},
    {"id": "466", "name": "GREEN TV ENTERTAINMENT", "type": "series"},
    {"id": "467", "name": "EXPRESS TV", "type": "series"},
    {"id": "468", "name": "URDU 1", "type": "series"},
    {"id": "505", "name": "GEO NEWS", "type": "series"},
    {"id": "503", "name": "PLAY ENTERTAINMENT", "type": "series"},
    {"id": "504", "name": "MUN TV", "type": "series"},
    {"id": "501", "name": "TV ONE", "type": "series"},
    {"id": "502", "name": "PTV HOME", "type": "series"},
    {"id": "506", "name": "APLUS TV", "type": "series"},
    {"id": "507", "name": "AAN TV", "type": "series"},
    {"id": "515", "name": "AUR LIFE", "type": "series"},
    {"id": "449", "name": "ASIANET", "type": "series"},
    {"id": "450", "name": "ZEE MALAYALAM", "type": "series"},
    {"id": "499", "name": "SURYA MALAYALAM", "type": "series"},
    {"id": "451", "name": "STAR VIJAY", "type": "series"},
    {"id": "452", "name": "ZEE TAMIL", "type": "series"},
    {"id": "498", "name": "SUN TAMIL", "type": "series"},
    {"id": "453", "name": "STAR MAA", "type": "series"},
    {"id": "455", "name": "ZEE TELUGU", "type": "series"},
    {"id": "494", "name": "GEMINI", "type": "series"},
    {"id": "493", "name": "ETV", "type": "series"},
    {"id": "456", "name": "STAR PRAVAH", "type": "series"},
    {"id": "457", "name": "ZEE MARATHI", "type": "series"},
    {"id": "490", "name": "COLORS MARATHI", "type": "series"},
    {"id": "486", "name": "SONY MARATHI", "type": "series"},
    {"id": "497", "name": "SUN MARATHI", "type": "series"},
    {"id": "458", "name": "STAR SUVARNA", "type": "series"},
    {"id": "459", "name": "ZEE KANNADA", "type": "series"},
    {"id": "462", "name": "ZEE PUNJABI", "type": "series"},
    {"id": "460", "name": "STAR JALSHA", "type": "series"},
    {"id": "461", "name": "ZEE BANGLA", "type": "series"},
    {"id": "496", "name": "SUN BANGLA", "type": "series"},
    {"id": "487", "name": "COLORS BANGLA", "type": "series"},
    {"id": "485", "name": "SONY AATH", "type": "series"},
    {"id": "488", "name": "COLORS GUJARATI", "type": "series"},
    {"id": "489", "name": "COLORS KANNADA", "type": "series"},
    {"id": "500", "name": "UDAYA KANNADA", "type": "series"},
    {"id": "495", "name": "SAREGAMA TV", "type": "series"},
    {"id": "293", "name": "PAKISTANI DRAMA", "type": "series"},
    {"id": "164", "name": "URDU Tv Series", "type": "series"},
    {"id": "163", "name": "Tamil Tv Series", "type": "series"},
    {"id": "162", "name": "Punjabi Tv Series", "type": "series"},
    {"id": "161", "name": "HINDI TV SERIES", "type": "series"},
    {"id": "144", "name": "ISLAMIC", "type": "series"},
    {"id": "99", "name": "TURKISH", "type": "series"},
    {"id": "142", "name": "FLIPKART", "type": "series"},
    {"id": "118", "name": "HOICHOI", "type": "series"},
    {"id": "117", "name": "LETS", "type": "series"},
    {"id": "116", "name": "ULLU", "type": "series"},
    {"id": "115", "name": "VIU", "type": "series"},
    {"id": "114", "name": "APPLE TV+", "type": "series"},
    {"id": "113", "name": "EROS NOW", "type": "series"},
    {"id": "426", "name": "JIO", "type": "series"},
    {"id": "112", "name": "GEMPLEX", "type": "series"},
    {"id": "236", "name": "LPlay", "type": "series"},
    {"id": "238", "name": "MUSIC", "type": "series"},
    {"id": "241", "name": "CRIME & THRILLER", "type": "series"},
    {"id": "249", "name": "Paramount+", "type": "series"},
    {"id": "250", "name": "SYFY", "type": "series"},
    {"id": "256", "name": "History", "type": "series"},
    {"id": "267", "name": "KOREAN (MULTI LANGUAGE)", "type": "series"},
    {"id": "274", "name": "Tv Shows", "type": "series"},
    {"id": "275", "name": "Tv Shows (MULTI LANGUAGE)", "type": "series"},
    {"id": "359", "name": "KBS", "type": "series"},
    {"id": "360", "name": "MBC", "type": "series"},
    {"id": "361", "name": "SBS", "type": "series"},
    {"id": "368", "name": "Korean (MULTI-LANGUAGE)", "type": "series"},
    {"id": "474", "name": "HULU", "type": "series"},
    {"id": "475", "name": "PEACOCK TV", "type": "series"},
    {"id": "476", "name": "VIKI", "type": "series"},
    {"id": "486", "name": "SONY MARATHI", "type": "series"},
    {"id": "488", "name": "COLORS GUJARATI", "type": "series"},
    {"id": "489", "name": "COLORS KANNADA", "type": "series"},
    {"id": "490", "name": "COLORS MARATHI", "type": "series"},
    {"id": "491", "name": "MTV HINDI", "type": "series"},
    {"id": "496", "name": "SUN BANGLA", "type": "series"},
    {"id": "497", "name": "SUN MARATHI", "type": "series"},
    {"id": "498", "name": "SUN TAMIL", "type": "series"},
    {"id": "499", "name": "SURYA MALAYALAM", "type": "series"},
    {"id": "500", "name": "UDAYA KANNADA", "type": "series"},
    {"id": "501", "name": "TV ONE", "type": "series"},
    {"id": "502", "name": "PTV HOME", "type": "series"},
    {"id": "503", "name": "PLAY ENTERTAINMENT", "type": "series"},
    {"id": "504", "name": "MUN TV", "type": "series"},
    {"id": "505", "name": "GEO NEWS", "type": "series"},
    {"id": "506", "name": "APLUS TV", "type": "series"},
    {"id": "507", "name": "AAN TV", "type": "series"},
    {"id": "508", "name": "ONMAX TV", "type": "series"},
    {"id": "509", "name": "FASHION ONE", "type": "series"},
    {"id": "510", "name": "LUXE TV", "type": "series"},
    {"id": "511", "name": "ROK TV", "type": "series"},
    {"id": "512", "name": "FAMOUS TV", "type": "series"},
    {"id": "513", "name": "EPIC ON", "type": "series"},
    {"id": "514", "name": "RAJ TV", "type": "series"},
    {"id": "515", "name": "AUR LIFE", "type": "series"},
    {"id": "516", "name": "FILAMU TV", "type": "series"},
    {"id": "517", "name": "ZAK TV", "type": "series"}
  ]
}

    return manifest

}

function getValidUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol.startsWith('http') ? url : '';
    } catch {
        return '';
    }
}

async function getCatalog(url,type,id) {

    const obj = getUserData(url)

    let getCategoryID

    try {
        getCategoryID = await axios({url:`${obj.baseURL}/player_api.php?username=${obj.username}&password=${obj.password}&action=get_live_streams`})    
    } catch (error) {
        console.log(error)
        return []
           }


    let catID

    getCategoryID.data.forEach(i => {
        if(i.category_id === id){
            catID = i.category_id
        }
    });
  
    let action =  type ==="tv" ? "get_live_streams" : "error"

    let paramsCat = {
        username: obj.username,
        password: obj.password,
        action,
        category_id: catID
    }

    let getCatalogs
    try {
        getCatalogs = await axios({url:`${obj.baseURL}/player_api.php`,method:"GET",params:paramsCat})
    } catch (error) {
        console.log(error)
        
        return []
    }

    let metas = []

    getCatalogs.data.forEach(i => {
        let id,name = i.name, poster, posterShape, imdbRating

        if (type === "tv"){
            id = obj.idPrefix + i.stream_id || ""
            poster = getValidUrl(i.stream_icon)
            imdbRating = null
            posterShape = "square"
        }

        metas.push({id,type,name,poster,posterShape,imdbRating})
    }); 

    return metas
}   
async function getMeta(url,type,id) {

    const streamID = id.split(":")[1]

    const obj = getUserData(url)

    let action =  type ==="tv" ? "get_live_streams" : "error"
    let requestID = type ==="tv" ? "stream_id" : "error"

    let params = {
        username: obj.username,
        password: obj.password,
        action,
        [requestID]:streamID
    }

    if(type === "tv"){
        delete params[requestID]
    }
    

    let getMeta

    try {
        getMeta = await axios({url:`${obj.baseURL}/player_api.php`,params})
    } catch (error) {
        console.log(error)
        return {}
       
    }

   

    let meta = {}

    if(type === "tv"){

        let metaTV = []
        getMeta.data.forEach(i => {

            if(Number(i.stream_id) === Number(streamID)){

                let id= obj.idPrefix + i.stream_id
                
                let name = i.name || ""
                let background=  i.stream_icon
                let logo =  i.stream_icon || null

                metaTV.push({id,name,type,background,logo})
                
            }
        });
       
        return metaTV[0]
    }

   return meta
}
module.exports={getUserData,getManifest,getCatalog,getMeta}
