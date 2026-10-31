# 游戏策划作品集 · UI 预览版

一份按「拆解案 → 策划案 → 游戏 Demo → 商业表现」递进的求职作品集。
纯静态 HTML / CSS / JavaScript，不需要构建、不需要服务器，双击 `index.html` 即可浏览。

> 个人信息已按 `简历信息.txt` 填入（周西阳 / 17362275882 / 1953324609@qq.com）；项目文档与 Demo 来自 `原素材/`。

---

## 1. 打开方式

直接双击 `index.html`（推荐 Chrome / Edge / Safari 最新版）。

如需本地服务器（可选）：

```powershell
cd D:\Zmastermind\Website
python -m http.server 8000
# 打开 http://localhost:8000
```

站点内所有资源均为本地相对路径，`file://` 下同样可用。

---

## 2. 页面结构

| 文件 | 内容 | 交互 |
| --- | --- | --- |
| `index.html` | 主页：Hero、四阶段作品矩阵（两行）、About、简历下载 | 矩阵内跳转文档 / 下载 Demo / 下载简历 |
| `work-roulette.html` | 拆解案《恶魔轮盘》：14 章 / 13 表 / 3 图 | 左目录固定、阅读进度、图片放大 |
| `work-goat.html` | 策划案《山羊赌局》：22 章 / 80 节 / 62 表 / 12 图 | 同上 |
| `work-tribe.html` | 策划案《部落神话》：20 章 / 39 节 / 41 表 / 8 图 | 同上 |
| `assets/downloads/sheepie-fairy-tale-demo.zip` | 山羊赌局 Demo（Windows，单文件 exe，约 167 MB） | 下载 |
| `assets/downloads/tribal-myth-demo.zip` | 部落神话 Demo（Windows，Unity 构建，约 92 MB） | 下载 |
| `assets/downloads/resume.pdf` | 一页简历（A4） | 下载 / 打印 |

商业表现按《修改.md》要求暂不单独成页，只在主页矩阵第 4 列记录当前状态：
第 1 行「Steam 审核中」，第 2 行「校园 Game Jam 第一名」。

### 主页矩阵

```
拆解案           →  策划案           →  游戏 Demo        →  商业表现
恶魔轮盘            山羊赌局            山羊赌局 Demo       Steam 审核中
（暂无）            部落神话            部落神话 Demo       校园 Game Jam 第一名
```

第一行是已上线项目，第二行是校园 / Game Jam 项目；每行从左到右保持同一条能力链。

---

## 3. 阅读页交互

- **左侧目录固定**：正文滚动时目录不跟着动（`position: sticky`），当前章节高亮；只有当前章节展开 h3 子项。
- **阅读进度条**：顶部 2px 朱红线，按正文阅读进度推进。
- **图片放大**：点击任意插图打开 lightbox，Esc 或点击遮罩关闭；原图仍保留新标签打开作为兜底。
- **上一篇 / 下一篇**：三篇文档之间可直接切换。
- **移动端**：≤980px 目录收进抽屉（「目录 / Contents」按钮），≤700px 调整字号与表格。
- **无障碍**：跳转主内容链接、键盘可操作的目录、`aria-expanded` 状态。

---

## 4. 文件结构

```
Website/
├─ index.html                 主页
├─ work-roulette.html         拆解案
├─ work-goat.html             策划案
├─ work-tribe.html            策划案
├─ assets/
│  ├─ css/
│  │  ├─ base.css             设计变量、页头页脚、按钮、基础排版
│  │  ├─ home.css             主页 hero / 矩阵 / About
│  │  └─ work.css             文档页 hero / 固定目录 / 正文 / 图表
│  ├─ js/
│  │  ├─ site.js              导航、滚动状态、reveal
│  │  └─ work.js              进度条、目录高亮、抽屉、图片放大
│  ├─ img/
│  │  ├─ roulette/            恶魔轮盘插图（WebP）
│  │  ├─ goat/                山羊赌局插图（WebP）
│  │  └─ tribe/               部落神话插图（WebP）
│  └─ downloads/
│     ├─ resume.pdf
│     ├─ resume.html          简历的 A4 打印源文件
│     ├─ sheepie-fairy-tale-demo.zip
│     └─ tribal-myth-demo.zip
├─ build/
│  └─ build_docs.py           docx → work-*.html 生成器
├─ 原素材/                    三份 docx + 两个 demo 压缩包（源文件）
├─ 简历信息.txt               个人信息源（已填入站点与简历）
└─ _archive/                  旧版深色主题页面（已不再引用，仅留档）
```

