__author__ = 'John Jackson'

import urllib.request
import json
from Game import Game
from ScoreView import ScoreView

##
# Returns a list of Games.
##
def getGames():
    #Get a response from nfl.com
    url = urllib.request.urlopen( "http://www.nfl.com/liveupdate/scorestrip/ss.json" )

    #Get the JSON string
    page = url.read().decode( 'utf-8' )
    print( type( page ) )

    #Load the string
    res = json.loads( page )

    #Container for games this week.
    theGames = []

    for item in res['gms']:
        aGame = Game( item['hnn'], item['hs'], item['vnn'], item['vs'], item['q'] )
        theGames.append( aGame )

    return theGames

###
# Initializes view.
###
def viewGames( games ):
    theView = ScoreView( games )

viewGames( getGames() )