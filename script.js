const USERSCRIPT = // ==UserScript==
// @name         Chaoxing Work Scraper
// @namespace    cx-work-scraper
// @version      1.4.0
// @description  提取超星作业页题目与选项，导出JSON/CSV
// @match        *://*.chaoxing.com/*work/dowork*
// @match        *://*.chaoxing.com/*exam*
// @match        *://*.chaoxing.com/*work/dowork*
// @match        *://*.chaoxing.com/*exam*
// @match        *://*.chaoxing.com/*work/view*
// @match        *://*.chaoxing.com/exam-ans*
// @match        *://*.chaoxing.com/*/test/*
// @match        *://*.chaoxing.com/*paper*
// @all-frames   true
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
  const normalizeText = s => (s || "").replace(/\s+/g, " ").trim();
  const sanitizeAnswerText = s => {
    let t = normalizeText(s || "");
    t = t.replace(/(?:^|\s)(?:正确答案|标准答案|参考答案|Correct\s*Answer)\s*[:：]/gi, " ");
    t = t.replace(/(?:^|\s)(?:我的答案|My\s*Answer)\s*[:：]/gi, " ");
    t = t.replace(/^第?\s*\d+\s*空[:：]?\s*/i, "");
    t = t.replace(/^[（(]?\d+[)）]\s*/, "");
    return normalizeText(t);
  };
  const getQuestionTitle = box => {
    const sel = [".subject",".stem",".title",".qTitle",".des",".topic",".problem",".quest-title",".quesTitle",".queTitle"];
    for (const q of sel) { const el = box.querySelector(q); if (el) return normalizeText(el.textContent); }
    const h = box.querySelector("h1,h2,h3,.hd,.head,.tt"); if (h) return normalizeText(h.textContent);
    const c = box.cloneNode(true); c.querySelectorAll("input,textarea,select,script,style").forEach(e=>e.remove()); return normalizeText(c.textContent);
  };
  const detectType = box => {
    // 优先从容器属性判断（work/dowork 页面：questionLi[typename="单选题|多选题|判断题|填空题"]）
    const attrType = (box.getAttribute('typename') || box.getAttribute('typname') || '').trim();
    if (attrType) {
      if (/多选/.test(attrType)) return "多选";
      if (/单选/.test(attrType)) return "单选";
      if (/判断/.test(attrType)) return "判断";
      if (/填空/.test(attrType)) return "填空";
    }
    if (box.querySelector('input[type="radio"]')) return "单选";
    if (box.querySelector('input[type="checkbox"]')) return "多选";
    if (box.querySelector('div[role="checkbox"]')) return "多选";
    if (box.querySelector('div[role="radio"], [onclick*="addChoice"]')) return "单选";
    // 视图页：选项以 .answerBg/.workTextWrap 呈现，无输入控件
    const hasViewOpts = box.querySelector('.answerBg.workTextWrap, .workTextWrap.answerBg, span.num_option') && box.querySelector('.answer_p');
    if (hasViewOpts) {
      const title = normalizeText(box.textContent);
      if (/[多選题|多选题]/.test(title)) return "多选";
      return "单选";
    }
    if (box.querySelector('input[type="text"], textarea')) return "填空";
    const t = normalizeText(box.textContent); if (/判断|对错/.test(t)) return "判断"; return "未知";
  };
  const extractImages = box => Array.from(new Set(Array.from(box.querySelectorAll("img")).map(img => img.src).filter(Boolean)));
  const optionNodesFromInputs = box => {
    const inputs = Array.from(box.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
    const nodes = inputs.map(input => input.closest('li, dd, .option, .opt, .answer, .ui-radio, .ui-checkbox, label, div') || input.parentElement || input);
    const uniq = []; const seen = new Set();
    for (const n of nodes) { if (!seen.has(n)) { uniq.push(n); seen.add(n); } }
    return uniq;
  };
  const choiceNodesViaRole = box => {
    const n1 = Array.from(box.querySelectorAll('div[role="radio"], div[role="checkbox"]'));
    const n2 = Array.from(box.querySelectorAll('.workTextWrap.answerBg, .answerBg'));
    const n3 = Array.from(box.querySelectorAll('[onclick*="addChoice"]'));
    const nodes = [...n1, ...n2, ...n3].filter(n => n.querySelector('.answer_p, span.num_option') || n.getAttribute('aria-label'));
    const uniq = []; const seen = new Set();
    for (const n of nodes) { if (!seen.has(n)) { uniq.push(n); seen.add(n); } }
    return uniq;
  };
  const readOptionLabel = node => {
    const s = node.querySelector('span.num_option');
    if (s) return s.getAttribute('data') || (normalizeText(s.textContent).replace(/[^A-Z]/g,'').charAt(0) || "");
    const aria = node.getAttribute('aria-label') || "";
    const m = aria.match(/^[A-Z]/);
    return m ? m[0] : "";
  };
  const readOptionText = node => {
    const direct = node.querySelector('.answer_p p, .answer_p');
    if (direct) return normalizeText(direct.textContent);
    const aria = node.getAttribute('aria-label');
    if (aria) return normalizeText(aria.replace(/^([A-Z])\s*/, '').replace(/选择$/, ''));
    const target = node.querySelector('label, .label, .optText, .optionTxt, .txt, .content, p, span, i') || node;
    const clone = target.cloneNode(true);
    clone.querySelectorAll('input, script, style, span.num_option').forEach(e => e.remove());
    return normalizeText(clone.textContent);
  };
  const extractOptions = box => {
    const nodes = [...optionNodesFromInputs(box), ...choiceNodesViaRole(box)];
    const uniq = []; const seen = new Set();
    for (const n of nodes) { if (!seen.has(n)) { uniq.push(n); seen.add(n); } }
    // 若当前 box 本身就是某个选项节点，扩展为其同级所有选项
    if (uniq.length <= 1 && nodes.length === 0) {
      // 尝试直接从视图页结构收集兄弟选项
      const sibs = Array.from((box.parentElement || box).querySelectorAll('.workTextWrap.answerBg, .answerBg, div[role="radio"], div[role="checkbox"], [onclick*="addChoice"]'));
      if (sibs.length >= 2) {
        const sSeen = new Set();
        const expanded = [];
        sibs.forEach(el => { if (!sSeen.has(el)) { sSeen.add(el); expanded.push(el); } });
        expanded.forEach(el => { if (!seen.has(el)) { uniq.push(el); seen.add(el); } });
      }
    }
    if (!uniq.length) {
      const oc = box.querySelector('.answers,.opts,.optionUl,.optionList,.options,.xuanxiang,.answerArea,.optList,.selectOptions, ul');
      if (!oc) return [];
      const fallbackItems = oc.querySelectorAll('li, .opt, .option, .answer');
      return Array.from(fallbackItems).map((li, idx) => {
        const text = readOptionText(li);
        const label = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(idx) || "";
        return text ? { label, text } : null;
      }).filter(Boolean);
    }
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const opts = uniq.map((n, idx) => {
      const text = readOptionText(n);
      if (!text) return null;
      const label = readOptionLabel(n) || (letters[idx] || "");
      return { label, text };
    }).filter(Boolean);

    // 去重：同一题中按 label+text 唯一
    const map = new Map();
    opts.forEach(o => {
      const key = `${o.label}|${o.text}`;
      if (!map.has(key)) map.set(key, o);
    });
    return Array.from(map.values());
  };
  const extractSelected = box => {
    const roleNodes = choiceNodesViaRole(box);
    if (roleNodes.length) {
      const sel = roleNodes.filter(n => (n.getAttribute('aria-checked') === 'true') || /\b(on|selected|active|checked)\b/.test(n.className));
      const texts = sel.map(readOptionText).filter(Boolean);
      if (texts.length) return texts;
    }
    const radios = Array.from(box.querySelectorAll('input[type="radio"]:checked'));
    const checks = Array.from(box.querySelectorAll('input[type="checkbox"]:checked'));
    const textOf = input => {
      const node = input.closest('li, dd, .option, .opt, .answer, .ui-radio, .ui-checkbox, label, div') || input.parentElement || input;
      return readOptionText(node);
    };
    if (radios.length) return radios.map(textOf).filter(Boolean);
    if (checks.length) return checks.map(textOf).filter(Boolean);
    const inputs = Array.from(box.querySelectorAll('input[type="text"], textarea')).map(i => normalizeText(i.value));
    const editables = Array.from(box.querySelectorAll('[contenteditable="true"], .contenteditable, .richTextEditor, .ueditor, .editor'))
      .map(el => normalizeText(el.textContent))
      .filter(Boolean);
    const selectedByText = (() => {
      // 特殊页面：mark_answer 区块
      const block = box.querySelector('.mark_answer') || box.closest('.questionLi')?.querySelector('.mark_answer');
      if (block) {
        const txt = normalizeText(block.textContent);
        const m = txt.match(/(?:我的答案|My\s*Answer)\s*[:：]\s*(.+?)(?=\s+(?:正确答案|标准答案|参考答案|Correct\s*Answer)\s*[:：]|$)/i);
        if (m && m[1]) return [normalizeText(m[1])];
      }
      const getNearbyText = () => {
        const segs = [];
        const push = el => { if (el) { const t = normalizeText(el.textContent || ''); if (t) segs.push(t); } };
        push(box);
        push(box.nextElementSibling);
        push(box.parentElement);
        push(box.parentElement && box.parentElement.nextElementSibling);
        return segs.join(' ');
      };
      const raw = getNearbyText();
      const m = raw.match(/(?:我的答案|My\\s*Answer)\\s*[:：]\\s*(.+?)(?=\\s+(?:正确答案|标准答案|参考答案|Correct\\s*Answer)\\s*[:：]|$)/i);
      if (m && m[1]) return [normalizeText(m[1])];
      const cand = box.querySelector('.myAnswer,.userAnswer,.answerMine,.answer-user');
      if (cand) {
        const t = normalizeText(cand.textContent);
        const mm = t.match(/(?:我的答案|My\s*Answer)\s*[:：]\s*(.+?)(?=\s+(?:正确答案|标准答案|参考答案|Correct\s*Answer)\s*[:：]|$)/i);
        if (mm && mm[1]) return [normalizeText(mm[1])];
        if (t) {
          const s = sanitizeAnswerText(t);
          if (s) return [s];
        }
      }
      return [];
    })();
    return [...inputs.filter(Boolean), ...editables, ...selectedByText];
  };
  const extractStdAnswerByText = box => {
    // 特殊页面：mark_answer 区块
    const block = box.querySelector('.mark_answer') || box.closest('.questionLi')?.querySelector('.mark_answer');
    if (block) {
      const txt = normalizeText(block.textContent);
      let m = txt.match(/(?:正确答案|标准答案|参考答案|Correct\s*Answer)\s*[:：]\s*(.+?)(?=\s+(?:我的答案|My\s*Answer)\s*[:：]|$)/i);
      if (m && m[1]) return [sanitizeAnswerText(m[1])];
    }
    const getNearbyText = () => {
      const segs = [];
      const push = el => { if (el) { const t = normalizeText(el.textContent || ''); if (t) segs.push(t); } };
      push(box);
      push(box.nextElementSibling);
      push(box.parentElement);
      push(box.parentElement && box.parentElement.nextElementSibling);
      return segs.join(' ');
    };
    const text = getNearbyText();
    {
      const m = text.match(/(?:正确答案|标准答案|参考答案|Correct\s*Answer)\s*[:：]\s*(.+?)(?=\s+(?:我的答案|My\s*Answer)\s*[:：]|$)/i);
      if (m && m[1]) return [sanitizeAnswerText(m[1])];
    }
    const cand = box.querySelector(".rightAnswer,.standardAnswer,.answerRight,.correctAnswer,.RightAnswer,.answer-correct");
    if (cand) {
      const t = normalizeText(cand.textContent);
      if (t) {
        const mm = t.match(/(?:正确答案|标准答案|参考答案|Correct\s*Answer)\s*[:：]\s*(.+?)(?=\s+(?:我的答案|My\s*Answer)\s*[:：]|$)/i);
        if (mm && mm[1]) return [sanitizeAnswerText(mm[1])];
        return [sanitizeAnswerText(t)];
      }
    }
    return [];
  };
  const isQuestionBox = el => {
    const hasInputs = el.querySelector('input[type="radio"], input[type="checkbox"], input[type="text"], textarea');
    const hasRoleChoice = el.querySelector('div[role="radio"], div[role="checkbox"], .workTextWrap.answerBg, [onclick*="addChoice"]');
    const hasAnswer = el.querySelector('.rightAnswer,.standardAnswer,.answerRight,.correctAnswer');
    const hasQid = el.querySelector('[qid]');
    // 仅当存在交互或答案或 qid 时才认为是题块，避免把试卷标题等误识别为题目
    return !!(hasInputs || hasRoleChoice || hasAnswer || hasQid);
  };
  const collectBoxes = () => {
    const sels = [".questionLi",".TiMu",".queBox",".examItem",".workQuestion",".quesItem",".problemItem",".questItem"];
    let boxes = [];
    for (const s of sels) boxes = boxes.concat(Array.from(document.querySelectorAll(s)));

    // 优先按 qid 分组（每题唯一），防止整页容器被误识别
    const qidMap = new Map();
    const qidNodes = Array.from(document.querySelectorAll('[qid]'));
    qidNodes.forEach(el => {
      const qid = el.getAttribute('qid');
      if (!qid) return;
      let box = el.closest('.TiMu,.questionLi,.examItem,.workQuestion,.quesItem,.problemItem,.questItem');
      if (!box) box = el;
      if (!qidMap.has(qid)) qidMap.set(qid, box);
    });

    // 对选择题 DOM（role=radio/checkbox 和 .workTextWrap.answerBg）做兜底分组
    const choiceDom = Array.from(document.querySelectorAll('div[role="radio"], div[role="checkbox"], .workTextWrap.answerBg'));
    choiceDom.forEach(el => {
      let box = el.closest('.TiMu,.questionLi,.examItem,.workQuestion,.quesItem,.problemItem,.questItem');
      if (!box) box = el.parentElement || el;
      boxes.push(box);
    });

    // 文本输入题兜底分组
    const textInputs = Array.from(document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]'));
    textInputs.forEach(el => {
      let box = el.closest('.TiMu,.questionLi,.examItem,.workQuestion,.quesItem,.problemItem,.questItem');
      if (!box) box = el.parentElement || el;
      boxes.push(box);
    });

    // 合并：qid 分组优先，其次按容器唯一去重
    const fromQid = Array.from(qidMap.values());
    const raw = fromQid.concat(boxes);
    const uniq = []; const seen = new Set();
    for (const b of raw) { if (b && !seen.has(b)) { uniq.push(b); seen.add(b); } }

    if (!uniq.length) {
      // 最后兜底：避免整页容器，限定必须包含选择 DOM 或输入
      const fallback = Array.from(document.querySelectorAll('div,section,article')).filter(isQuestionBox);
      const out = []; const s2 = new Set();
      for (const b of fallback) { if (!s2.has(b)) { out.push(b); s2.add(b); } }
      return out;
    }
    return uniq;
  };
  const extractQuestion = (box, idx) => {
    const selectedRaw = extractSelected(box);
    const stdAnsRaw = extractStdAnswerByText(box);
    const options = extractOptions(box);
    const htmlToText = v => {
      if (typeof v !== 'string') return v;
      const div = document.createElement('div');
      div.innerHTML = v;
      return normalizeText(div.textContent || v);
    };
    const clean = arr => Array.from(new Set(arr.map(htmlToText).filter(Boolean)));
    const selected = Array.from(new Set(clean(selectedRaw).map(sanitizeAnswerText).filter(Boolean)));
    const stdAns = Array.from(new Set(clean(stdAnsRaw).map(sanitizeAnswerText).filter(Boolean)));
    const mapAnswerToText = (opts, answers) => {
      if (!answers || !answers.length) return [];
      const map = new Map();
      opts.forEach(o => map.set(String(o.label).trim(), String(o.text).trim()));
      const out = [];
      answers.forEach(a => {
        let s = String(a).trim();
        // 联合字母如 'ABCD'
        if (/^[A-Z]+$/.test(s) && s.length > 1) {
          s.split('').forEach(ch => {
            if (map.has(ch)) out.push(map.get(ch));
          });
          return;
        }
        // 前导字母如 'B.'、'B项'、'B、'
        const m = s.match(/^([A-Z])(?:[\\.、项\\s])?/);
        if (m && map.has(m[1])) {
          out.push(map.get(m[1]));
          return;
        }
        // 真假值映射（判断题）
        if (map.has(s)) {
          out.push(map.get(s));
          return;
        }
        // 若本身就是文本
        out.push(s);
      });
      return Array.from(new Set(out.filter(Boolean)));
    };
    const selectedText = mapAnswerToText(options, selected);
    const stdText = mapAnswerToText(options, stdAns);
    const finalCorrect = stdText.length ? stdText : selectedText.length ? selectedText : stdAns.length ? stdAns : selected;

    return {
      id: idx + 1,
      type: detectType(box),
      title: getQuestionTitle(box),
      options,
      correctAnswer: finalCorrect,
      selectedAnswer: selectedText.length ? selectedText : selected,
      images: extractImages(box)
    };
  };
  const isValidQuestion = q => {
    const hasOpts = Array.isArray(q.options) && q.options.length >= 2;
    const hasAns = Array.isArray(q.correctAnswer) && q.correctAnswer.length > 0;
    const hasSel = Array.isArray(q.selectedAnswer) && q.selectedAnswer.length > 0;
    const typeOk = q.type === '单选' || q.type === '多选' || q.type === '判断' || q.type === '填空';
    const t = (q.title || '').trim();
    const headers = (() => {
      const set = new Set();
      const sels = 'h1,h2,.paperTitle,.examTitle,.topTit,.header-title,.examName';
      document.querySelectorAll(sels).forEach(el => { const tx = normalizeText(el.textContent); if (tx) set.add(tx); });
      const dt = normalizeText(document.title); if (dt) set.add(dt);
      return set;
    })();
    if (headers.has(t)) return false;
    const looksLikeHeader = /试卷|期末|复习题|考试|作业|章节|题库$/.test(t) && !hasOpts && !hasAns && !hasSel;
    if (looksLikeHeader) return false;
    if (q.type === '填空') return (hasSel || hasAns || t.length > 0);
    return typeOk && (hasOpts || hasAns || hasSel);
  };
  const scanQuestions = () => collectBoxes().map((b, i) => extractQuestion(b, i)).filter(isValidQuestion);
  const toCSV = data => {
    const esc = s => `"${String(s).replace(/"/g,'""')}"`;
    const rows = [["题号","题型","题目","选项","正确答案","用户答案","图片"]];
    data.forEach(q => { const opts = (q.options||[]).map(o=>`${o.label}.${o.text}`).join(" | "); const std = (q.correctAnswer||[]).join(" | "); const sel = (q.selectedAnswer||[]).join(" | "); const imgs = (q.images||[]).join(" | "); rows.push([q.id,q.type,q.title,opts,std,sel,imgs]); });
    return rows.map(r => r.map(esc).join(",")).join("\n");
  };
  const download = (filename, content, type="application/json") => {
    if (typeof GM_download === "function") { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); GM_download({ url, name: filename }); setTimeout(()=>URL.revokeObjectURL(url), 10000); return; }
    const a = document.createElement("a"); a.download = filename; a.href = URL.createObjectURL(new Blob([content], { type })); document.body.appendChild(a); a.click(); a.remove();
  };
  const ensureUI = () => {
    if (document.getElementById("cx-scraper-panel")) return;
    const wrap = document.createElement("div"); wrap.id = "cx-scraper-panel";
    wrap.innerHTML = `<button data-act="copy">复制JSON</button><button data-act="json">下载JSON</button><button data-act="csv">下载CSV</button><button data-act="rescan">重新扫描</button>`;
    document.body.appendChild(wrap);
    GM_addStyle(`#cx-scraper-panel{position:fixed;right:16px;bottom:16px;z-index:99999;background:#111a;color:#fff;padding:10px;border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,.3);display:flex;gap:8px;flex-wrap:wrap}#cx-scraper-panel button{background:#2b6;color:#fff;border:none;padding:6px 10px;border-radius:6px;cursor:pointer}#cx-scraper-panel button:hover{background:#1a4}`);
    wrap.addEventListener("click", e => {
      const btn = e.target.closest("button"); if (!btn) return;
      const act = btn.getAttribute("data-act"); const data = scanQuestions();
      if (act === "copy") { const json = JSON.stringify({ source: location.href, ts: Date.now(), items: data }, null, 2); if (typeof GM_setClipboard === "function") GM_setClipboard(json); else navigator.clipboard && navigator.clipboard.writeText(json); }
      else if (act === "json") { const json = JSON.stringify({ source: location.href, ts: Date.now(), items: data }, null, 2); download(`chaoxing_work_${Date.now()}.json`, json, "application/json"); }
      else if (act === "csv") { const csv = toCSV(data); download(`chaoxing_work_${Date.now()}.csv`, csv, "text/csv"); }
    });
    GM_registerMenuCommand("打开面板", () => wrap.style.display = "flex");
  };
  const ready = () => { if (document.body) { ensureUI(); } else { const t = setInterval(()=>{ if (document.body){ clearInterval(t); ensureUI(); } }, 200); } };
  ready();
})();


export default USERSCRIPT;
