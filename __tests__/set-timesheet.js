import test from "node:test";
import assert from "node:assert/strict";
import {mergeTimesheet} from "../set-timesheet.js";

// mock data
let initialTimeSheetData = {
  "id": 14959815,
  "year": 2025,
  "month": 7,
  "weekOfMonth": null,
  "weekOfYear": 31,
  "empId": "1000588",
  "employeeName": null,
  "projectName": "จ้าง Outsource โครงการ FundConnext ประจำปี 2025",
  "status": "PENDING_REVIEW",
  "reviewer": "01351",
  "approval": "01070",
  "days": [
    {
      "dayOfWeekNo": 0,
      "date": "2025-07-27",
      "daily": "WEEK_END",
      "remark": null
    },
    {
      "dayOfWeekNo": 1,
      "date": "2025-07-28",
      "daily": "NOT_SELECT",
      "remark": null
    },
    {
      "dayOfWeekNo": 2,
      "date": "2025-07-29",
      "daily": "NOT_SELECT",
      "remark": null
    },
    {
      "dayOfWeekNo": 3,
      "date": "2025-07-30",
      "daily": "NOT_SELECT",
      "remark": null
    },
    {
      "dayOfWeekNo": 4,
      "date": "2025-07-31",
      "daily": "NOT_SELECT",
      "remark": null
    },
    {
      "dayOfWeekNo": 5,
      "date": "2025-08-01",
      "daily": "FULL_DAY",
      "remark": "ทำ log rotation ของ airflow"
    },
    {
      "dayOfWeekNo": 6,
      "date": "2025-08-02",
      "daily": "WEEK_END",
      "remark": null
    },
    {
      "dayOfWeekNo": 0,
      "date": "2025-08-03",
      "daily": "WEEK_END",
      "remark": null
    },
    {
      "dayOfWeekNo": 1,
      "date": "2025-08-04",
      "daily": "FULL_DAY",
      "remark": "refinement, แก้ jasper report dividend transaction, reset finnet data สำหรับ registar"
    },
    {
      "dayOfWeekNo": 2,
      "date": "2025-08-05",
      "daily": "FULL_DAY",
      "remark": "update bank code/ bank account ตอน approve สำหรับกรณี payment type QR_SA, ช่วยทีมดูว่าทำไม message queue ไม่ถูกโยนเข้า Deadletter queue, check rotate log ของ airflow"
    },
    {
      "dayOfWeekNo": 3,
      "date": "2025-08-06",
      "daily": "FULL_DAY",
      "remark": "criteria ปรับ allotted transaction upload file กรณีที่ upload รายการ Registrar ATS_SA แล้วแก้เป็น ATS_AMC (FINNET) , หาสาเหตุ ไม่สามารถ subbmit รายการ payment type CHEQ_AMC ได้หลังจากที่ทำรายการสำเร็จในครั้งแรก"
    },
    {
      "dayOfWeekNo": 4,
      "date": "2025-08-07",
      "daily": "FULL_DAY",
      "remark": "ทำ e2e test, code review"
    },
    {
      "dayOfWeekNo": 5,
      "date": "2025-08-08",
      "daily": "FULL_DAY",
      "remark": "automate test, sprint review, retro"
    },
    {
      "dayOfWeekNo": 6,
      "date": "2025-08-09",
      "daily": "WEEK_END",
      "remark": null
    },
    {
      "dayOfWeekNo": 0,
      "date": "2025-08-10",
      "daily": "WEEK_END",
      "remark": null
    },
    {
      "dayOfWeekNo": 1,
      "date": "2025-08-11",
      "daily": "HOLIDAY",
      "remark": null
    },
    {
      "dayOfWeekNo": 2,
      "date": "2025-08-12",
      "daily": "HOLIDAY",
      "remark": null
    },
    {
      "dayOfWeekNo": 3,
      "date": "2025-08-13",
      "daily": "FULL_DAY",
      "remark": "sprint planning part 1 & 2"
    },
    {
      "dayOfWeekNo": 4,
      "date": "2025-08-14",
      "daily": "FULL_DAY",
      "remark": "ทำ api สำหรับ����ึงข้อมูล tmf investment by year , refactor api tax balance"
    },
    {
      "dayOfWeekNo": 5,
      "date": "2025-08-15",
      "daily": "FULL_DAY",
      "remark": "code review, ทำ api สำหรับดึงข้อมูล tmf investment by year , refactor api tax-platform"
    },
    {
      "dayOfWeekNo": 6,
      "date": "2025-08-16",
      "daily": "WEEK_END",
      "remark": null
    },
    {
      "dayOfWeekNo": 0,
      "date": "2025-08-17",
      "daily": "WEEK_END",
      "remark": null
    },
    {
      "dayOfWeekNo": 1,
      "date": "2025-08-18",
      "daily": "FULL_DAY",
      "remark": "api preview account balance report, api preview confirmatin note report, refinement"
    },
    {
      "dayOfWeekNo": 2,
      "date": "2025-08-19",
      "daily": "FULL_DAY",
      "remark": "api preview confirmation note report, เช็ค error ที่เกิดจาก queue ค้าง, หาสาเหตุ unit test report server พัง (เกิดจาก build จาก jasper ผิด version)"
    },
    {
      "dayOfWeekNo": 3,
      "date": "2025-08-20",
      "daily": "FULL_DAY",
      "remark": "รับ parameter ชั่วคราว สำหรับ tmf investment by year ระหว่างรอ final spec, refactor code, code review, เพิ่ม code กรณี send notification error เกิน 3 ครั้งจะหยุด retry และ log critical"
    },
    {
      "dayOfWeekNo": 4,
      "date": "2025-08-21",
      "daily": "FULL_DAY",
      "remark": "run automate, e2e job set settlement"
    },
    {
      "dayOfWeekNo": 5,
      "date": "2025-08-22",
      "daily": "FULL_DAY",
      "remark": "ทำ automate test ของ set settement bank, ทำ automate test ของ generate paid transaction, sprint review, sprint retro"
    },
    {
      "dayOfWeekNo": 6,
      "date": "2025-08-23",
      "daily": "WEEK_END",
      "remark": null
    },
    {
      "dayOfWeekNo": 0,
      "date": "2025-08-24",
      "daily": "WEEK_END",
      "remark": null
    },
    {
      "dayOfWeekNo": 1,
      "date": "2025-08-25",
      "daily": "NOT_SELECT",
      "remark": null
    },
    {
      "dayOfWeekNo": 2,
      "date": "2025-08-26",
      "daily": "NOT_SELECT",
      "remark": null
    },
    {
      "dayOfWeekNo": 3,
      "date": "2025-08-27",
      "daily": "NOT_SELECT",
      "remark": null
    },
    {
      "dayOfWeekNo": 4,
      "date": "2025-08-28",
      "daily": "NOT_SELECT",
      "remark": null
    },
    {
      "dayOfWeekNo": 5,
      "date": "2025-08-29",
      "daily": "NOT_SELECT",
      "remark": null
    },
    {
      "dayOfWeekNo": 6,
      "date": "2025-08-30",
      "daily": "WEEK_END",
      "remark": null
    },
    {
      "dayOfWeekNo": 0,
      "date": "2025-08-31",
      "daily": "WEEK_END",
      "remark": null
    },
    {
      "dayOfWeekNo": 1,
      "date": "2025-09-01",
      "daily": "NOT_SELECT",
      "remark": null
    },
    {
      "dayOfWeekNo": 2,
      "date": "2025-09-02",
      "daily": "NOT_SELECT",
      "remark": null
    },
    {
      "dayOfWeekNo": 3,
      "date": "2025-09-03",
      "daily": "NOT_SELECT",
      "remark": null
    },
    {
      "dayOfWeekNo": 4,
      "date": "2025-09-04",
      "daily": "NOT_SELECT",
      "remark": null
    },
    {
      "dayOfWeekNo": 5,
      "date": "2025-09-05",
      "daily": "NOT_SELECT",
      "remark": null
    },
    {
      "dayOfWeekNo": 6,
      "date": "2025-09-06",
      "daily": "WEEK_END",
      "remark": null
    }
  ],
  "comment": null,
  "vendor": "Odd-e (Thailand)",
  "type": "IT_OUTSOURCE"
};

