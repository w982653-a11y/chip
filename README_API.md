
## 项目结构

```
web/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 前端逻辑（已集成API客户端）
├── api_client.js       # API客户端
├── api_server.py       # Python后端API服务
├── requirements.txt    # Python依赖
└── README_API.md       # API集成指南
```

## 快速开始

### 方式一：仅使用前端（本地模拟模式）
1. 直接在浏览器中打开 `index.html`
2. 或使用本地服务器：`python -m http.server 8000`
3. 访问 `http://localhost:8000`

### 方式二：使用完整API服务
1. 安装依赖：`pip install -r requirements.txt`
2. 启动API服务：`python api_server.py`（服务在 `http://localhost:5000` 启动）
3. 启动前端服务：`python -m http.server 8000`
4. 访问 `http://localhost:8000`

## API接口说明

### 基础信息
- **基础URL**: `http://localhost:5000/api`
- **数据格式**: JSON
- **编码**: UTF-8

### 核心接口

| 端点 | 方法 | 描述 |
|------|------|------|
| `/health` | GET | 检查API服务状态 |
| `/analyze` | POST | 分析光谱数据，检测污染物 |
| `/predict` | POST | 预测未来水质趋势 |
| `/process` | POST | 处理实时水质数据 |

## 前端集成

### API客户端使用
```javascript
// 健康检查
const health = await apiClient.healthCheck();

// 光谱分析
const analysis = await apiClient.analyzeSpectrum(spectralData);

// 趋势预测
const prediction = await apiClient.predictTrend('ph', 24);

// 实时数据处理
const processed = await apiClient.processRealtimeData(waterQualityData);
```

### AI模型自动切换
```javascript
const aiModel = new AIModel();
await aiModel.loadModel(); // 自动检测并切换模式

// 所有方法都会自动使用API或本地模拟
const results = await aiModel.analyzeSpectrum(data);
const conclusion = await aiModel.generateConclusion(results);
```

## 错误处理
- **API服务不可用**: 自动切换到本地模拟模式
- **网络错误**: 在控制台显示警告信息
- **数据格式错误**: 返回默认值并记录日志

## 自定义配置
- **修改API地址**: 编辑 `api_client.js` 中的 `API_BASE_URL`
- **添加新端点**: 在 `api_client.js` 中添加新方法

## 故障排查
- **API服务无法启动**: 检查端口是否被占用
- **前端无法连接API**: 确认服务已启动，检查CORS配置
- **数据显示异常**: 检查API响应格式，查看控制台日志

## 扩展功能
- 添加新的水质参数
- 集成真实AI模型
- 添加更多数据可视化功能

---

© 2026 智监微痕科技有限公司. 保留所有权利。
