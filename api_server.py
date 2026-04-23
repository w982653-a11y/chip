

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import numpy as np
from datetime import datetime
import json
import random
import os
from dotenv import load_dotenv

# 加载.env文件
load_dotenv()

app = Flask(__name__)
CORS(app)

# API密钥配置
API_KEY = 'sk-ce0624408f014ae8a6e82e990ccb36e7'  # 直接设置API密钥

# 模拟AI分析模型
class WaterQualityAI:
    def __init__(self):
        self.pollutants = {
            'lead': {'name': '铅', 'threshold': 0.01, 'unit': 'mg/L'},
            'mercury': {'name': '汞', 'threshold': 0.001, 'unit': 'mg/L'},
            'cadmium': {'name': '镉', 'threshold': 0.005, 'unit': 'mg/L'},
            'arsenic': {'name': '砷', 'threshold': 0.01, 'unit': 'mg/L'}
        }
        
    def analyze_spectrum(self, spectral_data):
        """分析光谱数据，检测污染物"""
        results = []
        for key, pollutant in self.pollutants.items():
            # 模拟污染物检测
            concentration = pollutant['threshold'] * (0.1 + 0.8 * random.random())
            is_safe = concentration < pollutant['threshold']
            
            results.append({
                'name': pollutant['name'],
                'concentration': round(concentration, 6),
                'threshold': pollutant['threshold'],
                'unit': pollutant['unit'],
                'status': '安全' if is_safe else '超标'
            })
        return results
    
    def predict_trend(self, historical_data, hours=24):
        """预测水质趋势"""
        if not historical_data or len(historical_data) < 2:
            return []
        
        last_value = historical_data[-1]
        predictions = []
        
        for i in range(1, hours + 1):
            variation = (random.random() - 0.5) * 0.2
            predicted_value = max(0, last_value + variation * i)
            predictions.append(round(predicted_value, 2))
        
        return predictions
    
    def process_realtime_data(self, data):
        """处理实时水质数据"""
        processed_data = {
            'value': data['value'],
            'metric': data['metric'],
            'processed': True,
            'timestamp': datetime.now().isoformat(),
            'confidence': round(0.9 + 0.1 * random.random(), 2),
            'anomalies': ['检测到异常波动'] if random.random() > 0.9 else []
        }
        return processed_data
    
    def generate_conclusion(self, detection_results):
        """生成分析结论"""
        超标污染物 = [r for r in detection_results if r['status'] != '安全']
        
        if not 超标污染物:
            return {
                'status': '安全',
                'message': '水中未检测到超标污染物，水质符合标准。',
                'recommendation': '建议定期进行水质监测，保持良好的水资源管理。'
            }
        else:
            超标名称 = '、'.join([p['name'] for p in 超标污染物])
            return {
                'status': '超标',
                'message': f'水中检测到{超标名称}超标，需要采取相应措施。',
                'recommendation': '建议立即停止使用该水源，并联系专业机构进行处理。'
            }

# 初始化AI模型
ai_model = WaterQualityAI()

# 存储历史数据
historical_data = {
    'ph': [],
    'temperature': [],
    'turbidity': [],
    'dissolved_oxygen': []
}

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'model_loaded': True
    })

@app.route('/api/analyze/spectrum', methods=['POST'])
def analyze_spectrum():
    """光谱分析接口"""
    try:
        data = request.json
        spectral_data = data.get('spectral_data', {})
        
        # 分析光谱数据
        detection_results = ai_model.analyze_spectrum(spectral_data)
        
        # 生成分析结论
        conclusion = ai_model.generate_conclusion(detection_results)
        
        return jsonify({
            'success': True,
            'data': {
                'detection_results': detection_results,
                'conclusion': conclusion,
                'analysis_time': datetime.now().isoformat()
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/predict/trend', methods=['POST'])
def predict_trend():
    """趋势预测接口"""
    try:
        data = request.json
        metric_type = data.get('metric_type', 'ph')
        hours = data.get('hours', 24)
        
        # 获取历史数据
        history = historical_data.get(metric_type, [])
        
        # 预测趋势
        predictions = ai_model.predict_trend(history, hours)
        
        return jsonify({
            'success': True,
            'data': {
                'metric_type': metric_type,
                'historical_data': history,
                'predicted_data': predictions,
                'prediction_hours': hours
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/process/realtime', methods=['POST'])
def process_realtime():
    """实时数据处理接口"""
    try:
        data = request.json
        
        # 处理实时数据
        processed_data = ai_model.process_realtime_data(data)
        
        # 存储历史数据
        metric_type = data.get('metric', 'unknown')
        value = data.get('value', 0)
        
        if metric_type in historical_data:
            historical_data[metric_type].append(value)
            if len(historical_data[metric_type]) > 24:
                historical_data[metric_type].pop(0)
        
        return jsonify({
            'success': True,
            'data': processed_data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/metrics/update', methods=['POST'])
def update_metrics():
    """批量更新指标数据"""
    try:
        data = request.json
        metrics = data.get('metrics', [])
        
        results = []
        for metric in metrics:
            processed = ai_model.process_realtime_data(metric)
            results.append(processed)
            
            # 存储历史数据
            metric_type = metric.get('metric', 'unknown')
            value = metric.get('value', 0)
            
            if metric_type in historical_data:
                historical_data[metric_type].append(value)
                if len(historical_data[metric_type]) > 24:
                    historical_data[metric_type].pop(0)
        
        return jsonify({
            'success': True,
            'data': {
                'processed_metrics': results,
                'historical_data': historical_data
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/historical/data', methods=['GET'])
def get_historical_data():
    """获取历史数据"""
    try:
        metric_type = request.args.get('metric_type')
        
        if metric_type:
            data = historical_data.get(metric_type, [])
        else:
            data = historical_data
        
        return jsonify({
            'success': True,
            'data': data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/model/status', methods=['GET'])
def model_status():
    """获取AI模型状态"""
    return jsonify({
        'success': True,
        'data': {
            'model_loaded': True,
            'model_type': 'WaterQualityAI',
            'pollutants_count': len(ai_model.pollutants),
            'historical_data_points': sum(len(v) for v in historical_data.values())
        }
    })

# 静态文件服务
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

# 测试API密钥
@app.route('/api/test/key', methods=['GET'])
def test_api_key():
    """测试API密钥是否正确加载"""
    env_api_key = os.environ.get('API_KEY')
    dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
    dotenv_exists = os.path.exists(dotenv_path)
    dotenv_content = None
    
    if dotenv_exists:
        try:
            with open(dotenv_path, 'r', encoding='utf-8') as f:
                dotenv_content = f.read()
        except Exception as e:
            dotenv_content = f"读取错误: {str(e)}"
    
    return jsonify({
        'success': True,
        'data': {
            'api_key_loaded': API_KEY is not None,
            'api_key_length': len(API_KEY) if API_KEY else 0,
            'api_key_preview': API_KEY[:20] + '...' if API_KEY else '',
            'env_api_key': env_api_key[:20] + '...' if env_api_key else None,
            'dotenv_path': dotenv_path,
            'dotenv_exists': dotenv_exists,
            'dotenv_content': dotenv_content,
            'current_dir': os.getcwd()
        }
    })

if __name__ == '__main__':
    print("="*60)
    print("🌐 水质监测系统 - AI数据分析API服务")
    print("="*60)
    print("📡 API服务启动中...")
    print("🔗 访问地址: http://localhost:5000")
    print("📚 API文档: http://localhost:5000/api/health")
    print("="*60)
    
    app.run(host='0.0.0.0', port=5000, debug=True)