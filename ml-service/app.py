from flask import Flask, jsonify
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 