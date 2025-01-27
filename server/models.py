from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)  
    industry = db.Column(db.String(100), nullable=False)  

   
    jobs = db.relationship('Job', backref='company_ref', lazy=True, cascade="all, delete-orphan")

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location, 
            'industry': self.industry   
        }

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('company.id'), nullable=False)
    posted_date = db.Column(db.Date, nullable=False)

    
    company = db.relationship('Company', backref='jobs_ref')

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'company_id': self.company_id,
            'posted_date': self.posted_date.isoformat()  
        }

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False) 
    email = db.Column(db.String(100), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }

class JobApplicationJoin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('job.id'), nullable=False)
    application_date = db.Column(db.Date, nullable=False)

    user = db.relationship('User', backref='job_applications')
    job = db.relationship('Job', backref='job_applications')

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'job_id': self.job_id,
            'application_date': self.application_date.isoformat() 
        }
