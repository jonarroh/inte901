from flask import request, jsonify, Blueprint
from db.db import db_instance  # Import the instance of DB
from datetime import timedelta
from datetime import datetime

reportes = Blueprint('reportes', __name__)


@reportes.route('/reportes/ventas', methods=['POST'])
def get_ventas():
    date = request.json.get('date')

    match date:
        case 'last_week':
            return get_Ventas_by_last_week()
        case 'last_day':
            return get_ventas_by_last_day()
        case 'last_month':
            return get_ventas_by_last_month()
        case 'last_trimester':
            return get_ventas_by_last_trimester()
        case _:
            return jsonify({
                'message': 'Invalid date'
            })
        
def get_Ventas_by_last_week():
    current_date = datetime.now()
    last_week_start = current_date - timedelta(days=current_date.weekday() + 7)
    last_week_end = last_week_start + timedelta(days=6)

    query = """
    SELECT * FROM Purchases WHERE CreatedAt BETWEEN :start_date AND :end_date
    """
    params = {
        'start_date': last_week_start,
        'end_date': last_week_end
    }
    result = db_instance.execute_query(query, params)
    return jsonify({
        'data': result
    })

def get_ventas_by_last_day():
    current_date = datetime.now()
    last_day_start = current_date - timedelta(days=1)
    last_day_end = last_day_start + timedelta(days=1)

    query = """
    SELECT * FROM Purchases WHERE CreatedAt BETWEEN :start_date AND :end_date
    """
    params = {
        'start_date': last_day_start,
        'end_date': last_day_end
    }
    result = db_instance.execute_query(query, params)
    return jsonify({
        'data': result
    })

def get_ventas_by_last_month():
    current_date = datetime.now()
    last_month_start = current_date - timedelta(days=current_date.day)
    last_month_end = last_month_start + timedelta(days=30)

    query = """
    SELECT * FROM Purchases WHERE CreatedAt BETWEEN :start_date AND :end_date
    """
    params = {
        'start_date': last_month_start,
        'end_date': last_month_end
    }
    result = db_instance.execute_query(query, params)
    return jsonify({
        'data': result
    })

def get_ventas_by_last_trimester():
    current_date = datetime.now()
    last_trimester_start = current_date - timedelta(days=current_date.day)
    last_trimester_end = last_trimester_start + timedelta(days=90)

    query = """
    SELECT * FROM Purchases WHERE CreatedAt BETWEEN :start_date AND :end_date
    """
    params = {
        'start_date': last_trimester_start,
        'end_date': last_trimester_end
    }
    result = db_instance.execute_query(query, params)
    return jsonify({
        'data': result
    })


inventory_category = {
    'low': 20,
    'medium': 50,
    'high': 100
}