---

## 5. 设计与实现

- **浅色编辑风**：白底、黑字、细黑线、无圆角，朱红 `#e5401f` 作为唯一强调色。
- **设计变量**（`assets/css/base.css`）：`--ink #0b0b0c`、`--paper #faf9f6`、`--muted #6b6f76`、`--line #dedbd3`、`--red #e5401f`；内容宽 `1320px`，页边距 `48px`，页头高 `64px`。
- **字体**：标题用 Helvetica Neue / PingFang SC 粗体；标签与数字用等宽字体；不使用外链字体。
- **无依赖**：无框架、无 CDN、无 `fetch`、无 ES module；`file://` 直接打开。
- **响应式断点**：1180 / 980 / 700 / 600。

### 文档生成器

`build/build_docs.py` 把 `原素材/*.docx` 转成三篇 `work-*.html`：

- 按文档顺序处理段落与表格，跳过手写「目录」；
- H2/H3 拆出编号生成目录；列表转 `ul.bullets` / `ol.steps`；
- 1×1 表转 callout，2 列「项 / 内容」表转 `dl` 风格，其余表自动加表头与横向滚动；
- 图片按关系 ID 提取，转 WebP（最大宽 1600），竖图加 `fig--portrait`；
- 成对英文引号转中文引号，图注去掉「图 N」前缀。

重新生成：

```powershell
# 依赖：python-docx、Pillow
& 'C:\Users\dell\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe' build\build_docs.py
```

当前统计：恶魔轮盘 14 章 / 13 表 / 3 图；山羊赌局 22 章 / 62 表 / 12 图；部落神话 20 章 / 41 表 / 8 图。

---

## 6. 替换个人信息

1. **姓名 / 联系方式**：网页已填入周西阳、1953324609@qq.com、南京 / 苏州 / 上海 / 杭州 / 济南；手机号 17362275882 只保留在简历 PDF 内，不在网页公开显示。
2. **学校 / 荣誉**：`index.html` 的 About、`assets/downloads/resume.html` 的教育（南京传媒学院 / 苏州职业技术大学）与荣誉区块。
3. **简历 PDF**：编辑 `resume.html` 后用 Edge 打印：

   ```powershell
   & 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' `
     --headless=new --disable-gpu --no-pdf-header-footer `
     --user-data-dir="$env:TEMP\resume-$(Get-Random)" `
     --print-to-pdf="assets\downloads\resume.pdf" `
     "file:///D:/Zmastermind/Website/assets/downloads/resume.html"
   ```

4. **文档内容**：改 `原素材/*.docx` 后重新运行生成器，或直接编辑 `work-*.html`。
5. **Demo 包**：原文件在 `assets/downloads/`；线上首页的两个下载按钮已指向阿里云 OSS（`zhouxiyang-downloads.oss-cn-shanghai.aliyuncs.com`，公共读），替换 Demo 时同步更新 `index.html` 的两个外链。

---

## 7. 部署上线（zhouxiyang.cn）

站点是纯静态文件，不需要数据库或后端。域名、canonical、OG、`sitemap.xml`、`CNAME`、`_headers`、`_redirects` 已按 `zhouxiyang.cn` 配好。

### 7.1 生成本地部署包

```powershell
& 'C:\Users\dell\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe' build\package_site.py
# 产物：dist\（42 个文件，约 183 MB，含两个 Demo 包）

& 'C:\Users\dell\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe' build\package_site.py --no-demos
# 不含 zip，约 2 MB，适合有单文件大小限制的托管
```

