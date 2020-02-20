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
	return render_template("map.html")
