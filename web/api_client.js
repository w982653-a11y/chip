class APIClient {
    constructor(baseURL = 'http://localhost:5000/api') {
        this.baseURL = baseURL;
        this.timeout = 10000; // 10秒超时
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer sk-ce0624408f014ae8a6e82e990ccb36e7`,
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || '请求失败');
            }
            
            return data;
        } catch (error) {
            console.error(`API请求失败: ${endpoint}`, error);
            throw error;
        }
    }

    /**
     * GET请求
     */
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }

    /**
     * POST请求
     */
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * 健康检查
     */
    async healthCheck() {
        return this.get('/health');
    }

    /**
     * 光谱分析
     */
    async analyzeSpectrum(spectralData) {
        return this.post('/analyze/spectrum', { spectral_data: spectralData });
    }

    /**
     * 趋势预测
     */
    async predictTrend(metricType, hours = 24) {
        return this.post('/predict/trend', {
            metric_type: metricType,
            hours: hours
        });
    }

    /**
     * 实时数据处理
     */
    async processRealtimeData(data) {
        return this.post('/process/realtime', data);
    }

    /**
     * 批量更新指标数据
     */
    async updateMetrics(metrics) {
        return this.post('/metrics/update', { metrics });
    }

    /**
     * 获取历史数据
     */
    async getHistoricalData(metricType = null) {
        const params = metricType ? { metric_type: metricType } : {};
        return this.get('/historical/data', params);
    }

    /**
     * 获取模型状态
     */
    async getModelStatus() {
        return this.get('/model/status');
    }
}

// 创建全局API客户端实例
const apiClient = new APIClient();

// 导出API客户端
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIClient;
}