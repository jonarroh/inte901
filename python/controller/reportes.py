from flask import request, jsonify, Blueprint
from db.db import db_instance  
from datetime import timedelta
from datetime import datetime
import random
from matplotlib import colors as mcolors

reportes = Blueprint('reportes', __name__)


@reportes.route('/reportes/users', methods=['POST'])
def get_users():
    query = """
    SELECT 
    u.Name + ' ' + u.LastName AS FullName,
    COUNT(o.Id) AS OrderCount
    FROM Orders o
    INNER JOIN Users u ON o.IdClient = u.Id
    GROUP BY u.Name, u.LastName;
    """
    result = db_instance.execute_query(query)

    labels = [
        user['FullName'] for user in result
    ]

    datasets = [
        {
            'label': 'Cantidad de ordenes',
            'data': [user['OrderCount'] for user in result],
            'fill': False,
            'backgroundColor': 'rgb(255, 99, 132)',
            'borderColor': 'rgb(255, 99, 132)',
        }
    ]

    return jsonify({
        'labels': labels,
        'datasets': datasets
    })


# https://www.chartjs.org/docs/latest/charts/bar.html
# Horizontal Bar Chart
@reportes.route('/reportes/InventarioMPs', methods=['POST'])
def get_inventory():
    QUERY = """
    SELECT * FROM InventarioMPs imp 
    inner join MateriasPrimas mp on mp.Id = imp.IdMateriaPrima
    WHERE imp.estatus = 1
    """
    result = db_instance.execute_query(QUERY)

    labels = [
        Material['Material'] for Material in result
    ]
    colors  = [
                random.choice(list(mcolors.CSS4_COLORS.values())) for _ in range(len(result))

            ]
    datasets =[
        {
            'axis': 'y',
            'label': 'Cantidad de materia prima',
            'data': [Material['Cantidad'] for Material in result],
            'fill': False,
            'backgroundColor': colors,
            'borderColor': colors,
        }
    ]



    return jsonify({
        'labels': labels,
        'datasets': datasets
    })



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
    SELECT * FROM Orders WHERE OrderDate BETWEEN :start_date AND :end_date
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
    SELECT * FROM   Orders WHERE OrderDate BETWEEN :start_date AND :end_date
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
    SELECT * FROM Orders WHERE OrderDate BETWEEN :start_date AND :end_date
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
