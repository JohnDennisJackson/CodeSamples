__author__ = 'John Jackson'

from tkinter import *

##
# A Window for displaying a game's scores and state.
##
class ScoreView():
    quarterDict =   {
                      '1' : ' 1',
                      '2' : ' 2',
                      '3' : ' 3',
                      '4' : ' 4',
                      'H' : 'H',
                      'P' : '0',
                      'F' : 'F',
                      'OT' : 'O',
                      'FOT' : 'F'
                    }
    ##
    # Constructor
    #
    # @param the_games List A list of games.
    ##
    def __init__( self, the_games ):
        self.root = Tk()
        self.myGames = the_games
        self.gamesFrame = Frame( self.root )
        self.gamesCanvas = Canvas( self.gamesFrame, relief=SUNKEN, bd=2 )
        self.gameFramePanel = Frame( self.gamesCanvas )

        curr_row = 0
        in_col = 0;
        col = 0;

        #Create labels containing all game stats
        for game in self.myGames:

            if in_col % 4 == 0:
                col += 1
                curr_row = 0

            gamePanel = Frame( self.gamesCanvas, relief=RAISED, bd=4, background='#FFF' )

            home = Label( gamePanel )
            home_abbr = Label( home, text=game.details[ 'home_team' ], anchor=W, height=2, width=10 ).grid( row=0,column=0  )
            home_score = Label( home, text=game.details[ 'home_score' ], anchor=W, height=2, width=5 ).grid( row=0, column=1 )

            visitor = Label( gamePanel )
            visitor_abbr = Label( visitor, text=game.details[ 'visiting_team' ], anchor=W, height=2, width=10 ).grid( row=1,column=0  )
            visitor_score = Label( visitor, text=game.details[ 'visiting_score' ], anchor=W, height=2, width=5 ).grid( row=1, column=1 )

            quarterVal = ScoreView.quarterDict[ game.details[ 'quarter' ] ]

            quarter = Label( gamePanel, text=quarterVal )

            home.grid( row=curr_row, column=0 )
            visitor.grid( row=curr_row + 1, column=0 )
            quarter.grid( row = curr_row, column=1 )

            gamePanel.grid( row=curr_row, column=col )
            in_col+=1;
            curr_row += 2

        self.scrollbar = Scrollbar( self.gamesCanvas, orient=VERTICAL )
        self.gamesCanvas['yscrollcommand'] = self.scrollbar.set
        self.gamesCanvas.create_window((0,0),window=self.gameFramePanel,anchor='nw')
        self.gameFramePanel.bind("<Configure>", self.gamesCanvas.configure(scrollregion=self.gamesCanvas.bbox("all"),height=350))
        self.scrollbar.configure( command=self.gamesCanvas.yview )

        self.scrollbar.grid( column=col+1, sticky=N+S)
        self.gamesFrame.grid( row=0, column=0 )

        self.root.mainloop()
