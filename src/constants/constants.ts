import type { QuestionBank } from '../types/types';
import scriptContent from '../assets/script.js?raw';
import PYTHON_BANK_QUESTIONS from '../assets/data/Python.json';
import WEB_BANK_QUESTIONS from '../assets/data/web前端.json';
import SYSTEM_BANK_QUESTIONS from '../assets/data/操作系统.json'

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
  }
];