


from random import randint, sample


from faker import Faker


from app import app
from models import db, Company, Job, User, JobApplicationJoin

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        
        JobApplicationJoin.query.delete()
        Job.query.delete()
        User.query.delete()
        Company.query.delete()

        
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

        
        users = []
        for _ in range(10):
            user = User(
                username=fake.name(), 
                email=fake.email()
            )
            users.append(user)
            db.session.add(user)

        db.session.commit()

        
        for user in users:
            applied_jobs = sample(jobs, randint(1, 3)) 
            for job in applied_jobs:
                application = JobApplicationJoin(
                    user_id=user.id,
                    job_id=job.id,
                    application_date=fake.date_this_year()
                )
                db.session.add(application)

        db.session.commit()

        print("Seeding complete!")
