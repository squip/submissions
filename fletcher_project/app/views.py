
from flask import render_template, request
from app import app
import pickle
import pandas as pd

pills = [
    {'Live Feed': '/feed'},
    {'Last 5 Minutes': '/index'}
    ]

@app.route('/')
@app.route('/index')
def index():
    fname = '/Users/essorensen/Projects/dsbc-nyc2014/E_fletcher/radioscribe/app\
/static/txt/textstream.txt'
    with open(fname) as f:
        content = f.readlines()

    user = {'nickname': 'SQUIP'}  # fake user
    data = [  # fake array of posts
        {'file': 'clusters_example.csv'},
        {'file': 'clusters_full_day.csv'},
        {'file': 'clusters_full_day.csv'}
    ]

    return render_template('index.html',
                           title='Home',
                           user=user,
                           content=content
                           )

@app.route('/day')
def day():
    user = {'nickname': 'SQUIP'}  # fake user                                  
    data = [  # fake array of posts                                            
        {'file': 'clusters_full_day.csv'},
        {'file': 'clusters_full_day.csv'}
    ]
    return render_template('index.html',
                           title='Home',
                           user=user,
                           data=data
                           )

@app.route('/minute')
def minute():
    user = {'nickname': 'SQUIP'}  # fake user                                  
    data = [  # fake array of posts                                            
        {'file': 'clusters_example.csv'},
        {'file': 'clusters_full_day.csv'}
    ]
    return render_template('index.html',
                           title='Home',
                           user=user,
                           data=data
                           )


@app.route('/hour')
def hour():
    user = {'nickname': 'SQUIP'}  # fake user                                                              
    data = [  # fake array of posts                                                                        
        {'file': 'clusters_hour.csv'},
        {'file': 'clusters_full_day.csv'}
    ]
    return render_template('index.html',
                           title='Home',
                           user=user,
                           data=data
                           )


@app.route('/feed')
def feed():
    fname = '/Users/essorensen/Projects/dsbc-nyc2014/E_fletcher/radioscribe/app/static/txt/textstream.txt'
    with open(fname) as f:
        content = f.readlines()

    return render_template('index.html',
                           content=content
                           )


@app.route('/data/textstream.txt')
def textstream():
    fname = '/Users/essorensen/Projects/dsbc-nyc2014/E_fletcher/radioscribe/app/static/txt/textstream.txt'
    with open(fname, 'r') as txt:
        return txt.read()

@app.route('/<window>/cluster/<int:cluster_id>/<label>')
def show_timeline(window, cluster_id, label):
    cluster_pickle = '/Users/essorensen/Projects/dsbc-nyc2014/E_fletcher/radioscribe/\
app/static/data/' + window + '/' + 'cluster_contents.pkl'
    cluster_contents = pickle.load( open( cluster_pickle, "rb" ) )
    number_topics = len(cluster_contents[cluster_id])
#    for cluster in cluster_contents[cluster_id]:
 #       return 'Phrases found for cluster %d: %s' % (cluster_id, cluster)
    return render_template('index.html',
                           cluster_contents=cluster_contents[cluster_id],
                           number_topics=number_topics,
                           window=window,
                           label=label
                           )
