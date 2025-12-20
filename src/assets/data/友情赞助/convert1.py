import json
import re

input_file = "湖工—单片机.txt"
output_file = "湖工—单片机.json"

with open(input_file, "r", encoding="utf-8") as f:
    text = f.read()

# 按题号切分
blocks = re.split(r"\n(?=\d+、)", text)

questions = []

for block in blocks:
    block = block.strip()
    if not block:
        continue

    # 题号 + 题干
    title_match = re.match(r"(\d+)、(.+)", block)
    if not title_match:
        continue

    qid = int(title_match.group(1))
    title = title_match.group(2).strip()

    # 选项
    options = []
    for label in ["A", "B", "C", "D"]:
        opt_match = re.search(rf"{label}、\s*(.+)", block)
        if opt_match:
            options.append({
                "label": label,
                "text": opt_match.group(1).strip()
            })

    # 正确答案
    answer_match = re.search(r"答案：\s*([A-D])", block)
    if not answer_match:
        continue

    correct_label = answer_match.group(1)
    correct_text = next(
        (o["text"] for o in options if o["label"] == correct_label),
        ""
    )

    questions.append({
        "id": qid,
        "type": "单选",
        "title": f"{qid}. (单选题) {title}",
        "options": options,
        "correctAnswer": [correct_text],
        "selectedAnswer": [correct_text],
        "images": []
    })

# 输出 JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"转换完成，共生成 {len(questions)} 道题 → {output_file}")