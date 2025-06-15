from flask import Flask, request, jsonify, render_template, url_for
import xgboost as xgb
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__,
            static_folder='static',
            template_folder='templates')

# Enable CORS (allows Flask to accept requests from different origins)
from flask_cors import CORS
CORS(app)

model_path = os.path.join('app/model', 'xgb_price_prediction_model.json')
columns_path = os.path.join('app/model', 'model_columns.pkl')
print("Looking for model at:", os.path.abspath(model_path))


# Load trained ML model
model = xgb.XGBRegressor()
model.load_model(model_path)

# Load column structure used during training
model_columns = joblib.load(columns_path)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    input_data = request.get_json()

    try:
        # Convert JSON to DataFrame
        input_df = pd.DataFrame([input_data])

        # One hot encode categorical features
        input_df = pd.get_dummies(input_df)

        # Reindex to match training columns
        input_df = input_df.reindex(columns=model_columns, fill_value=0)

        # Predict
        log_price = model.predict(input_df)[0]
        price = np.exp(log_price)

        return jsonify({'predicted_price': float(round(price, 0))})
    
    except Exception as e:
        return jsonify({'error': str(e)})
    
if __name__== '__main__':
    app.run(debug=True)