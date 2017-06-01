# Crowdsourced MTaaS
- This project is designed to develop, implement, and validate a crowdsourced testing environment for mobile apps based on a selected cloud infrastructure i.e. MTaaS (Mobile Testing as a Service).

## Project manager module
- It is a software component supporting mobile app testing projectmanagement. It supports the following features:
- A community-oriented testing project management in terms of project customers, and managers.
- This component supports diverse project management services, including
    - Project customer management, such as addition, update, deletion, and viewing or search projects and related customers.
    - Project management, such as addition, update, deletion, and viewing or search projects and related services.
    - Project information management and services, such as project information posting, collection, and notification, and so on.
    
## Features
- Android application.
- Server scalability and load balancing.
- Multi-tenant architecture.
- Dashboard showing project statistics.
- Role based access control(RBAC) for users.

## Amazon services used
- Load balancing
  - Custom load balancer automatically balances load among active instances.
  - Video: https://youtu.be/2UDwLGRkbSY
- Auto-scaling
  - Achieved based on the following rules:
    1. Add 1 instance when CPU utilization > 80%
    2. Add 1 instance when total instances drop below 2
    3. Remove unnecessary additional instances.
- CloudWatch

## Technology stack
- Android
- Amazon AWS
- Node JS
- Angular JS
- MLab cloud database
- Express JS
- Artillery (Traffic generation testing)

