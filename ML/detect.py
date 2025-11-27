import pika
from ultralytics import YOLO
import time
import json
for attempt in range(5):
     try:
            model = YOLO("best.pt")

            def callback(ch, method, properties, body):
                job = json.loads(body.decode())
                print("Received job:", job)
                results = model.predict(job.get('path'))
                if results[0]:
                     
                    prediction = results[0].names[0].to_json()
                else:
                     prediction = None
                     
                print("Detections:", results)
                ch.basic_publish(
                     exchange = '',
                     routing_key='results_animal',
                     body = json.dumps({'postId': job.get('postId'), 'prediction': prediction}),
                     properties=pika.BasicProperties(delivery_mode=2)  # make message persistent


                )
                ch.basic_ack(delivery_tag=method.delivery_tag)


            credentials = pika.PlainCredentials('admin', 'secret')
            connection = pika.BlockingConnection(pika.ConnectionParameters(host="rabbitmq",port=5672, 
                                                                        credentials=credentials))
            channel = connection.channel()
            channel.queue_declare(queue="detect_animal", durable=True)
            channel.basic_consume(queue="detect_animal", on_message_callback=callback)
            channel.start_consuming()
     except pika.exceptions.AMQPConnectionError:

          time.sleep(5)
          continue