let basecampTimesheetData =[
  {
    "createdAt": "2025-08-01T10:40:17.733Z",
    "name": "Tom",
    "email": "tom@odds.team",
    "content": "ทำ log rotation ของ airflow"
  },
  {
    "createdAt": "2025-08-04T11:02:01.496Z",
    "name": "Tom",
    "email": "tom@odds.team",
    "content": "refinement, แก้ jasper report dividend transaction, reset finnet data สำหรับ registar"
  },
  {
    "createdAt": "2025-08-06T02:32:54.421Z",
    "name": "Tom",
    "email": "tom@odds.team",
    "content": "update bank code/ bank account ตอน approve สำหรับกรณี payment type QR_SA, ช่วยทีมดูว่าทำไม message queue ไม่ถูกโยนเข้า Deadletter queue, check rotate log ของ airflow"
  },
  {
    "createdAt": "2025-08-06T10:57:07.525Z",
    "name": "Tom",
    "email": "tom@odds.team",
    "content": "criteria ปรับ allotted transaction upload file กรณีที่ upload รายการ Registrar ATS_SA แล้วแก้เป็น ATS_AMC (FINNET) , หาสาเหตุ ไม่สามารถ subbmit รายการ payment type CHEQ_AMC ได้หลังจากที่ทำรายการสำเร็จในครั้งแรก"
  },
  {
    "createdAt": "2025-08-07T11:24:19.002Z",
    "name": "Tom",
    "email": "tom@odds.team",
    "content": "ทำ e2e test, code review"
  },
  {
    "createdAt": "2025-08-08T11:03:06.340Z",
    "name": "Tom",
    "email": "tom@odds.team",
    "content": "automate test, sprint review, retro"
  },
  {
    "createdAt": "2025-08-13T11:13:27.993Z",
    "name": "Tom",
    "email": "tom@odds.team",
    "content": "sprint planning part 1 & 2"
  },
  {
    "createdAt": "2025-08-14T12:32:30.933Z",
    "name": "Tom",
    "email": "tom@odds.team",
    "content": "ทำ api สำหรับดึงข้อมูล tmf investment by year , refactor api tax balance"
  },
  {
    "createdAt": "2025-08-15T13:38:51.723Z",
    "name": "Tom",
    "email": "tom@odds.team",
    "content": "code review, ทำ api สำหรับดึงข้อมูล tmf investment by year , refactor api tax-platform"
  },
  {
    "createdAt": "2025-08-18T11:00:40.247Z",
    "name": "Tom",
    "email": "tom@odds.team",
    "content": "api preview account balance report, api preview confirmatin note report, refinement"
  },
  {
    "createdAt": "2025-08-19T10:56:19.738Z",
    "name": "Tom",
    "email": "tom@odds.team",
    "content": "api preview confirmation note report, เช็ค error ที่เกิดจาก queue ค้าง, หาสาเหตุ unit test report server พัง (เกิดจาก build จาก jasper ผิด version)"
  },
  {
    "createdAt": "2025-08-20T11:02:18.695Z",
    "name": "Tom",
    "email": "tom@odds.team",
    "content": "รับ parameter ชั่วคราว สำหรับ tmf investment by year ระหว่างรอ final spec, refactor code, code review, เพิ่ม code กรณี send notification error เกิน 3 ครั้งจะหยุด retry และ log critical"
  },
  {
    "createdAt": "2025-08-22T01:36:14.822Z",
    "name": "Tom",
    "email": "tom@odds.team",
    "content": "run automate, e2e job set settlement"
  },
  {
    "createdAt": "2025-08-22T13:16:33.048Z",
    "name": "Tom",
    "email": "tom@odds.team",
    "content": "ทำ automate test ของ set settement bank, ทำ automate test ของ generate paid transaction, sprint review, sprint retro"
  }
];

