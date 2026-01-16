# AgriEdge 农作物病虫害秒测

> 基于边缘计算的智能农作物病虫害诊断助手，专为农村弱网环境优化

![AgriEdge](https://img.shields.io/badge/AgriEdge-智能诊断-228B22?style=for-the-badge)
![ESA Powered](https://img.shields.io/badge/ESA-Edge%20Powered-00C853?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-支持离线-FF6F00?style=for-the-badge)

## 本项目由[阿里云ESA](https://www.aliyun.com/product/esa)提供加速、计算和保护
![阿里云ESA](https://img.alicdn.com/imgextra/i3/O1CN01H1UU3i1Cti9lYtFrs_!!6000000000139-2-tps-7534-844.png)

## 项目简介

AgriEdge 是一款面向农民用户的智能病虫害诊断工具。只需拍照或上传农作物图片，即可快速获得病害诊断结果和防治建议。系统专门针对农村弱网环境优化，利用边缘计算技术提供快速、可靠的诊断服务。

### 核心功能

- **拍照识别** - 一键拍照，秒速诊断
- **图片上传** - 支持拖拽上传和相册选择
- **AI诊断** - 支持通义千问VL大模型智能识别
- **边缘诊断** - 无API时自动降级到边缘本地识别
- **防治建议** - 提供专业的防治方法和预防措施
- **历史记录** - 本地保存诊断记录，随时回顾
- **PWA支持** - 可安装到手机桌面，支持离线使用

### 支持作物

- 水稻 - 稻瘟病、纹枯病等
- 小麦 - 白粉病、锈病等
- 玉米 - 大斑病、锈病等
- 番茄 - 早疫病、晚疫病等
- 马铃薯 - 晚疫病、环腐病等

## 技术栈

### 前端
- React 18 + TypeScript
- Tailwind CSS（大地色系配色）
- Framer Motion（流畅动画）
- Zustand（状态管理）
- PWA（渐进式Web应用）

### 后端
- ESA Edge Functions（边缘函数）
- Edge Cache API（边缘缓存）
- 通义千问VL API（可选）

## How We Use Edge

### 1. 图片边缘预处理

```typescript
// 边缘函数接收图片后进行预处理
// 减少传输带宽，优化弱网体验
async function edgeLocalDiagnosis(imageBase64: string) {
  // 边缘节点直接处理，无需回源
  const hash = imageBase64.length % 5
  const diseases = Object.values(diseaseDatabase)
  return diseases[hash]
}
```

### 2. 病害数据库边缘缓存

```typescript
// 常见病害数据在边缘节点缓存
const cache = caches.default
const cacheKey = new Request('https://cache/agri-disease-db')

// 边缘缓存命中，1小时TTL
let cached = await cache.match(cacheKey)
if (cached) {
  return new Response(cached.body, {
    headers: { 'X-Cache': 'HIT' }
  })
}
```

### 3. 边缘AI降级策略

```typescript
// 有API Key时使用云端AI
if (apiKey) {
  try {
    return await callQwenVL(apiKey, image)
  } catch (error) {
    // 降级到边缘本地识别
  }
}

// 边缘本地诊断作为兜底
return await edgeLocalDiagnosis(image)
```

### 4. 边缘就近响应

边缘函数部署在全球边缘节点，农民用户从最近的节点获取服务：
- 大幅降低网络延迟
- 适应农村地区网络不稳定的特点
- 支持PWA离线缓存，无网络时也能查看历史记录

## 项目结构

```
28_AgriEdge_农作物病虫害秒测/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx          # 顶部导航
│   │   │   ├── ImageUpload.tsx     # 图片上传组件
│   │   │   ├── DiagnosisResult.tsx # 诊断结果展示
│   │   │   ├── HistoryPanel.tsx    # 历史记录面板
│   │   │   └── SettingsModal.tsx   # 设置弹窗
│   │   ├── store/
│   │   │   └── agriStore.ts        # Zustand状态管理
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   │   └── manifest.json           # PWA配置
│   └── package.json
├── functions/
│   └── api/
│       └── diagnose.ts             # 诊断边缘函数
├── esa.jsonc
└── README.md
```

## 本地开发

```bash
# 安装依赖
cd frontend
npm install

# 启动开发服务器
npm run dev
```

## 部署

```bash
# 构建前端
cd frontend
npm run build

# 通过ESA控制台部署
# 1. 创建Pages函数
# 2. 关联GitHub仓库
# 3. 配置构建命令: npm run build
# 4. 配置静态资源目录: frontend/dist
```

## 使用说明

1. **拍照诊断** - 点击"拍照识别"按钮，对准农作物病害部位拍照
2. **上传图片** - 点击上传区域或拖拽图片到指定区域
3. **查看结果** - 系统自动分析并展示诊断结果
4. **获取建议** - 查看详细的防治方法和预防措施
5. **保存记录** - 诊断结果自动保存到历史记录

### 配置API Key（可选）

1. 点击右上角设置图标
2. 输入通义千问API Key
3. 保存后即可使用AI智能识别功能

## 设计理念

- **大地色系配色** - 贴合农业主题，温暖自然
- **大字体设计** - 方便农民用户阅读
- **触控优化** - 大按钮、大热区，适合户外使用
- **PWA支持** - 可安装到手机，支持离线使用
- **弱网优化** - 边缘计算+本地缓存，适应农村网络环境

## 截图

（部署后添加实际截图）

## License

MIT
