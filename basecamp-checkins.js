import axios from "axios";
import open from "open";
import fs from "fs";
import http from "http";

const TOKEN_FILE = `${process.env.HOME}/.basecamp_token.json`;
const PORT = 19283;

async function getAccessToken() {
  if (fs.existsSync(TOKEN_FILE)) {
    return JSON.parse(fs.readFileSync(TOKEN_FILE, "utf-8")).access_token;
  }

  return new Promise(async (resolve, reject) => {
    const authUrl = `https://launchpad.37signals.com/authorization/new?type=web_server&client_id=${process.env.BASECAMP_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.BASECAMP_REDIRECT_URI)}`;
    await open(authUrl);

    // 2. รอรับ code
    const server = http.createServer(async (req, res) => {
      if (req.url.startsWith("/callback")) {
        try {
          const url = new URL(req.url, `http://localhost:${PORT}`);
          const code = url.searchParams.get("code");
          res.end("Authorization successful! You can close this tab.");

          console.log("Auth code:", code);

          // 3. แลกเป็น token
          const tokenRes = await fetch("https://launchpad.37signals.com/authorization/token", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              type: "web_server",
              client_id: process.env.BASECAMP_CLIENT_ID,
              client_secret: process.env.BASECAMP_CLIENT_SECRET,
              redirect_uri: process.env.BASECAMP_REDIRECT_URI,
              code
            })
          });

          const token = await tokenRes.json();

          fs.writeFileSync(TOKEN_FILE, JSON.stringify(token, null, 2));
          resolve(token.access_token);
        } catch (e) {
          reject(e)
        }
      }
    });

    server.listen(PORT);


  });

}

let result = [];

async function fetchCheckIns(accessToken, page = 0) {

  const BUCKET_ID = process.env.BASECAMP_BUCKET_ID;
  const QUESTION_ID = process.env.BASECAMP_QUESTION_ID;
  const PROJECT_ID = process.env.BASECAMP_PROJECT_ID;

  try {
    const profile = await getProfile(accessToken);
    const account = profile.data.identity;
    const url = `https://3.basecampapi.com/${PROJECT_ID}/buckets/${BUCKET_ID}/questions/${QUESTION_ID}/answers.json?page=${page}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Basecamp-CLI (you@example.com)",
      },
    });

    const data = res.data.filter(d => d.creator.email_address === account.email_address).map(d => {
      return {
        ...d,
        createdAt: new Date(d.created_at)
      };
    }).filter(isAfterLastMonth25);

    data.filter(d => d.creator.email_address === account.email_address).forEach((ci) => {
      result.push({
        createdAt: new Date(ci.created_at),
        name: ci.creator.name,
        email: ci.creator.email_address,
        content: ci.content,
      });
    });

    if (data.length > 0) {
      return fetchCheckIns(accessToken, page + 1);
    }

    return result;
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

function getProfile(accessToken) {
// 1. หาค่า user id ของตัวเอง
  return axios.get(
    `https://launchpad.37signals.com/authorization.json`,
    {headers: {Authorization: `Bearer ${accessToken}`}}
  );
}

function isAfterLastMonth25(data) {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth(); // 0 = Jan
  if (month === 0) {
    year -= 1;
    month = 11;
  } else {
    month -= 1;
  }
  const lastMonth25 = new Date(year, month, 25, 0, 0, 0, 0);

  return data.createdAt > lastMonth25;
}

function isBeforeMonth26(data) {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth(); // 0 = Jan

  const lastMonth26 = new Date(year, month, 26, 0, 0, 0, 0);
  return data.createdAt <= lastMonth26;
}

function getFirstDateOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
}

function processContent(content) {
  content = content.replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("<div>", "")
    .replaceAll("</div>", "")
    .replaceAll("<strong>", "")
    .replaceAll("</strong>", "")
    .replaceAll("<ul>", "")
    .replaceAll("</ul>", "")
    .replaceAll("<li>", "")
    .replaceAll("</li>", "")
  ;
  content = content.replace(/ติดอะไรไหม[\s\S]*$/, "");
  content = content.replace(/ปัญหา:[\s\S]*$/, "");
  content = content.replace(/(วันนี้ทำอะไร \?\s\s\s)/g, "")
  content = content.replace(/(วันนี้ทำอะไร \? , ,)/g, "")
  content = content.replace(/(วันนี้ทำอะไร \? ,)/g, "")
  content = content.replace(/(วันนี้ทำอะไร \?)/g, "")
  content = content.replace(/(วันนี้ทำอะไร:)/g, "")
  content = content.replace(/(วันนี้ทำอะไร)/g, "")

  content = content.replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n/g, ", ").trim();

  content = content.replace(/^,\s/g, "")
  content = content.replace(/,\s,$/g, "")
  content = content.replace(/,$/g, "")
  return content.trim();
}

/**
 * ดาวน์โหลด Check-ins ของเดือนนี้
 * @returns {Promise<{setTimesheet: *, oddsWorkingDays: number}>}
 */
export function downloadCheckIns() {
  result = [];

  return getAccessToken().then((accessToken) => {
    return fetchCheckIns(accessToken, 1)
      .then(async (checkins) => {
        return  checkins.map(r => ({
          ...r,
          content: processContent(r.content || "")
        }));
      }).then((checkins) => {
        const oddsWorkingDays = checkins.filter(isAfterLastMonth25).filter(isBeforeMonth26).length
        console.log("total ODDS MD =", oddsWorkingDays);
        const setTimesheet = checkins.filter(d => d.createdAt >= getFirstDateOfMonth()).sort((a, b) => a.createdAt - b.createdAt);
        return {setTimesheet, oddsWorkingDays};
      });
  });
}

