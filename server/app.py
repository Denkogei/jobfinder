from flask import Flask, jsonify, make_response, request
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api, Resource
from models import db, Company, Job, User, JobApplicationJoin
from datetime import date

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jobfinder.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)
migrate = Migrate(app, db)
CORS(app)
api = Api(app)

#company
class CompanyResource(Resource):
    def get(self, company_id=None):
        if company_id:
            company = Company.query.get_or_404(company_id)  
            return make_response(jsonify(company.serialize()), 200)  
        else:
            companies = Company.query.all()  
            companies_data = [company.serialize() for company in companies] 
            return make_response(jsonify(companies_data), 200)  

    def post(self):
        data = request.get_json()
        new_company = Company(
            name=data['name'],
            location=data['location'],
            industry=data['industry']
        )
        db.session.add(new_company)
        db.session.commit()
        return make_response(jsonify({"message": "Company created"}), 201)

    def patch(self, company_id):
        data = request.get_json()
        company = Company.query.get_or_404(company_id)
        company.name = data.get('name', company.name)
        company.location = data.get('location', company.location)
        company.industry = data.get('industry', company.industry)
        db.session.commit()
        return make_response(jsonify({"message": "Company updated"}), 200)

    def delete(self, company_id):
        company = Company.query.get_or_404(company_id)
        db.session.delete(company)
        db.session.commit()
        return make_response(jsonify({"message": "Company deleted"}), 200)

# job

class JobResource(Resource):
    def get(self, job_id=None):
        if job_id:
            job = Job.query.get_or_404(job_id)  
            return make_response(jsonify(job.serialize()), 200)  
        else:
            jobs = Job.query.all() 
            jobs_data = [job.serialize() for job in jobs] 
            return make_response(jsonify(jobs_data), 200)  

    def post(self):
        data = request.get_json()
        new_job = Job(
            title=data['title'],
            description=data['description'],
            company_id=data['company_id'],
            posted_date=date.today()
        )
        db.session.add(new_job)
        db.session.commit()
        return make_response(jsonify({"message": "Job created"}), 201)

    def patch(self, job_id):
        data = request.get_json()
        job = Job.query.get_or_404(job_id)
        job.title = data.get('title', job.title)
        job.description = data.get('description', job.description)
        job.company_id = data.get('company_id', job.company_id)
        job.posted_date = data.get('posted_date', job.posted_date)
        db.session.commit()
        return make_response(jsonify({"message": "Job updated"}), 200)

    def delete(self, job_id):
        job = Job.query.get_or_404(job_id)
        db.session.delete(job)
        db.session.commit()
        return make_response(jsonify({"message": "Job deleted"}), 200)

# user

class UserResource(Resource):
    def get(self, user_id=None):
        if user_id:
            user = User.query.get_or_404(user_id)  
            return make_response(jsonify(user.serialize()), 200)  
        else:
            users = User.query.all() 
            users_data = [user.serialize() for user in users] 
            return make_response(jsonify(users_data), 200)  

    def post(self):
        data = request.get_json()
        new_user = User(
            name=data['name'],
            email=data['email']
        )
        db.session.add(new_user)
        db.session.commit()
        return make_response(jsonify({"message": "User created"}), 201)

    def patch(self, user_id):
        data = request.get_json()
        user = User.query.get_or_404(user_id)
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        db.session.commit()
        return make_response(jsonify({"message": "User updated"}), 200)

    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return make_response(jsonify({"message": "User deleted"}), 200)

# job application

class JobApplicationResource(Resource):
    def get(self, user_id=None, job_id=None):
        if user_id and job_id:
            application = JobApplicationJoin.query.filter_by(user_id=user_id, job_id=job_id).first()
            if application:
                return make_response(jsonify({"user_id": application.user_id, "job_id": application.job_id, "application_date": application.application_date}), 200)
            else:
                return make_response(jsonify({"error": "Application not found"}), 404)
        else:
            applications = JobApplicationJoin.query.all()
            applications_data = [{"user_id": app.user_id, "job_id": app.job_id, "application_date": app.application_date} for app in applications]
            return make_response(jsonify(applications_data), 200)

    def post(self):
        data = request.get_json()
        new_application = JobApplicationJoin(
            user_id=data['user_id'],
            job_id=data['job_id'],
            application_date=date.today()
        )
        db.session.add(new_application)
        db.session.commit()
        return make_response(jsonify({"message": "Job application created"}), 201)

    def delete(self, user_id, job_id):
        application = JobApplicationJoin.query.filter_by(user_id=user_id, job_id=job_id).first()
        if not application:
            return make_response(jsonify({"error": "Application not found"}), 404)
        db.session.delete(application)
        db.session.commit()
        return make_response(jsonify({"message": "Job application deleted"}), 200)

# Home Route

class HomeResource(Resource):
    def get(self):
        return make_response("Welcome to JobFinder API!", 200)

# Add Resources to the API
api.add_resource(HomeResource, '/')
api.add_resource(CompanyResource, '/companies', '/companies/<int:company_id>')
api.add_resource(JobResource, '/jobs', '/jobs/<int:job_id>')
api.add_resource(UserResource, '/users', '/users/<int:user_id>')
api.add_resource(JobApplicationResource, '/applications', '/applications/<int:user_id>/<int:job_id>')

# Run the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
    app.run(debug=True)
