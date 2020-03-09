from flask import render_template, request, jsonify
import os, json

from decimal import Decimal

import pandas as pd
import numpy as np

from . import main

@main.route('/', methods=['GET'])
def index():
	return render_template("home.html")

@main.route('/cats', methods = ['GET', 'POST'])
def cats():
	return render_template("cats.html")

@main.route('/map', methods = ['GET', 'POST'])
def map():

	df = pd.read_csv('../../school_color.csv')
	df = df[:100]
	data = df.to_json(orient='records')
	return render_template("map.html", data=data)

	return render_template("map.html")

@main.route('/sliders', methods=["GET"])
def sliders():
	return render_template("sliders.html")
