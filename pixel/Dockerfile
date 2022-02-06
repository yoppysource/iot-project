FROM jjanzic/docker-python3-opencv
COPY . /app
WORKDIR /app

RUN pip3 install -r requirements.txt
ENTRYPOINT ["python3"]
CMD ["start.py"]