from flaskr import db
#from flask.ext.login import UserMixin
#from . import login_manager,db

ROLE_USER = 0
ROLE_ADMIN = 1

class User(db.Model):
    __tablename__ = 'user'
    id_u = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(64), unique = True)
    role = db.Column(db.SmallInteger, default = ROLE_USER)
    password=db.Column(db.String(64))

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

    def __repr__(self):
        return '<User %r>' % (self.username)
        
class Demo(db.Model):
    __tablename__ = 'demo'
    id_d = db.Column(db.String(64), primary_key = True)
    year = db.Column(db.String(64))
    company = db.Column(db.String(64))
    asset = db.Column(db.String(64))
    debt = db.Column(db.String(64))
    current_assets = db.Column(db.String(64))
    inventory = db.Column(db.String(64))
    prepayment = db.Column(db.String(64))
    unamortized_expenses = db.Column(db.String(64))
    current_liabilitie = db.Column(db.String(64))
    account_receivable = db.Column(db.String(64))
    turnover_days = db.Column(db.String(64))
    IDD = db.Column(db.String(64))
    DPO = db.Column(db.String(64))
    unit = db.Column(db.String(64))

    

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

    def __repr__(self):
        return 'id:%r' % (self.id)