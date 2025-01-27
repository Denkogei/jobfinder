#!/usr/bin/env python3

# Standard library imports
from random import randint, sample

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Company, Job, User, JobApplicationJoin

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Clear existing data
        JobApplicationJoin.query.delete()
        Job.query.delete()
        User.query.delete()
        Company.query.delete()

        # Seed companies
        companies = []
        for _ in range(5):
            company = Company(
                name=fake.company(),
                location=fake.city(),
                industry=fake.bs()
            )
            companies.append(company)
            db.session.add(company)

        db.session.commit()

        # Seed jobs
        jobs = []
        for _ in range(10):
            job = Job(
                title=fake.job(),
                description=fake.text(max_nb_chars=200),
                company_id=fake.random_element([c.id for c in companies]),
                posted_date=fake.date_this_year()
            )
            jobs.append(job)
            db.session.add(job)

        db.session.commit()

        # Seed users
        users = []
        for _ in range(10):
            user = User(
                username=fake.name(),  # Changed 'name' to 'username'
                email=fake.email()
            )
            users.append(user)
            db.session.add(user)

        db.session.commit()

        # Seed job applications
        for user in users:
            applied_jobs = sample(jobs, randint(1, 3))  # Each user applies to 1-3 random jobs
            for job in applied_jobs:
                application = JobApplicationJoin(
                    user_id=user.id,
                    job_id=job.id,
                    application_date=fake.date_this_year()
                )
                db.session.add(application)

        db.session.commit()

        print("Seeding complete!")
