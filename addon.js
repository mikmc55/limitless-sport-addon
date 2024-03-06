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

    const manifest = {
  "id": "org.community.hyusa.network",
  "version": "1.0.0",
  "name": "hy.usa IPTV",
  "description": "You will access to your USA SPORTS IPTV with this addon!",
  "idPrefixes": ["hdk:"],
  "resources": ["catalog", "meta", "stream"],
  "types": ["tv"],
  "behaviorHints": {
    "configurable": true,
    "configurationRequired": false
  },
  "catalogs": [
    {"id": "1", "name": "Daily | Live Events", "type": "tv"},
    {"id": "26", "name": "Pay Per View", "type": "tv"},
    {"id": "37", "name": "US | ESPN +", "type": "tv"},
    {"id": "34", "name": "US | Local Sports", "type": "tv"},
    {"id": "35", "name": "US/CA | Sports", "type": "tv"},
    {"id": "63", "name": "US | NFL Games", "type": "tv"},
    {"id": "62", "name": "US | NBA League Pass", "type": "tv"},
    {"id": "60", "name": "US | MLB Extra Innings", "type": "tv"},
    {"id": "64", "name": "US | NHL Center Ice", "type": "tv"},
    {"id": "61", "name": "US | MLS", "type": "tv"},
    {"id": "821", "name": "US | NCAAB", "type": "tv"},
    {"id": "1333", "name": "AHL / ECHL/ OHL / WHL / QMJHL", "type": "tv"}
  ]
};

return manifest;
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
