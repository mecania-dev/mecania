# Default Requirements Stage
FROM python:3.12

# Set working directory
WORKDIR /app

# Copy requirements.txt and install dependencies
COPY requirements.txt .

# Configure server
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
ADD . .

RUN python mecania/manage.py collectstatic --noinput 

# Run gunicorn as the entrypoint
CMD gunicorn --pythonpath mecania mecania.wsgi:application --bind 0.0.0.0:$PORT
