from confluent_kafka import Consumer, Producer
import json
import os
from events.snaphot_requst_event import ImageCreatedEvent
from get_pixel import getPixel


def error_cb(error):
    print(error)


kafka_config = {
    'bootstrap.servers': os.environ['KAFKA_BROKER'],
    'auto.offset.reset': 'earliest',
    'group.id': os.environ['GROUP_ID'],
    'security.protocol': 'SASL_SSL',
    'sasl.mechanism':   'PLAIN',
    'sasl.username':  os.environ['KAFKA_API_KEY'],
    'sasl.password':   os.environ['KAFKA_API_SECRET'],
    'error_cb': error_cb
}


c = Consumer(kafka_config)
p = Producer(kafka_config)

c.subscribe(['image.created'])


def delivery_report(err, msg):
    """ Called once for each message produced to indicate delivery result.
        Triggered by poll() or flush(). """
    if err is not None:
        print('Message delivery failed: {}'.format(err))
    else:
        print('Message delivered to {} [{}]'.format(
            msg.topic(), msg.partition()))


try:
    while True:
        msg = c.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            print("Consumer error: {}".format(msg.error()))
            continue
        print(msg.value())
        jsonData = json.loads(msg.value().decode('utf-8'))
        if 'imageUrl' not in jsonData:
            continue
        if 'snapshotId' not in jsonData:
            continue
        imageCreatedEvent = ImageCreatedEvent(jsonData)
        print(jsonData)
        pixel = getPixel(imageCreatedEvent.imageUrl)
        data = {}
        data["pixel"] = pixel
        data["snapshotId"] = imageCreatedEvent.snapshotId
        p.produce('image.calculated', json.dumps(
            data), callback=delivery_report)
        print(json.dumps(data))
        p.poll(0)

except KeyboardInterrupt:
    c.close()
    p.flush()
    print("Exit with keyboardInterrupt")