本地检查：

```powershell
& 'C:\Users\dell\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe' -m http.server 8799 --directory dist
# 打开 http://127.0.0.1:8799/
```

### 7.2 方案 A：Cloudflare Pages（免备案，推荐先上线）

1. 注册 Cloudflare，进入 **Workers & Pages → Create → Pages → Upload assets**，把 `dist/` 拖进去；
2. **Custom domains** 添加 `zhouxiyang.cn` 与 `www.zhouxiyang.cn`；
3. 把阿里云的 NS 改成 Cloudflare 分配的两个 NS（或在阿里云加 `www` CNAME 指向 `<项目>.pages.dev`）；
4. **Rules → Redirect Rules**：`www.zhouxiyang.cn/*` → `https://zhouxiyang.cn/$1`，301；
5. HTTPS 证书自动签发。

注意：Cloudflare Pages **单文件上限 25 MB**，两个 zip 传不上去。二选一：

- 把 zip 放 **Cloudflare R2**（10 GB 免费额度，出站免费），绑 `download.zhouxiyang.cn`，再把首页两个下载链接改成 R2 地址；
- 或把 zip 放 **GitHub Releases**（单文件 2 GB），用 Release 下载地址；
- 或直接用下面的 GitHub Pages 方案，两个 zip 都能放。

### 7.3 方案 B：GitHub Pages（能直接带 183 MB）

1. 新建仓库，把 `dist/` 里的内容推到仓库根目录；
2. **Settings → Pages → Deploy from a branch**，选 `main` / `(root)`；
3. 自定义域名填 `zhouxiyang.cn`（`CNAME` 文件已带），勾选 **Enforce HTTPS**；
4. DNS：根域加 GitHub Pages 的 A 记录，`www` 加 CNAME 指向 `<用户名>.github.io`。

限制：站点 1 GB 以内、单文件 100 MB 以内（两个 zip 都小于 100 MB），月流量 100 GB 软限制；国内访问速度不稳定。

### 7.4 方案 C：阿里云 OSS + CDN（国内最快，要备案）

- 绑定自定义域名必须 **ICP 备案**，个人可备，约 1–3 周；
- 183 MB 存储每月几分钱，流量按量；
- 适合确定长期投国内、愿意等备案的情况。

### 7.5 上线检查清单

- [ ] `.cn` 实名认证已通过（否则解析会被 serverHold）
- [ ] `https://zhouxiyang.cn/` 与 `https://www.zhouxiyang.cn/` 都能打开，且只有一个 200、另一个 301
- [ ] 三个 `work-*.html`、简历 PDF、两个 Demo 下载都能打开
- [ ] 手机 4G 下检查首屏与目录抽屉
- [ ] 简历、页脚、邮件签名统一写 `zhouxiyang.cn`

---

## 8. 已知限制

- 商业表现页尚未设计（按需求只保留主页状态文字）。
- 文档中的销量、评价等来自原 docx 的公开资料整理，正式投递前请再核对一遍。
- 山羊赌局 Demo 为 167 MB 单文件 exe，部分邮箱 / 网盘可能拒收；正式部署建议放对象存储或网盘链接。
- 移动端目录抽屉与图片放大已实现，但尚未在真机 iOS Safari 上逐项测试。
- 旧版深色主题页面已移入 `_archive/`，不参与新站导航。

---

## 9. 后续正式开发建议

- 把三篇长文拆成结构化内容（Markdown / JSON），用模板统一渲染，减少手改 HTML。
- 增加文档内搜索、阅读位置记忆、上一篇/下一篇的键盘快捷键。
- 为图片生成多尺寸 `srcset`，首屏只加载缩略图。
- 接入访问统计（Cloudflare Web Analytics / 51LA）与简历下载点击事件。
- 商业表现页上线后，把第 4 列两张状态卡替换为数据看板入口。
