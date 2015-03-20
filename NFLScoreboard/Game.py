__author__ = 'John Jackson'

##
# Container for game state and vitals.
##
class Game:
    ##
    # Constructor.
    ##
    def __init__( self, hm, hs, aw, aws, q ):
        self.details = {}
        self.details[ 'home_team' ] = hm
        self.details[ 'home_score' ] = hs
        self.details[ 'visiting_team' ] = aw
        self.details[ 'visiting_score' ] = aws
        self.details[ 'quarter' ] = q
        #self.details[ 'date' ] = d

    ##
    # Returns details of Game.
    #
    # @return A list of details.
    ##
    def getDetails( self ):
        return self.details



