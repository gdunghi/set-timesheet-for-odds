import * as https from "node:https";
import axios from "axios";

const SET_PORTAL_URL = 'https://portal.setint.or.th/api/hr/outsource-timesheet/detail';
const saveUrl = "https://portal.setint.or.th/api/hr/outsource-timesheet/save";

function get(url, authorization) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'th,en-US;q=0.9,en;q=0.8',
        'authorization': authorization,
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          console.error('Invalid JSON:', e);
        }
      });
    }).on('error', err => {
      console.error('Error:', err);
      reject(err);
    });
  })
}

function post(url, authorization, body) {
  // return new Promise((resolve, reject) => {
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       'accept': 'application/json, text/plain, */*',
  //       'accept-language': 'th,en-US;q=0.9,en;q=0.8',
  //       'authorization': authorization,
  //       'content-type': 'application/json;charset=UTF-8'
  //     }
  //   };
  //
  //   const req = https.request(url, options, (res) => {
  //     let data = '';
  //     res.on('data', chunk => data += chunk);
  //     res.on('end', () => {
  //       try {
  //         resolve();
  //       } catch (e) {
  //         console.error('Invalid JSON:', e);
  //       }
  //     });
  //   });
  //
  //   req.on('error', err => {
  //     console.error('Error:', err);
  //     reject(err);
  //   });
  //
  //   req.write(JSON.stringify(body));
  //   req.end();
  // });
  return axios.post(saveUrl, body,{
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json',
    },
  });
}


export async function sendTimesheet(baseCampTimesheet) {
  const now = new Date();
  const month = (now.getMonth() + 1) - 1; // SET portal ใช้ 0-11 แทน 1-12
  const url = `${SET_PORTAL_URL}/${process.env.SET_ACCOUNT_ID}/${month}/${now.getFullYear()}?projectName=${encodeURIComponent(process.env.SET_PROJECT_NAME)}`;

  const initialTimesheet = await get(url, process.env.SET_AUTHORIZATION)
    .then((result) => {
      if(result.status !== 200) {}
      result.days.forEach(day => day.date = new Date(day.date));
      return result;
    });
  const timesheet = mergeTimesheet(initialTimesheet, baseCampTimesheet);
  await post(url, process.env.SET_AUTHORIZATION, timesheet);
}

export function mergeTimesheet(initial, basecamp) {
  let basecampIndex = 0;
  const result = {...initial};
  const bcSorted = [...basecamp].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const currentMonth = new Date().getMonth();
  const year = new Date().getFullYear();

  result.month = currentMonth;
  result.year = year;

  result.days = initial.days.filter(d => d.date.getMonth() === currentMonth).map((set) => {
    // ข้ามวันหยุดเสาร์-อาทิตย์, HOLIDAY ที่ไม่มี remark อยู่แล้ว
    if (set.daily === "WEEK_END" || set.daily === "HOLIDAY") {
      return set;
    }

    if (set.date === bcSorted[basecampIndex]?.createdAt) {
      set.remark = bcSorted[basecampIndex].content;
      basecampIndex++;
    } else if (bcSorted[basecampIndex]) {
      set.remark = bcSorted[basecampIndex].content;
      basecampIndex++;
    }
    return set;
  });

  return result;
}
