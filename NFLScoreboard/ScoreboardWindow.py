__author__ = 'John Jackson'

import tkinter

##
# Root window on scoreboard.
##
class ScoreboardWindow( tkinter.Canvas ):

    ##
    # Constructor
    #
    # @param root Root Window Pane.
    ##
    def __init__(self, root):
        tkinter.Canvas.__init__(self, root)
        self.frame = tkinter.Frame(self)

        bag_display_frame1 = tkinter.Frame(self)
        bag_display_frame2 = tkinter.Frame(bag_display_frame1)
        scrollbar = tkinter.Scrollbar(bag_display_frame2, orient=tkinter.VERTICAL)
        self.bag_display = tkinter.Listbox(bag_display_frame1, yscrollcommand=scrollbar.set)

        scrollbar.config(command=self.bag_display.yview)

        self.frame.place(relx=.55, rely=.02, relheight=1, relwidth=1)
        bag_display_frame1.place(relx=.02, rely=.05, relheight=.9, relwidth=.5)
        bag_display_frame2.pack(side=tkinter.RIGHT, fill=tkinter.BOTH, expand=1)
        self.bag_display.pack(fill=tkinter.X, expand=1)
        scrollbar.pack(side=tkinter.RIGHT, fill=tkinter.BOTH, expand=1)

        self.pack()

root = tkinter.Tk()

a = ScoreboardWindow(root)
a.bag_display.insert()
root.mainloop()