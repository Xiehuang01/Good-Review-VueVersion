import json
import re

input_file = "湖工—判断题.txt"
output_file = "湖工—判断题.json"

with open(input_file, "r", encoding="utf-8") as f:
    text = f.read()

# 按题号切分
blocks = re.split(r"\n(?=\d+、)", text)

result = []

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

    # 答案
    answer_match = re.search(r"答案：\s*(正确|错误)", block)
    if not answer_match:
        continue

    answer_text = "对" if answer_match.group(1) == "正确" else "错"

    item = {
        "id": qid,
        "type": "判断",
        "title": f"{qid}. (判断题) {title}",
        "options": [
            {
                "label": "true",
                "text": "对"
            },
            {
                "label": "false",
                "text": "错"
            }
        ],
        "correctAnswer": [
            answer_text
        ],
        "selectedAnswer": [
            answer_text
        ],
        "images": []
    }

    result.append(item)

# 输出 JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"转换完成，共生成 {len(result)} 道判断题")
