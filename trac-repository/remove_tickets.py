from pysqlite2 import dbapi2 as sqlite
import sys
trac_env = "/home/mphilpot/htdocs/isupergp/trac-repository/db/trac.db"

try:
	id = sys.argv[1]
except:
	print "Usage: remove_tickets.py id #Removes all tickets above id"
	sys.exit()

con = sqlite.connect(trac_env)
cur = con.cursor()
cur.execute("DELETE FROM ticket WHERE id > ?", (id,))
cur.execute("DELETE FROM ticket_change WHERE ticket > ?", (id,))
cur.execute("DELETE FROM attachment WHERE type='ticket' and id > ?", (id,))
cur.execute("DELETE FROM ticket_custom WHERE ticket > ?", (id,))

con.commit()
print "Tickets above %s deleted" % id
