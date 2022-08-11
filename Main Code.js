const scriptName = "League of legends";

const { KakaoLinkClient } = require('kakaolink');
const Kakao = new KakaoLinkClient('', 'https://dak.gg');
Kakao.login('','');

const API_Key = ""; //Riot API KEY

var BasicData = {};
var SummonerId = "";
var DetailedData = {};
var LadderRank = "";

var ChangeTierImg = {
    "UNRANKED": "https://i.ibb.co/kQ7S8TM/Comp-1-00000.png",
    "IRON": "https://i.ibb.co/L60CqRJ/Comp-1-00001.png",
    "BRONZE": "https://i.ibb.co/T0P09pK/Comp-1-00002.png",
    "SILVER": "https://i.ibb.co/9WkqY5f/Comp-1-00003.png",
    "GOLD": "https://i.ibb.co/GFvyRn5/Comp-1-00004.png",
    "PLATINUM": "https://i.ibb.co/mtz8DBk/Comp-1-00005.png",
    "DIAMOND": "https://i.ibb.co/19nmjzg/Comp-1-00006.png",
    "MASTER": "https://i.ibb.co/f4sdyRm/Comp-1-00007.png",
    "GRANDMASTER": "https://i.ibb.co/L1TyJKr/Comp-1-00008.png",
    "CHALLENGER": "https://i.ibb.co/c8XDmHV/Comp-1-00009.png"
};

function getData(user) {
    try {
    BasicData = JSON.parse(
        org.jsoup.Jsoup.connect("https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + user)
            .header("User-Agent", "Mozilla/5.0")
            .header("Accept-Language", "ko")
            .header("Accept-Charset", "application/x-www-form-urlencoded; charset=UTF-8")
            .header("Origin", "https://developer.riotgames.com")
            .header("X-Riot-Token", API_Key)
            .ignoreContentType(true).ignoreHttpErrors(true).get().text()
    );
    SummonerId = BasicData.id;

    DetailedData = JSON.parse(
        org.jsoup.Jsoup.connect("https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/" + SummonerId)
            .header("User-Agent", "Mozilla/5.0")
            .header("Accept-Language", "ko")
            .header("Accept-Charset", "application/x-www-form-urlencoded; charset=UTF-8")
            .header("Origin", "https://developer.riotgames.com")
            .header("X-Riot-Token", API_Key)
            .ignoreContentType(true).ignoreHttpErrors(true).get().text()
    ).find(v => v.queueType === "RANKED_SOLO_5x5");
    if (DetailedData == undefined) DetailedData = {
        "leagueId": "??",
        "queueType": "??",
        "tier": "UNRANKED",
        "rank": "",
        "summonerId": "",
        "summonerName": BasicData.name,
        "leaguePoints": 0,
        "wins": 0,
        "losses": 0,
        "veteran": false,
        "inactive": false,
        "freshBlood": false,
        "hotStreak": false
    };
    } catch (e) {
        DetailedData = {
            "leagueId": "??",
            "queueType": "??",
            "tier": "UNRANKED",
            "rank": "",
            "summonerId": "",
            "summonerName": BasicData.name,
            "leaguePoints": 0,
            "wins": 0,
            "losses": 0,
            "veteran": false,
            "inactive": false,
            "freshBlood": false,
            "hotStreak": false
        };
    }
    LadderRank = org.jsoup.Jsoup.connect("https://www.op.gg/summoners/kr/" + BasicData.name).get().select("#content-header > div.css-rfknps.eioz3425 > div > div.header-profile-info > div.info > div.team-and-rank > div > a").text().replace("Ladder Rank ", "").replace(" (", "&").replace(" of top)", "").split("&");
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if (msg == ".ㄹㄹ") {
        Api.reload("League of legends");
    }

    if (msg == ".123") replier.reply(org.jsoup.Jsoup.connect("https://www.op.gg/summoners/kr/탑망은정글갭").get().select("#content-header > div.css-rfknps.eioz3425 > div > div.header-profile-info > div.info > div.team-and-rank > div > a").text())

    if (msg.startsWith(".롤 ")) {
        try{
            getData(msg.substr(3));

            //replier.reply(JSON.stringify(BasicData, null, 4));
            //replier.reply(JSON.stringify(DetailedData, null, 4));
            /*
            replier.reply(
                "nickname: " + BasicData.name
                + "\nLevel: " + BasicData.summonerLevel
                + "\nprofileIconId: " + BasicData.profileIconId
                + "\ntier: " + DetailedData.tier +" "+ DetailedData.rank
                + "\nwin/loss: " + DetailedData.wins + "/" + DetailedData.losses + "(" + (DetailedData.wins / (DetailedData.wins + DetailedData.losses) * 100).toFixed(2)+"%)"
            );
            */

            Kakao.sendLink(room, {
                "link_ver" : "4.0",
                "template_id" : 81139,
                "template_args" : {
                    profileIcon: "http://ddragon.leagueoflegends.com/cdn/12.14.1/img/profileicon/"+BasicData.profileIconId+".png",
                    Level: BasicData.summonerLevel,
                    username: BasicData.name,
                    index: DetailedData.tier +" "+ DetailedData.rank + " (" + DetailedData.leaguePoints+"p)\nwin rate: " + (DetailedData.wins / (DetailedData.wins + DetailedData.losses) * 100).toFixed(2)+"%",
                    win_loss: "wins: "+DetailedData.wins + " / losses: " + DetailedData.losses,
                    tierImg: ChangeTierImg[DetailedData.tier],
                    ranking: LadderRank[0],
                    rankingP: LadderRank[1]
                }
            }, "custom");

        } catch (e) {
            replier.reply(e+e.lineNumber);
        }
    }
}

//http://ddragon.leagueoflegends.com/cdn/10.6.1/img/profileicon/4529.png

//#content-header > div.css-rfknps.eioz3425 > div > div.header-profile-info > div.info > div.team-and-rank > div > a > span
