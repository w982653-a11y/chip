// Smooth scrolling for navigation links
function smoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for scroll animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px  0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

// Navbar background change on scroll
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Particle animation for hero section
function createParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        heroSection.appendChild(particle);
    }
}

// Animate data points
function animateDataPoints() {
    const dataPoints = document.querySelectorAll('.data-point');
    dataPoints.forEach(point => {
        // 检查元素是否有data-value属性
        const dataValue = point.getAttribute('data-value');
        if (dataValue) {
            const targetValue = parseInt(dataValue);
            if (!isNaN(targetValue)) {
                let currentValue = 0;
                const increment = targetValue / 100;
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= targetValue) {
                        point.textContent = targetValue + '%';
                        clearInterval(timer);
                    } else {
                        point.textContent = Math.floor(currentValue) + '%';
                    }
                }, 20);
            }
        }
    });
}

// Initialize AI Model
class AIModel {
    constructor() {
        this.model = null;
        this.isLoaded = false;
        this.useAPI = false; // 是否使用API服务
        this.pollutants = [
            { name: '铅', threshold: 0.01, unit: 'mg/L' },
            { name: '汞', threshold: 0.001, unit: 'mg/L' },
            { name: '镉', threshold: 0.005, unit: 'mg/L' },
            { name: '砷', threshold: 0.01, unit: 'mg/L' }
        ];
    }

    async loadModel() {
        try {
            // 尝试连接API服务
            const healthCheck = await apiClient.healthCheck();
            if (healthCheck.success && healthCheck.data.model_loaded) {
                console.log('✅ AI模型已连接到API服务');
                this.useAPI = true;
                this.isLoaded = true;
                return true;
            }
        } catch (error) {
            console.warn('⚠️ API服务不可用，使用本地模拟模式');
        }
        
        // 模拟模型加载
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('AI模型加载完成（模拟模式）');
                this.isLoaded = true;
                resolve(true);
            }, 1000);
        });
    }

    // 生成模拟光谱数据
    generateSpectralData() {
        const wavelengths = [];
        const intensities = [];
        const baseline = [];
        
        // 生成波长范围 200-800 nm
        for (let wavelength = 200; wavelength <= 800; wavelength += 5) {
            wavelengths.push(wavelength);
            
            // 生成基线
            const baseIntensity = 0.1 + 0.05 * Math.sin(wavelength * 0.01);
            baseline.push(baseIntensity);
            
            // 生成信号强度
            let intensity = baseIntensity;
            
            // 添加一些特征峰
            if (wavelength === 280) intensity += 0.3 * Math.random();
            if (wavelength === 350) intensity += 0.25 * Math.random();
            if (wavelength === 420) intensity += 0.2 * Math.random();
            if (wavelength === 510) intensity += 0.35 * Math.random();
            if (wavelength === 630) intensity += 0.15 * Math.random();
            if (wavelength === 720) intensity += 0.22 * Math.random();
            
            // 添加噪声
            intensity += 0.05 * (Math.random() - 0.5);
            
            // 确保强度为正
            intensity = Math.max(0, intensity);
            
            intensities.push(intensity);
        }
        
        return { wavelengths, intensities, baseline };
    }

    // 分析光谱数据，检测污染物
    async analyzeSpectrum(spectralData) {
        if (this.useAPI) {
            try {
                const result = await apiClient.analyzeSpectrum(spectralData);
                if (result.success) {
                    return result.data.detection_results;
                }
            } catch (error) {
                console.warn('API分析失败，使用本地模拟:', error);
            }
        }
        
        // 本地模拟分析
        const { intensities } = spectralData;
        const results = [];
        
        this.pollutants.forEach(pollutant => {
            const concentration = pollutant.threshold * (0.1 + 0.8 * Math.random());
            const isSafe = concentration < pollutant.threshold;
            
            results.push({
                name: pollutant.name,
                concentration: concentration.toFixed(6),
                threshold: pollutant.threshold,
                unit: pollutant.unit,
                status: isSafe ? '安全' : '超标'
            });
        });
        
        return results;
    }

    // 生成分析结论
    async generateConclusion(detectionResults) {
        if (this.useAPI) {
            try {
                const result = await apiClient.analyzeSpectrum({});
                if (result.success) {
                    return result.data.conclusion;
                }
            } catch (error) {
                console.warn('API结论生成失败，使用本地模拟:', error);
            }
        }
        
        // 本地模拟结论
        const 超标污染物 = detectionResults.filter(result => result.status !== '安全');
        
        if (超标污染物.length === 0) {
            return {
                status: '安全',
                message: '水中未检测到超标污染物，水质符合标准。',
                recommendation: '建议定期进行水质监测，保持良好的水资源管理。'
            };
        } else {
            const 超标名称 = 超标污染物.map(p => p.name).join('、');
            return {
                status: '超标',
                message: `水中检测到${超标名称}超标，需要采取相应措施。`,
                recommendation: '建议立即停止使用该水源，并联系专业机构进行处理。'
            };
        }
    }

    // 动态处理水质数据
    async processWaterQualityData(data) {
        if (this.useAPI) {
            try {
                const result = await apiClient.processRealtimeData(data);
                if (result.success) {
                    return result.data;
                }
            } catch (error) {
                console.warn('API数据处理失败，使用本地模拟:', error);
            }
        }
        
        // 本地模拟处理
        return {
            ...data,
            processed: true,
            timestamp: new Date().toISOString(),
            confidence: (0.9 + 0.1 * Math.random()).toFixed(2),
            anomalies: Math.random() > 0.9 ? ['检测到异常波动'] : []
        };
    }

    // 预测未来水质趋势
    async predictWaterQualityTrend(historicalData) {
        if (this.useAPI && historicalData.length > 0) {
            try {
                const result = await apiClient.predictTrend('ph', 24);
                if (result.success) {
                    return result.data.predicted_data;
                }
            } catch (error) {
                console.warn('API预测失败，使用本地模拟:', error);
            }
        }
        
        // 本地模拟预测
        const lastValue = historicalData[historicalData.length - 1] || 7;
        const predictions = [];
        
        for (let i = 1; i <= 24; i++) {
            const variation = (Math.random() - 0.5) * 0.2;
            const predictedValue = Math.max(0, lastValue + variation * i);
            predictions.push(predictedValue);
        }
        
        return predictions;
    }
}