let expectData = {
  "id": 14959815,
  "year": 2025,
  "month": 7,
  "weekOfMonth": null,
  "weekOfYear": 31,
  "empId": "1000588",
  "employeeName": null,
  "projectName": "จ้าง Outsource โครงการ FundConnext ประจำปี 2025",
  "status": "PENDING_REVIEW",
  "reviewer": "01351",
  "approval": "01070",
  "days": [{
    "dayOfWeekNo": 5,
    "date": "2025-08-01",
    "daily": "FULL_DAY",
    "remark": "ทำ log rotation ของ airflow"
  }, {"dayOfWeekNo": 6, "date": "2025-08-02", "daily": "WEEK_END", "remark": null}, {
    "dayOfWeekNo": 0,
    "date": "2025-08-03",
    "daily": "WEEK_END",
    "remark": null
  }, {
    "dayOfWeekNo": 1,
    "date": "2025-08-04",
    "daily": "FULL_DAY",
    "remark": "refinement, แก้ jasper report dividend transaction, reset finnet data สำหรับ registar"
  }, {
    "dayOfWeekNo": 2,
    "date": "2025-08-05",
    "daily": "FULL_DAY",
    "remark": "update bank code/ bank account ตอน approve สำหรับกรณี payment type QR_SA, ช่วยทีมดูว่าทำไม message queue ไม่ถูกโยนเข้า Deadletter queue, check rotate log ของ airflow"
  }, {
    "dayOfWeekNo": 3,
    "date": "2025-08-06",
    "daily": "FULL_DAY",
    "remark": "criteria ปรับ allotted transaction upload file กรณีที่ upload รายการ Registrar ATS_SA แล้วแก้เป็น ATS_AMC (FINNET) , หาสาเหตุ ไม่สามารถ subbmit รายการ payment type CHEQ_AMC ได้หลังจากที่ทำรายการสำเร็จในครั้งแรก"
  }, {
    "dayOfWeekNo": 4,
    "date": "2025-08-07",
    "daily": "FULL_DAY",
    "remark": "ทำ e2e test, code review"
  }, {
    "dayOfWeekNo": 5,
    "date": "2025-08-08",
    "daily": "FULL_DAY",
    "remark": "automate test, sprint review, retro"
  }, {"dayOfWeekNo": 6, "date": "2025-08-09", "daily": "WEEK_END", "remark": null}, {
    "dayOfWeekNo": 0,
    "date": "2025-08-10",
    "daily": "WEEK_END",
    "remark": null
  }, {"dayOfWeekNo": 1, "date": "2025-08-11", "daily": "HOLIDAY", "remark": null}, {
    "dayOfWeekNo": 2,
    "date": "2025-08-12",
    "daily": "HOLIDAY",
    "remark": null
  }, {
    "dayOfWeekNo": 3,
    "date": "2025-08-13",
    "daily": "FULL_DAY",
    "remark": "sprint planning part 1 & 2"
  }, {
    "dayOfWeekNo": 4,
    "date": "2025-08-14",
    "daily": "FULL_DAY",
    "remark": "ทำ api สำหรับดึงข้อมูล tmf investment by year , refactor api tax balance"
  }, {
    "dayOfWeekNo": 5,
    "date": "2025-08-15",
    "daily": "FULL_DAY",
    "remark": "code review, ทำ api สำหรับดึงข้อมูล tmf investment by year , refactor api tax-platform"
  }, {"dayOfWeekNo": 6, "date": "2025-08-16", "daily": "WEEK_END", "remark": null}, {
    "dayOfWeekNo": 0,
    "date": "2025-08-17",
    "daily": "WEEK_END",
    "remark": null
  }, {
    "dayOfWeekNo": 1,
    "date": "2025-08-18",
    "daily": "FULL_DAY",
    "remark": "api preview account balance report, api preview confirmatin note report, refinement"
  }, {
    "dayOfWeekNo": 2,
    "date": "2025-08-19",
    "daily": "FULL_DAY",
    "remark": "api preview confirmation note report, เช็ค error ที่เกิดจาก queue ค้าง, หาสาเหตุ unit test report server พัง (เกิดจาก build จาก jasper ผิด version)"
  }, {
    "dayOfWeekNo": 3,
    "date": "2025-08-20",
    "daily": "FULL_DAY",
    "remark": "รับ parameter ชั่วคราว สำหรับ tmf investment by year ระหว่างรอ final spec, refactor code, code review, เพิ่ม code กรณี send notification error เกิน 3 ครั้งจะหยุด retry และ log critical"
  }, {
    "dayOfWeekNo": 4,
    "date": "2025-08-21",
    "daily": "FULL_DAY",
    "remark": "run automate, e2e job set settlement"
  }, {
    "dayOfWeekNo": 5,
    "date": "2025-08-22",
    "daily": "FULL_DAY",
    "remark": "ทำ automate test ของ set settement bank, ทำ automate test ของ generate paid transaction, sprint review, sprint retro"
  }, {"dayOfWeekNo": 6, "date": "2025-08-23", "daily": "WEEK_END", "remark": null}, {
    "dayOfWeekNo": 0,
    "date": "2025-08-24",
    "daily": "WEEK_END",
    "remark": null
  }, {"dayOfWeekNo": 1, "date": "2025-08-25", "daily": "NOT_SELECT", "remark": null}, {
    "dayOfWeekNo": 2,
    "date": "2025-08-26",
    "daily": "NOT_SELECT",
    "remark": null
  }, {"dayOfWeekNo": 3, "date": "2025-08-27", "daily": "NOT_SELECT", "remark": null}, {
    "dayOfWeekNo": 4,
    "date": "2025-08-28",
    "daily": "NOT_SELECT",
    "remark": null
  }, {"dayOfWeekNo": 5, "date": "2025-08-29", "daily": "NOT_SELECT", "remark": null}, {
    "dayOfWeekNo": 6,
    "date": "2025-08-30",
    "daily": "WEEK_END",
    "remark": null
  }, {"dayOfWeekNo": 0, "date": "2025-08-31", "daily": "WEEK_END", "remark": null}],
  "comment": null,
  "vendor": "Odd-e (Thailand)",
  "type": "IT_OUTSOURCE"
};

test("mergeTimesheet should map basecamp content into initialTimeSheetData correctly", () => {
  initialTimeSheetData.days.forEach(day => day.date = new Date(day.date));
  basecampTimesheetData.forEach((day) => day.createdAt = new Date(day.createdAt));
  expectData.days.forEach(day => day.date = new Date(day.date));

  const result = mergeTimesheet(initialTimeSheetData, basecampTimesheetData);

  assert.deepEqual(result, expectData);
});


