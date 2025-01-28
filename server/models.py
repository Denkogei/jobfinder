from flask_sqlalchemy import SQLAlchemy
from datetime import date

db = SQLAlchemy()

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)  # Added unique constraint
    location = db.Column(db.String(100), nullable=False)
    industry = db.Column(db.String(100), nullable=False)

    # Relationship with cascade deletion
    jobs = db.relationship('Job', back_populates='company', cascade="all, delete", lazy=True)

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
    company_id = db.Column(db.Integer, db.ForeignKey('company.id', ondelete='CASCADE'), nullable=False, index=True)  # Added index
    posted_date = db.Column(db.Date, nullable=False, default=date.today)  # Default value for date

    # Relationships
    company = db.relationship('Company', back_populates='jobs')
    job_applications = db.relationship('JobApplicationJoin', back_populates='job', cascade="all, delete", lazy=True)

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
    username = db.Column(db.String(100), nullable=False, unique=True)  # Changed from 'name' to 'username'
    email = db.Column(db.String(100), nullable=False, unique=True)  # Added unique constraint

    # Relationship with cascade deletion
    job_applications = db.relationship('JobApplicationJoin', back_populates='user', cascade="all, delete", lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }


class JobApplicationJoin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False, index=True)  # Added index
    job_id = db.Column(db.Integer, db.ForeignKey('job.id', ondelete='CASCADE'), nullable=False, index=True)  # Added index
    application_date = db.Column(db.Date, nullable=False, default=date.today)  # Default value for date

    # Relationships
    user = db.relationship('User', back_populates='job_applications')
    job = db.relationship('Job', back_populates='job_applications')

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'job_id': self.job_id,
            'application_date': self.application_date.isoformat()
        }