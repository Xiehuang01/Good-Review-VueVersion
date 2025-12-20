

export type Language = 'en' | 'cn';

export const translations = {
  en: {
    common: {
      confirm: "Confirm",
      cancel: "Cancel",
      delete: "Delete"
    },
    app: {
      title: "Good Review",
      nav: {
        guide: "Guide",
        import: "Import",
        banks: "Banks"
      },
      settings: {
        title: "Settings",
        background: "Background Settings",
        resetBackground: "Reset Background",
        uploadImage: "Upload Background Image",
        uploadImageDesc: "Support images under 10MB",
        removeImage: "Remove Background Image",
        glassBlur: "Glass Blur Effect",
        blurLight: "Light",
        blurStrong: "Strong",
        blurIntensity: "Intensity",
        fileSizeError: "Image file size cannot exceed 10MB",
        fileTypeError: "Please select an image file",
        imageTooLarge: "Image is too large even after compression. Please select a smaller image.",
        processingError: "Failed to process image: "
      }
    },
    guide: {
      title: "Start Your",
      titleHighlight: "Good Review",
      subtitle: "Fresh way to study. Grab quiz data from your course and start reviewing in style.",
      step1: {
        title: "Install Script",
        desc: "You need a userscript manager like Tampermonkey installed.",
        copy: "Copy Code",
        copied: "Copied!",
        tip: "Create new script & paste code."
      },
      step2: {
        title: "Extract Data",
        goto: "Go to Course Page",
        gotoDesc: "Open your Chaoxing homework/exam page.",
        panel: "Use Panel",
        panelDesc: "Click 'Copy JSON' on the floating panel.",
        import: "Import Here",
        importDesc: "Paste the data in the Import tab.",
        tipBox: "Pro Tip: Works best on graded homework pages."
      }
    },
    import: {
      title: "Feed the Monster",
      subtitle: "It's hungry for knowledge! Drop a JSON file or paste text.",
      nameLabel: "Name Tag (Optional)",
      namePlaceholder: "Give this meal a name...",
      optional: "(Optional)",
      jsonLabel: "The Mouth",
      btnText: "Feed It!",
      btnFile: "Upload File",
      errorJson: "Yuck! Invalid JSON. Missing 'items'.",
      errorParse: "Blegh! Can't digest this text.",
      success: "Burp! Delicious!",
      dragDrop: "Drop it here!",
      eating: "Nom nom nom..."
    },
    dashboard: {
      title: "My Reviews",
      emptyTitle: "Nothing Here Yet",
      emptyDesc: "Import some questions to start your Good Review journey.",
      questions: "Questions",
      btnPractice: "Review Now",
      btnExam: "Mock Exam",
      btnDelete: "Remove",
      deleteConfirmTitle: "Delete Review?",
      deleteConfirm: "This action cannot be undone.",
      setupTitle: "Practice Setup",
      setupDesc: "This bank is large. Choose specific question types to focus on.",
      selectAll: "Select All",
      startFiltered: "Start Practice",
      selectedCount: "Selected"
    },
    quiz: {
      exit: "Quit",
      typePlaceholder: "Your answer...",
      check: "Check Answer",
      correct: "Spot On!",
      incorrect: "Not Quite",
      correctAnswer: "Answer:",
      prev: "Prev",
      next: "Next",
      finish: "Finish",
      hide: "Hide",
      show: "Show",
      results: {
        title: "Session Complete",
        perfectTitle: "Perfect Score!",
        statsCorrect: "Correct",
        statsWrong: "Incorrect",
        btnRetry: "Retry Mistakes",
        btnDashboard: "Back to Dashboard",
        msgPerfect: "Amazing! You mastered these questions.",
        msgKeepGoing: "Practice makes perfect. Review your mistakes to improve.",
        allClear: "All Clear! No more mistakes."
      }
    }
  },
  cn: {
    common: {
      confirm: "确认",
      cancel: "取消",
      delete: "删除"
    },
    app: {
      title: "Good Review",
      nav: {
        guide: "指南",
        import: "导入",
        banks: "题库"
      },
      settings: {
        title: "设置",
        background: "背景设置",
        resetBackground: "重置背景色",
        uploadImage: "上传背景图片",
        uploadImageDesc: "支持10MB以下图片",
        removeImage: "移除背景图片",
        glassBlur: "毛玻璃模糊效果",
        blurLight: "轻微",
        blurStrong: "强烈",
        blurIntensity: "模糊强度",
        fileSizeError: "图片文件大小不能超过10MB",
        fileTypeError: "请选择图片文件",
        imageTooLarge: "图片太大，即使压缩后仍无法保存。请选择更小的图片。",
        processingError: "处理图片失败："
      }
    },
    guide: {
      title: "开启你的",
      titleHighlight: "Good Review",
      subtitle: "焕然一新的复习体验。从课程网站提取数据，即刻开始。",
      step1: {
        title: "安装脚本",
        desc: "请确保浏览器已安装 Tampermonkey (油猴) 插件。",
        copy: "复制脚本",
        copied: "已复制！",
        tip: "新建脚本并粘贴代码。"
      },
      step2: {
        title: "提取数据",
        goto: "打开课程",
        gotoDesc: "前往超星/学习通作业或考试页面。",
        panel: "使用面板",
        panelDesc: "点击右下角悬浮窗的“复制JSON”。",
        import: "导入数据",
        importDesc: "在“导入”页粘贴数据。",
        tipBox: "提示：脚本会将你的答案作为题目答案。"
      },
    },
    import: {
      title: "投喂小怪兽",
      subtitle: "把它喂饱，题库就是你的了！复制JSON或拖入文件。",
      nameLabel: "给这顿饭起个名",
      namePlaceholder: "给这顿饭(题库)起个名",
      optional: "（选填）",
      jsonLabel: "粘贴或者拖拽文件到这里",
      btnText: "喂给它！",
      btnFile: "上传文件",
      errorJson: "呸！这不好吃 (JSON格式错误)",
      errorParse: "呕... 消化不良 (解析失败)",
      success: "嗝~ 真香！",
      dragDrop: "丢进嘴里！",
      eating: "嚼嚼嚼..."
    },
    dashboard: {
      title: "我的题库",
      emptyTitle: "空空如也",
      emptyDesc: "去导入一些题目，开启你的 Good Review 之旅。",
      questions: "题",
      btnPractice: "开始复习",
      btnExam: "模拟考试",
      btnDelete: "删除",
      deleteConfirmTitle: "确认删除？",
      deleteConfirm: "此操作无法撤销，该题库将被永久移除。",
      setupTitle: "复习设置",
      setupDesc: "题库较大，您可以选择特定题型进行专项练习。",
      selectAll: "全选",
      startFiltered: "开始练习",
      selectedCount: "已选题目"
    },
    quiz: {
      exit: "退出",
      typePlaceholder: "输入答案...",
      check: "核对答案",
      correct: "回答正确！",
      incorrect: "回答错误",
      correctAnswer: "正确答案：",
      prev: "上题",
      next: "下题",
      finish: "查看结果",
      hide: "隐藏",
      show: "答案",
      results: {
        title: "本次练习完成",
        perfectTitle: "全对通关！",
        statsCorrect: "正确",
        statsWrong: "错误",
        btnRetry: "重刷错题",
        btnDashboard: "返回题库",
        msgPerfect: "太棒了！你已经完全掌握了这些题目。",
        msgKeepGoing: "熟能生巧，继续攻克错题吧！",
        allClear: "恭喜！错题已全部清零。"
      }
    }
  }
};