// 初始化AI模型
let aiModel;

async function initAIModel() {
    aiModel = new AIModel();
    await aiModel.loadModel();
    updateAIModelStatus();
    console.log('AI模型初始化完成');
}

// 更新AI模型状态显示
function updateAIModelStatus() {
    const statusElement = document.querySelector('.ai-model-status');
    if (statusElement) {
        statusElement.textContent = aiModel.isLoaded ? '已加载' : '加载中';
    }
}

// 绘制光谱图表
function drawSpectrumChart(spectralData) {
    const { wavelengths, intensities, baseline } = spectralData;
    const svgElement = document.querySelector('.spectrum-svg');
    
    if (!svgElement) return;
    
    const width = svgElement.clientWidth;
    const height = svgElement.clientHeight;
    const padding = 20;
    
    // 清空现有内容
    svgElement.innerHTML = '';
    
    // 计算比例尺
    const xScale = (wavelength) => padding + ((wavelength - 200) / 600) * (width - 2 * padding);
    const yScale = (intensity) => height - padding - (intensity * (height - 2 * padding));
    
    // 绘制基线
    let baselinePath = '';
    for (let i = 0; i < baseline.length; i++) {
        const x = xScale(wavelengths[i]);
        const y = yScale(baseline[i]);
        baselinePath += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    
    const baselineElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    baselineElement.setAttribute('d', baselinePath);
    baselineElement.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
    baselineElement.setAttribute('stroke-width', '1');
    baselineElement.setAttribute('fill', 'none');
    svgElement.appendChild(baselineElement);
    
    // 绘制光谱曲线
    let spectrumPath = '';
    for (let i = 0; i < intensities.length; i++) {
        const x = xScale(wavelengths[i]);
        const y = yScale(intensities[i]);
        spectrumPath += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    
    const spectrumElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    spectrumElement.setAttribute('d', spectrumPath);
    spectrumElement.setAttribute('stroke', '#00d4ff');
    spectrumElement.setAttribute('stroke-width', '2');
    spectrumElement.setAttribute('fill', 'none');
    svgElement.appendChild(spectrumElement);
}

// 更新AI分析结果
async function updateAIAnalysis() {
    if (!aiModel || !aiModel.isLoaded) return;
    
    // 生成光谱数据
    const spectralData = aiModel.generateSpectralData();
    
    // 绘制光谱图表
    drawSpectrumChart(spectralData);
    
    // 分析光谱数据
    const detectionResults = await aiModel.analyzeSpectrum(spectralData);
    
    // 更新检测结果表格
    updateDetectionTable(detectionResults);
    
    // 生成分析结论
    const conclusion = await aiModel.generateConclusion(detectionResults);
    
    // 更新分析结论
    updateAnalysisConclusion(conclusion);
    
    // 更新分析时间
    const timeElement = document.querySelector('.analysis-time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleString('zh-CN');
    }
}

// 更新检测结果表格
function updateDetectionTable(results) {
    const tableElement = document.querySelector('.detection-table');
    if (!tableElement) return;
    
    // 清空现有内容，保留表头
    const tableHeader = tableElement.querySelector('.table-header');
    tableElement.innerHTML = '';
    if (tableHeader) {
        tableElement.appendChild(tableHeader);
    }
    
    // 添加检测结果行
    results.forEach(result => {
        const row = document.createElement('div');
        row.classList.add('table-row');
        
        row.innerHTML = `
            <span>${result.name}</span>
            <span>${result.concentration} ${result.unit}</span>
            <span>${result.threshold} ${result.unit}</span>
            <span class="status-${result.status === '安全' ? 'safe' : 'warning'}">${result.status}</span>
        `;
        
        tableElement.appendChild(row);
    });
}

// 更新分析结论
function updateAnalysisConclusion(conclusion) {
    const conclusionElement = document.querySelector('.analysis-conclusion p');
    if (conclusionElement) {
        conclusionElement.textContent = conclusion.message;
    }
}

// 模拟实时水质数据更新
function simulateRealTimeData() {
    const metrics = [
        { id: 'ph-value', min: 6.5, max: 8.5, unit: 'pH' },
        { id: 'temperature-value', min: 15, max: 25, unit: '°C' },
        { id: 'turbidity-value', min: 0, max: 5, unit: 'NTU' },
        { id: 'dissolved-oxygen-value', min: 5, max: 10, unit: 'mg/L' }
    ];
    
    setInterval(() => {
        // 显示AI处理中状态
        showAIProcessingStatus(true);
        
        metrics.forEach(metric => {
            const element = document.getElementById(metric.id);
            if (element) {
                // 生成在范围内的随机值
                const value = metric.min + (metric.max - metric.min) * Math.random();
                
                // 使用AI模型处理数据
                if (aiModel && aiModel.isLoaded) {
                    const processedData = aiModel.processWaterQualityData({
                        value: value,
                        metric: metric.id,
                        timestamp: new Date().toISOString()
                    });
                    
                    // 更新显示值
                    element.textContent = processedData.value.toFixed(1);
                    
                    // 存储历史数据到全局变量
                    switch (metric.id) {
                        case 'ph-value':
                            globalHistoricalData.ph.push(value);
                            if (globalHistoricalData.ph.length > 24) globalHistoricalData.ph.shift();
                            break;
                        case 'temperature-value':
                            globalHistoricalData.temperature.push(value);
                            if (globalHistoricalData.temperature.length > 24) globalHistoricalData.temperature.shift();
                            break;
                        case 'turbidity-value':
                            globalHistoricalData.turbidity.push(value);
                            if (globalHistoricalData.turbidity.length > 24) globalHistoricalData.turbidity.shift();
                            break;
                        case 'dissolved-oxygen-value':
                            globalHistoricalData.dissolvedOxygen.push(value);
                            if (globalHistoricalData.dissolvedOxygen.length > 24) globalHistoricalData.dissolvedOxygen.shift();
                            break;
                    }
                    
                    // 显示异常信息
                    if (processedData.anomalies && processedData.anomalies.length > 0) {
                        showAnomalyAlert(processedData.anomalies);
                    }
                } else {
                    // 如果AI模型未加载，直接更新值
                    element.textContent = value.toFixed(1);
                }
            }
        });
        
        // 绘制更新后的趋势图
        drawTrendChart(globalHistoricalData);
        
        // 隐藏AI处理中状态
        setTimeout(() => {
            showAIProcessingStatus(false);
        }, 500);
        
    }, 5000);
}

// 显示AI处理中状态
function showAIProcessingStatus(isProcessing) {
    const statusElement = document.querySelector('.ai-processing-status');
    if (statusElement) {
        statusElement.style.display = isProcessing ? 'flex' : 'none';
    } else {
        // 如果不存在，创建一个
        const dashboardElement = document.querySelector('.dashboard-interface');
        if (dashboardElement) {
            const processingStatus = document.createElement('div');
            processingStatus.classList.add('ai-processing-status');
            processingStatus.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 212, 255, 0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                font-size: 14px;
                display: ${isProcessing ? 'flex' : 'none'};
                align-items: center;
                z-index: 1000;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            `;
            processingStatus.innerHTML = `
                <div style="width: 10px; height: 10px; border: 2px solid white; border-top: 2px solid transparent; border-radius: 50%; margin-right: 8px; animation: spin 1s linear infinite;"></div>
                AI正在处理数据...
            `;
            dashboardElement.appendChild(processingStatus);
        }
    }
}

// 显示异常警报
function showAnomalyAlert(anomalies) {
    const alertElement = document.querySelector('.anomaly-alert');
    if (alertElement) {
        alertElement.innerHTML = anomalies.map(anomaly => `<p>${anomaly}</p>`).join('');
        alertElement.style.display = 'block';
        
        // 3秒后隐藏
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, 3000);
    } else {
        // 如果不存在，创建一个
        const dashboardElement = document.querySelector('.dashboard-interface');
        if (dashboardElement) {
            const alert = document.createElement('div');
            alert.classList.add('anomaly-alert');
            alert.style.cssText = `
                position: fixed;
                top: 60px;
                right: 20px;
                background: rgba(255, 99, 132, 0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                font-size: 14px;
                display: block;
                z-index: 1000;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            `;
            alert.innerHTML = anomalies.map(anomaly => `<p>${anomaly}</p>`).join('');
            dashboardElement.appendChild(alert);
            
            // 3秒后隐藏
            setTimeout(() => {
                alert.style.display = 'none';
            }, 3000);
        }
    }
}

// 绘制24小时趋势图
function drawTrendChart(historicalData) {
    const svgElement = document.querySelector('.chart-svg');
    if (!svgElement) return;
    
    const width = svgElement.clientWidth;
    const height = svgElement.clientHeight;
    const padding = 20;
    
    // 使用历史数据或生成模拟数据
    let phValues = [];
    let turbidityValues = [];
    
    if (historicalData && historicalData.ph && historicalData.ph.length > 0) {
        // 使用历史数据
        phValues = [...historicalData.ph];
        turbidityValues = [...historicalData.turbidity];
        
        // 如果数据不足24小时，补充模拟数据
        while (phValues.length < 24) {
            phValues.unshift(6.5 + 2 * Math.random());
            turbidityValues.unshift(0 + 5 * Math.random());
        }
        
        // 只保留最近24小时数据
        if (phValues.length > 24) {
            phValues = phValues.slice(-24);
            turbidityValues = turbidityValues.slice(-24);
        }
    } else {
        // 生成模拟数据
        const hours = Array.from({ length: 24 }, (_, i) => i);
        phValues = hours.map(() => 6.5 + 2 * Math.random());
        turbidityValues = hours.map(() => 0 + 5 * Math.random());
    }
    
    // 使用AI模型预测未来趋势
    let predictedPhValues = [];
    let predictedTurbidityValues = [];
    
    if (aiModel && aiModel.isLoaded) {
        predictedPhValues = aiModel.predictWaterQualityTrend(phValues);
        predictedTurbidityValues = aiModel.predictWaterQualityTrend(turbidityValues);
    }
    
    // 清空现有内容
    svgElement.innerHTML = '';
    
    // 计算比例尺
    const totalHours = 24 + (predictedPhValues.length || 0);
    const xScale = (hour) => padding + (hour / (totalHours - 1)) * (width - 2 * padding);
    const phYScale = (value) => height - padding - ((value - 6) / 3) * (height - 2 * padding);
    const turbidityYScale = (value) => height - padding - (value / 5) * (height - 2 * padding);
    
    // 绘制pH趋势线（历史数据）
    let phPath = '';
    phValues.forEach((value, index) => {
        const x = xScale(index);
        const y = phYScale(value);
        phPath += index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });
    
    const phElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    phElement.setAttribute('d', phPath);
    phElement.setAttribute('stroke', '#00d4ff');
    phElement.setAttribute('stroke-width', '2');
    phElement.setAttribute('fill', 'none');
    svgElement.appendChild(phElement);
    
    // 绘制pH预测趋势线
    if (predictedPhValues.length > 0) {
        let predictedPhPath = '';
        predictedPhValues.forEach((value, index) => {
            const x = xScale(phValues.length + index);
            const y = phYScale(value);
            predictedPhPath += index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
        });
        
        const predictedPhElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        predictedPhElement.setAttribute('d', predictedPhPath);
        predictedPhElement.setAttribute('stroke', '#00d4ff');
        predictedPhElement.setAttribute('stroke-width', '2');
        predictedPhElement.setAttribute('stroke-dasharray', '5,5');
        predictedPhElement.setAttribute('fill', 'none');
        svgElement.appendChild(predictedPhElement);
    }
    
    // 绘制浊度趋势线（历史数据）
    let turbidityPath = '';
    turbidityValues.forEach((value, index) => {
        const x = xScale(index);
        const y = turbidityYScale(value);
        turbidityPath += index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    });
    
    const turbidityElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    turbidityElement.setAttribute('d', turbidityPath);
    turbidityElement.setAttribute('stroke', '#ffd700');
    turbidityElement.setAttribute('stroke-width', '2');
    turbidityElement.setAttribute('fill', 'none');
    svgElement.appendChild(turbidityElement);
    
    // 绘制浊度预测趋势线
    if (predictedTurbidityValues.length > 0) {
        let predictedTurbidityPath = '';
        predictedTurbidityValues.forEach((value, index) => {
            const x = xScale(turbidityValues.length + index);
            const y = turbidityYScale(value);
            predictedTurbidityPath += index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
        });
        
        const predictedTurbidityElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        predictedTurbidityElement.setAttribute('d', predictedTurbidityPath);
        predictedTurbidityElement.setAttribute('stroke', '#ffd700');
        predictedTurbidityElement.setAttribute('stroke-width', '2');
        predictedTurbidityElement.setAttribute('stroke-dasharray', '5,5');
        predictedTurbidityElement.setAttribute('fill', 'none');
        svgElement.appendChild(predictedTurbidityElement);
    }
    
    // 添加图例
    const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    legend.setAttribute('transform', `translate(${padding}, ${height - padding + 10})`);
    
    // pH图例
    const phLegend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    phLegend.setAttribute('transform', 'translate(0, 0)');
    
    const phLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    phLine.setAttribute('x1', '0');
    phLine.setAttribute('y1', '5');
    phLine.setAttribute('x2', '20');
    phLine.setAttribute('y2', '5');
    phLine.setAttribute('stroke', '#00d4ff');
    phLine.setAttribute('stroke-width', '2');
    phLegend.appendChild(phLine);
    
    const phText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    phText.setAttribute('x', '25');
    phText.setAttribute('y', '8');
    phText.setAttribute('font-size', '12');
    phText.setAttribute('fill', '#fff');
    phText.textContent = 'pH值 (历史)';
    phLegend.appendChild(phText);
    
    legend.appendChild(phLegend);
    
    // 预测pH图例
    if (predictedPhValues.length > 0) {
        const predictedPhLegend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        predictedPhLegend.setAttribute('transform', 'translate(120, 0)');
        
        const predictedPhLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        predictedPhLine.setAttribute('x1', '0');
        predictedPhLine.setAttribute('y1', '5');
        predictedPhLine.setAttribute('x2', '20');
        predictedPhLine.setAttribute('y2', '5');
        predictedPhLine.setAttribute('stroke', '#00d4ff');
        predictedPhLine.setAttribute('stroke-width', '2');
        predictedPhLine.setAttribute('stroke-dasharray', '5,5');
        predictedPhLegend.appendChild(predictedPhLine);
        
        const predictedPhText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        predictedPhText.setAttribute('x', '25');
        predictedPhText.setAttribute('y', '8');
        predictedPhText.setAttribute('font-size', '12');
        predictedPhText.setAttribute('fill', '#fff');
        predictedPhText.textContent = 'pH值 (预测)';
        predictedPhLegend.appendChild(predictedPhText);
        
        legend.appendChild(predictedPhLegend);
    }
    
    // 浊度图例
    const turbidityLegend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    turbidityLegend.setAttribute('transform', `translate(${predictedPhValues.length > 0 ? 240 : 120}, 0)`);
    
    const turbidityLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    turbidityLine.setAttribute('x1', '0');
    turbidityLine.setAttribute('y1', '5');
    turbidityLine.setAttribute('x2', '20');
    turbidityLine.setAttribute('y2', '5');
    turbidityLine.setAttribute('stroke', '#ffd700');
    turbidityLine.setAttribute('stroke-width', '2');
    turbidityLegend.appendChild(turbidityLine);
    
    const turbidityText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    turbidityText.setAttribute('x', '25');
    turbidityText.setAttribute('y', '8');
    turbidityText.setAttribute('font-size', '12');
    turbidityText.setAttribute('fill', '#fff');
    turbidityText.textContent = '浊度 (历史)';
    turbidityLegend.appendChild(turbidityText);
    
    legend.appendChild(turbidityLegend);
    
    // 预测浊度图例
    if (predictedTurbidityValues.length > 0) {
        const predictedTurbidityLegend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        predictedTurbidityLegend.setAttribute('transform', `translate(${predictedPhValues.length > 0 ? 360 : 240}, 0)`);
        
        const predictedTurbidityLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        predictedTurbidityLine.setAttribute('x1', '0');
        predictedTurbidityLine.setAttribute('y1', '5');
        predictedTurbidityLine.setAttribute('x2', '20');
        predictedTurbidityLine.setAttribute('y2', '5');
        predictedTurbidityLine.setAttribute('stroke', '#ffd700');
        predictedTurbidityLine.setAttribute('stroke-width', '2');
        predictedTurbidityLine.setAttribute('stroke-dasharray', '5,5');
        predictedTurbidityLegend.appendChild(predictedTurbidityLine);
        
        const predictedTurbidityText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        predictedTurbidityText.setAttribute('x', '25');
        predictedTurbidityText.setAttribute('y', '8');
        predictedTurbidityText.setAttribute('font-size', '12');
        predictedTurbidityText.setAttribute('fill', '#fff');
        predictedTurbidityText.textContent = '浊度 (预测)';
        predictedTurbidityLegend.appendChild(predictedTurbidityText);
        
        legend.appendChild(predictedTurbidityLegend);
    }
    
    svgElement.appendChild(legend);
}

// 存储历史数据的全局变量
let globalHistoricalData = {
    ph: [],
    temperature: [],
    turbidity: [],
    dissolvedOxygen: []
};

// 初始化所有功能
async function init() {
    smoothScroll();
    setupIntersectionObserver();
    setupNavbarScroll();
    createParticles();
    animateDataPoints();
    simulateRealTimeData();
    drawTrendChart(globalHistoricalData);
    await initAIModel();
    await updateAIAnalysis();
    initAIAssistant(); // 初始化AI助手功能
    
    // 每30秒更新一次AI分析
    setInterval(async () => {
        await updateAIAnalysis();
    }, 30000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Refresh chart on window resize
window.addEventListener('resize', () => {
    drawTrendChart(globalHistoricalData);
    if (aiModel) {
        const spectralData = aiModel.generateSpectralData();
        drawSpectrumChart(spectralData);
    }
});

// AI Assistant functionality
function initAIAssistant() {
    console.log('开始初始化AI助手...');
    
    const aiButton = document.getElementById('aiAssistantButton');
    const aiPanel = document.getElementById('aiAssistantPanel');
    const aiClose = document.getElementById('aiAssistantClose');
    const aiInput = document.getElementById('aiAssistantInput');
    const aiSubmit = document.getElementById('aiAssistantSubmit');
    const aiMessages = document.getElementById('aiAssistantMessages');
    
    console.log('AI助手元素:', {
        aiButton: !!aiButton,
        aiPanel: !!aiPanel,
        aiClose: !!aiClose,
        aiInput: !!aiInput,
        aiSubmit: !!aiSubmit,
        aiMessages: !!aiMessages
    });
    
    if (!aiButton || !aiPanel || !aiClose || !aiInput || !aiSubmit || !aiMessages) {
        console.error('AI助手元素缺失');
        return;
    }
    
    console.log('AI助手元素初始化成功');
    
    // Toggle AI assistant panel
    aiButton.addEventListener('click', () => {
        console.log('点击AI助手按钮');
        aiPanel.classList.toggle('active');
    });
    
    // Close AI assistant panel
    aiClose.addEventListener('click', () => {
        console.log('关闭AI助手面板');
        aiPanel.classList.remove('active');
    });
    
    // Send message when submit button is clicked
    aiSubmit.addEventListener('click', sendMessage);
    
    // Send message when Enter key is pressed
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    console.log('AI助手事件监听器添加成功');
    
    // Function to send message
    async function sendMessage() {
        const message = aiInput.value.trim();
        if (!message) return;
        
        console.log('发送消息:', message);
        
        // Add user message to chat
        addMessage('user', message);
        
        // Clear input
        aiInput.value = '';
        
        // Show loading state
        addMessage('ai', '', true);
        
        try {
            // Get AI response
            const response = await getAIResponse(message);
            
            console.log('AI响应:', response);
            
            // Remove loading message
            const loadingMessage = aiMessages.querySelector('.ai-message.loading');
            if (loadingMessage) {
                loadingMessage.remove();
            }
            
            // Add AI response to chat
            addMessage('ai', response);
        } catch (error) {
            console.error('AI API调用失败:', error);
            
            // Remove loading message
            const loadingMessage = aiMessages.querySelector('.ai-message.loading');
            if (loadingMessage) {
                loadingMessage.remove();
            }
            
            // Show error message
            addMessage('ai', error.message || '失败');
        }
    }
    
    // Function to add message to chat
    function addMessage(type, content, isLoading = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(type === 'user' ? 'user-message' : 'ai-message');
        
        if (isLoading) {
            messageDiv.classList.add('loading');
            messageDiv.innerHTML = '<div class="message-content"><span></span></div>';
        } else {
            messageDiv.innerHTML = `<div class="message-content"><p>${content}</p></div>`;
        }
        
        aiMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
    
    // Function to get AI response
    async function getAIResponse(message) {
        // 百炼大模型API配置
        const API_KEY = 'sk-ce0624408f014ae8a6e82e990ccb36e7';
        const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
        
        console.log('调用AI API:', API_URL);
        
        try {
            // 调用百炼大模型API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: 'qwen-plus', // 使用通义千问-Plus模型
                    messages: [
                        {
                            role: 'system',
                            content: '你是智感水界的AI助手，专注于水质监测和分析。请以专业、友好的语气回答用户问题，提供关于水质监测系统的信息，包括系统功能、技术原理、污染物检测能力等。'
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });
            
            console.log('API响应状态:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API请求失败:', response.status, errorText);
                throw new Error(`API请求失败: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            console.log('API响应数据:', data);
            
            if (data.choices && data.choices.length > 0) {
                return data.choices[0].message.content;
            } else {
                throw new Error('API返回格式错误');
            }
        } catch (error) {
            console.error('百炼API调用失败:', error);
            // 直接返回失败信息，不使用本地降级响应
            throw new Error('失败');
        }
    }
    
    // 本地降级响应方案
    function getLocalAIResponse(message) {
        console.log('使用本地降级响应');
        
        const responses = {
            '你好': '你好！我是智感水界的AI助手，有什么可以帮助你的吗？',
            '水质监测': '我们的水质监测系统采用先进的SERS技术，能够快速、准确地检测多种水体污染物，包括抗生素、农药、重金属等。',
            '芯片': '我们的芯片采用复合基底技术，具有高灵敏度和稳定性，能够检测多种污染物，检测限达到10^-13 M。',
            '系统功能': '我们的系统支持实时监测、AI智能分析、多参数检测、数据可视化等功能，可以帮助您全面了解水质状况。',
            '检测项目': '我们的系统可以检测pH值、温度、浊度、溶解氧等常规参数，以及抗生素、农药、重金属等污染物。',
            '技术原理': '我们采用表面增强拉曼散射(SERS)技术，结合微流控技术，实现对水体污染物的快速、敏感检测。'
        };
        
        // 简单的关键词匹配
        for (const [key, response] of Object.entries(responses)) {
            if (message.includes(key)) {
                return response;
            }
        }
        
        return '感谢您的咨询。我们的水质监测系统采用先进的SERS技术，能够快速、准确地检测多种水体污染物。如果您有具体问题，请随时告诉我们。';
    }
}

// Shop functionality
function initShop() {
    // Product data
    const products = [
        {
            id: 1,
            name: "智能水质监测仪 Pro",
            description: "高精度水质监测设备，支持多参数实时检测，内置AI分析系统。",
            price: 8999,
            category: "equipment",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=water%20quality%20monitoring%20device%2C%20scientific%20equipment%2C%20blue%20and%20white%20design%2C%20professional%20appearance&image_size=landscape_4_3"
        },
        {
            id: 2,
            name: "便携式水质检测器",
            description: "轻便易携的水质检测设备，适合现场快速检测，支持数据导出。",
            price: 2499,
            category: "equipment",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=portable%20water%20quality%20tester%2C%20handheld%20device%2C%20modern%20design%2C%20blue%20display&image_size=landscape_4_3"
        },
        {
            id: 3,
            name: "水质传感器探头",
            description: "高精度水质传感器探头，适用于多种水质参数检测，使用寿命长。",
            price: 1299,
            category: "accessories",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=water%20quality%20sensor%20probe%2C%20scientific%20instrument%2C%20stainless%20steel%20design&image_size=landscape_4_3"
        },
        {
            id: 4,
            name: "水质监测系统解决方案",
            description: "完整的水质监测系统解决方案，包括硬件设备、软件平台和数据分析。",
            price: 29999,
            category: "solutions",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=water%20quality%20monitoring%20system%20dashboard%2C%20data%20visualization%2C%20modern%20interface&image_size=landscape_4_3"
        },
        {
            id: 5,
            name: "水样采集套件",
            description: "专业水样采集套件，包括采样瓶、保存剂和操作指南，确保采样准确性。",
            price: 499,
            category: "accessories",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=water%20sample%20collection%20kit%2C%20scientific%20equipment%2C%20professional%20tools&image_size=landscape_4_3"
        },
        {
            id: 6,
            name: "水质检测咨询服务",
            description: "专业的水质检测咨询服务，包括方案设计、数据分析和报告生成。",
            price: 5999,
            category: "solutions",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=water%20quality%20consulting%20service%2C%20professional%20team%2C%20data%20analysis&image_size=landscape_4_3"
        },
        // Chip products
        {
            id: 7,
            name: "Au/ND/C₃N₄ 复合基底芯片",
            description: "检测四环素，检测限10⁻¹² M，自清洁功能，稳定性好。",
            price: 1999,
            category: "chips",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=microchip%20for%20water%20quality%20testing%2C%20scientific%20equipment%2C%20blue%20and%20silver%20design&image_size=landscape_4_3",
            pollutants: ["tetracycline"],
            type: "抗生素",
            detectionLimit: "10⁻¹² M",
            features: "自清洁：可见光6h降解率97.3%；稳定性：30天信号保留84.8%；增强因子EF=6.67×10⁶"
        },
        {
            id: 8,
            name: "UL-AuAgMSs@β-CD 复合基底芯片",
            description: "检测毒死蜱、有机磷农药、结晶紫等，检测限10⁻¹³ M。",
            price: 2499,
            category: "chips",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=microchip%20for%20water%20quality%20testing%2C%20scientific%20equipment%2C%20green%20and%20silver%20design&image_size=landscape_4_3",
            pollutants: ["chlorpyrifos", "crystal-violet", "methylene-blue", "methyl-orange"],
            type: "农药/染料",
            detectionLimit: "10⁻¹³ M (CV探针)",
            features: "海胆状金银微米颗粒+β-CD分子识别；RSD=9.10% (n=13)；21天信号保留73.35%；可检测多种有机磷农药"
        },
        {
            id: 9,
            name: "Au/CCN-NWs/Al 芯片",
            description: "检测联苯胺，检测限1 μg/L，电增强吸附，120秒快速富集。",
            price: 1799,
            category: "chips",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=microchip%20for%20water%20quality%20testing%2C%20scientific%20equipment%2C%20purple%20and%20silver%20design&image_size=landscape_4_3",
            pollutants: ["benzidine"],
            type: "有机污染物（I类致癌物）",
            detectionLimit: "1 μg/L",
            features: "电增强吸附，120秒快速富集；RSD=9.11% (n=100)；回收率95.55%~109.46%"
        },
        {
            id: 10,
            name: "Au/PCPCN 芯片",
            description: "检测福美双、结晶紫，检测限10⁻¹¹ M，级联内建电场。",
            price: 2199,
            category: "chips",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=microchip%20for%20water%20quality%20testing%2C%20scientific%20equipment%2C%20red%20and%20silver%20design&image_size=landscape_4_3",
            pollutants: ["thiram", "crystal-violet"],
            type: "农药/染料",
            detectionLimit: "10⁻¹¹ M (福美双)",
            features: "磷掺杂晶态/非晶态聚合氮碳，级联内建电场；EF=5.53×10⁵；5周信号保留91.1%"
        },
        {
            id: 11,
            name: "Au-SnO₂ resonator 芯片",
            description: "检测环丙沙星，光捕获结构增强SERS，适用于水环境抗生素残留检测。",
            price: 1899,
            category: "chips",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=microchip%20for%20water%20quality%20testing%2C%20scientific%20equipment%2C%20yellow%20and%20silver%20design&image_size=landscape_4_3",
            pollutants: ["ciprofloxacin"],
            type: "抗生素（氟喹诺酮类）",
            detectionLimit: "待补充",
            features: "光捕获结构增强SERS，适用于水环境抗生素残留检测"
        },
        {
            id: 12,
            name: "Ag@ZnS 核壳结构芯片",
            description: "检测4-氨基苯硫酚、罗丹明6G、亚甲基蓝，检测限10⁻⁸ M。",
            price: 2299,
            category: "chips",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=microchip%20for%20water%20quality%20testing%2C%20scientific%20equipment%2C%20blue%20and%20gold%20design&image_size=landscape_4_3",
            pollutants: ["4-atp", "rhodamine-6g", "methylene-blue"],
            type: "农药中间体/染料",
            detectionLimit: "10⁻⁸ M (4-ATP), 10⁻⁹ M (R6G)",
            features: "核壳结构抑制Ag氧化；28天信号保留79.5%；RSD<5.50% (n=16)"
        },
        {
            id: 13,
            name: "Au@Hg-C₃N₄ 芯片",
            description: "检测L-半胱氨酸、D-半胱氨酸，双模式检测(SERS+SALDI-MS)。",
            price: 2599,
            category: "chips",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=microchip%20for%20water%20quality%20testing%2C%20scientific%20equipment%2C%20silver%20and%20white%20design&image_size=landscape_4_3",
            pollutants: ["cysteine"],
            type: "生物分子/氨基酸",
            detectionLimit: "10⁻⁸ M (SERS), 0.25 μM (SALDI-MS)",
            features: "双模式检测（SERS+SALDI-MS），可区分手性对映体；RSD=12.37%"
        },
        {
            id: 14,
            name: "BDD 电极芯片",
            description: "检测铅离子(Pb²⁺)，检测限2.62 ppb，电位窗口2.2 V，抗干扰能力强。",
            price: 1699,
            category: "chips",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=microchip%20for%20water%20quality%20testing%2C%20scientific%20equipment%2C%20black%20and%20silver%20design&image_size=landscape_4_3",
            pollutants: ["lead"],
            type: "重金属",
            detectionLimit: "2.62 ppb",
            features: "硼掺杂金刚石薄膜电极；电位窗口2.2 V；线性范围5-30 ppb；抗干扰能力强"
        }
    ];
    
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count
    function updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // Update cart UI
    function updateCartUI() {
        const cartItems = document.getElementById('cartItems');
        const totalPrice = document.querySelector('.total-price');
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <p>购物车为空</p>
                </div>
            `;
            totalPrice.textContent = '¥0';
            return;
        }
        
        let cartHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const itemTotal = product.price * item.quantity;
                total += itemTotal;
                
                cartHTML += `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="cart-item-info">
                            <div class="cart-item-title">${product.name}</div>
                            <div class="cart-item-price">¥${product.price.toLocaleString()}</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                                <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                                <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            </div>
                            <button class="cart-item-remove" data-id="${item.id}">移除</button>
                        </div>
                    </div>
                `;
            }
        });
        
        cartItems.innerHTML = cartHTML;
        totalPrice.textContent = `¥${total.toLocaleString()}`;
        
        // Add event listeners to cart items
        addCartItemListeners();
    }
    
    // Add event listeners to cart items
    function addCartItemListeners() {
        // Decrease quantity
        document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const item = cart.find(item => item.id === id);
                if (item && item.quantity > 1) {
                    item.quantity--;
                    updateCart();
                }
            });
        });
        
        // Increase quantity
        document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const item = cart.find(item => item.id === id);
                if (item) {
                    item.quantity++;
                    updateCart();
                }
            });
        });
        
        // Quantity input change
        document.querySelectorAll('.cart-item-quantity input').forEach(input => {
            input.addEventListener('change', function() {
                const id = parseInt(this.dataset.id);
                const quantity = parseInt(this.value);
                if (quantity >= 1) {
                    const item = cart.find(item => item.id === id);
                    if (item) {
                        item.quantity = quantity;
                        updateCart();
                    }
                }
            });
        });
        
        // Remove item
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                cart = cart.filter(item => item.id !== id);
                updateCart();
            });
        });
    }
    
    // Update cart
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartUI();
    }
    
    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id, quantity: 1 });
            }
            
            updateCart();
            
            // Show success message
            this.textContent = '已加入购物车';
            this.style.background = '#4CAF50';
            
            setTimeout(() => {
                this.textContent = '加入购物车';
                this.style.background = '';
            }, 2000);
        });
    });
    
    // Category filtering
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.dataset.category;
            
            // Filter products
            document.querySelectorAll('.product-card').forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Cart button toggle
    const cartButton = document.getElementById('cartButton');
    const shoppingCart = document.querySelector('.shopping-cart');
    const cartClose = document.querySelector('.cart-close');
    
    cartButton.addEventListener('click', function() {
        shoppingCart.classList.toggle('active');
        // Close recommendation panel if open
        document.querySelector('.chip-recommendation').classList.remove('active');
    });
    
    cartClose.addEventListener('click', function() {
        shoppingCart.classList.remove('active');
    });
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('购物车为空，请先添加商品');
            return;
        }
        
        // Simple checkout process
        alert('结算功能开发中，敬请期待！');
    });
    
    // Chip Recommendation System
    const recommendationButton = document.getElementById('recommendationButton');
    const chipRecommendation = document.querySelector('.chip-recommendation');
    const recommendationClose = document.querySelector('.recommendation-close');
    const recommendBtn = document.getElementById('recommendBtn');
    const recommendationResults = document.getElementById('recommendationResults');
    
    // Toggle recommendation panel
    recommendationButton.addEventListener('click', function() {
        chipRecommendation.classList.toggle('active');
        // Close shopping cart if open
        shoppingCart.classList.remove('active');
    });
    
    recommendationClose.addEventListener('click', function() {
        chipRecommendation.classList.remove('active');
    });
    
    // Recommend chips based on selected pollutants
    recommendBtn.addEventListener('click', function() {
        // Get selected pollutants
        const selectedPollutants = [];
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            selectedPollutants.push(checkbox.value);
        });
        
        if (selectedPollutants.length === 0) {
            alert('请至少选择一种污染物');
            return;
        }
        
        // Filter chips that can detect the selected pollutants
        const recommendedChips = products.filter(product => {
            if (product.category !== 'chips' || !product.pollutants) return false;
            
            // Check if the chip can detect any of the selected pollutants
            return selectedPollutants.some(pollutant => product.pollutants.includes(pollutant));
        });
        
        // Display recommended chips
        if (recommendedChips.length === 0) {
            recommendationResults.innerHTML = `
                <h4>推荐芯片</h4>
                <div class="recommendation-empty">
                    <p>暂无适合的芯片推荐</p>
                </div>
            `;
        } else {
            let recommendationHTML = '<h4>推荐芯片</h4>';
            
            recommendedChips.forEach(chip => {
                // Calculate match percentage
                const matchCount = chip.pollutants.filter(p => selectedPollutants.includes(p)).length;
                const matchPercentage = Math.round((matchCount / selectedPollutants.length) * 100);
                
                recommendationHTML += `
                    <div class="recommendation-item">
                        <div class="recommendation-item-image">
                            <img src="${chip.image}" alt="${chip.name}">
                        </div>
                        <div class="recommendation-item-info">
                            <div class="recommendation-item-title">${chip.name}</div>
                            <div class="recommendation-item-description">${chip.description}</div>
                            <div class="recommendation-item-description">匹配度：${matchPercentage}%</div>
                            <div class="recommendation-item-price">¥${chip.price.toLocaleString()}</div>
                            <button class="recommendation-item-add" data-id="${chip.id}">加入购物车</button>
                        </div>
                    </div>
                `;
            });
            
            recommendationResults.innerHTML = recommendationHTML;
            
            // Add event listeners to add buttons
            document.querySelectorAll('.recommendation-item-add').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.dataset.id);
                    const existingItem = cart.find(item => item.id === id);
                    
                    if (existingItem) {
                        existingItem.quantity++;
                    } else {
                        cart.push({ id, quantity: 1 });
                    }
                    
                    updateCart();
                    
                    // Show success message
                    this.textContent = '已加入购物车';
                    this.style.background = '#4CAF50';
                    
                    setTimeout(() => {
                        this.textContent = '加入购物车';
                        this.style.background = '';
                    }, 2000);
                });
            });
        }
    });
    
    // Initialize cart
    updateCartCount();
    updateCartUI();
    
    // Product detail modal
    const productModal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');
    const modalAddToCart = document.getElementById('modalAddToCart');
    
    // Current product ID
    let currentProductId = null;
    
    // Show product detail modal
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            currentProductId = id;
            
            // Find product by ID
            const product = products.find(p => p.id === id);
            if (product) {
                // Update modal content
                document.getElementById('modalTitle').textContent = '产品详情';
                document.getElementById('modalProductName').textContent = product.name;
                document.getElementById('modalImage').src = product.image;
                document.getElementById('modalImage').alt = product.name;
                document.getElementById('modalPrice').textContent = `¥${product.price.toLocaleString()}`;
                
                // Update chip-specific details
                if (product.category === 'chips') {
                    document.getElementById('modalProductId').textContent = product.id - 6; // Adjust for chip numbering
                    document.getElementById('modalDetectionTarget').textContent = getDetectionTarget(product);
                    document.getElementById('modalPollutantType').textContent = product.type || '未知';
                    document.getElementById('modalDetectionLimit').textContent = product.detectionLimit || '待补充';
                    document.getElementById('modalKeyFeatures').textContent = product.features || '暂无数据';
                } else {
                    // For non-chip products
                    document.getElementById('modalProductId').textContent = product.id;
                    document.getElementById('modalDetectionTarget').textContent = 'N/A';
                    document.getElementById('modalPollutantType').textContent = 'N/A';
                    document.getElementById('modalDetectionLimit').textContent = 'N/A';
                    document.getElementById('modalKeyFeatures').textContent = product.description || 'N/A';
                }
                
                // Show modal
                productModal.classList.add('active');
            }
        });
    });
    
    // Close modal
    modalClose.addEventListener('click', function() {
        productModal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    productModal.addEventListener('click', function(e) {
        if (e.target === productModal) {
            productModal.classList.remove('active');
        }
    });
    
    // Add to cart from modal
    modalAddToCart.addEventListener('click', function() {
        if (currentProductId) {
            const existingItem = cart.find(item => item.id === currentProductId);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id: currentProductId, quantity: 1 });
            }
            
            updateCart();
            
            // Show success message
            modalAddToCart.textContent = '已加入购物车';
            modalAddToCart.style.background = '#4CAF50';
            
            setTimeout(() => {
                modalAddToCart.textContent = '加入购物车';
                modalAddToCart.style.background = '';
            }, 2000);
        }
    });
    
    // Helper function to get detection target
    function getDetectionTarget(product) {
        if (product.name === 'Au/ND/C₃N₄ 复合基底芯片') {
            return '四环素（Tetracycline）';
        } else if (product.name === 'UL-AuAgMSs@β-CD 复合基底芯片') {
            return '毒死蜱(CPF)、有机磷农药、结晶紫(CV)、亚甲基蓝(MB)、甲基橙(MO)';
        } else if (product.name === 'Au/CCN-NWs/Al 芯片') {
            return '联苯胺（Benzidine）';
        } else if (product.name === 'Au/PCPCN 芯片') {
            return '福美双（Thiram）、结晶紫(CV)';
        } else if (product.name === 'Au-SnO₂ resonator 芯片') {
            return '环丙沙星（Ciprofloxacin）';
        } else if (product.name === 'Ag@ZnS 核壳结构芯片') {
            return '4-氨基苯硫酚（4-ATP）、罗丹明6G(R6G)、亚甲基蓝(MB)';
        } else if (product.name === 'Au@Hg-C₃N₄ 芯片') {
            return 'L-半胱氨酸（L-Cysteine）、D-半胱氨酸';
        } else if (product.name === 'BDD 电极芯片') {
            return '铅离子(Pb²⁺)';
        } else {
            return 'N/A';
        }
    }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    initAIAssistant();
    initShop();
});