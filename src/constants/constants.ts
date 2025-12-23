import type { QuestionBank } from '../types/types';
import scriptContent from '../assets/script.js?raw';
import PYTHON_BANK_QUESTIONS from '../assets/data/Python.json';
import WEB_BANK_QUESTIONS from '../assets/data/web前端.json';
import SYSTEM_BANK_QUESTIONS from '../assets/data/操作系统.json'
import DPJ1 from '../assets/data/单片机/1-单片机基础知识.json'
import DPJ2 from '../assets/data/单片机/2-单片机C语言编程基础.json'
import DPJ3 from '../assets/data/单片机/3-IIO口的C语言编程.json'
import DPJ4 from '../assets/data/单片机/4-中断定时计数器串口C语言编程.json'
import DPJ5 from '../assets/data/单片机/5-LCD1602显示屏和AD、DA转换.json'
import DPJ7 from '../assets/data/单片机/7-总线.json'
import DPJ8 from '../assets/data/单片机/8-温度传感器.json'
import AlgorithmAnalysisAndDesign from '../assets/data/算法分析选择题.json'
// import DPJChooice_HG from '../assets/data/友情赞助/湖工—单片机.json'
// import DPJAdjustment_HG from '../assets/data/友情赞助/湖工—判断题.json'
import DPJSummary from '../assets/data/单片机2025复习题/单片机复习题2025选择判断填空.json'

export const USERSCRIPT_CONTENT = `// ==UserScript==
// @name         Chaoxing Work Scraper
// @namespace    cx-work-scraper
// @version      1.3.0
// @description  提取超星作业页题目与选项，导出JSON/CSV
// @match        *://*.chaoxing.com/*work/dowork*
// @match        *://*.chaoxing.com/*exam*
// @all-frames   true
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
  /* ... Please use the full script from the copy button ... */
})();
`;

export const FULL_USERSCRIPT = scriptContent;

export const DEFAULT_BANKS: QuestionBank[] = [
  {
    id: 'default-python',
    name: 'Python程序设计',
    createdAt: 1765262408306,
    questions: PYTHON_BANK_QUESTIONS
  }
  ,
  {
    id: 'default-web',
    name: 'Web前端开发',
    createdAt: 1765250719562,
    questions: WEB_BANK_QUESTIONS
  },
  {
    id: 'default-system',
    name: '操作系统',
    createdAt: 1765255903193,
    questions: SYSTEM_BANK_QUESTIONS
  },
  {
    id: 'default-system',
    name: '单片机1-基础知识',
    createdAt: 1765255903193,
    questions: DPJ1
  },
  {
    id: 'default-system',
    name: '单片机2-C语言编程基础',
    createdAt: 1765255903193,
    questions: DPJ2
  },
  {
    id: 'default-system',
    name: '单片机3-IO口的C语言编程',
    createdAt: 1765255903193,
    questions: DPJ3
  },
  {
    id: 'default-system',
    name: '单片机4-中断定时计数器串口C语言编程',
    createdAt: 1765255903193,
    questions: DPJ4
  },
  {
    id: 'default-system',
    name: '单片机5-LCD1602显示屏和AD、DA转换',
    createdAt: 1765255903193,
    questions: DPJ5
  },
  {
    id: 'default-system',
    name: '单片机7-总线',
    createdAt: 1765255903193,
    questions: DPJ7
  },
  {
    id: 'default-system',
    name: '单片机8-温度传感器',
    createdAt: 1765255903193,
    questions: DPJ8
  },
  {
    id: 'default-system',
    name: '算法分析选择、判断题',
    createdAt: 1765255903193,
    questions: AlgorithmAnalysisAndDesign
  },
  // {
  //   id: 'default-system',
  //   name: '[赞助]湖工—单片机选择题',
  //   createdAt: 1765255903193,
  //   questions: DPJChooice_HG
  // },
  // {
  //   id: 'default-system',
  //   name: '[赞助]湖工—单片机判断题',
  //   createdAt: 1765255903193,
  //   questions: DPJAdjustment_HG
  // },
  {
    id: 'default-system',
    name: '单片机复习题2025选择判断填空',
    createdAt: 1765255903193,
    questions: DPJSummary
  }

];