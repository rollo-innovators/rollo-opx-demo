# Run django server
make run:
	python manage.py runserver
# Create migrations
make migrations:
	python manage.py makemigrations

# Apply migrations
make migrate:
	python manage.py migrate